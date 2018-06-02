const fs = require('fs')
const GPIOValve = require('./GPIOValve')
const moment = require('moment')
const momentDurationFormat = require('moment-duration-format')
const packageFile = require('./package.json')
const path = require('path')
const to = require('to-case')

var Service, Characteristic
var storageDirectory

module.exports = (homebridge) => {
    Service = homebridge.hap.Service
    Characteristic = homebridge.hap.Characteristic
    storageDirectory = homebridge.user.storagePath()
    homebridge.registerAccessory(packageFile.name, 'GPIOValve', GPIOValveAccessory)
}

class GPIOValveAccessory {

    constructor(log, config) {
        this.log = log

        // Accessory information
        this.manufacturer     = config.manufacturer     || packageFile.author
        this.model            = config.model            || 'GPIO Valve'
        this.serialNumber     = config.serialNumber     || 'None'
        this.firmwareRevision = config.firmwareRevision || packageFile.version

        // Timer & duration
        this.isTimed = this.isTimed || true

        if (this.isTimed) {
            this.defaultDuration  = config.defaultDuration  || 600

            const directory = config.storageDirectory ||
                              path.join(storageDirectory, 'gpio_valve')

            if (!fs.existsSync(directory)) {
                this.log("Specified storage directory does not exist. Creating...")
                try {
                    fs.mkdirSync(directory)
                } catch (error) {
                    this.log.error('Could not create storage directory')
                    this.log.error(error.message)
                    process.exit(1)
                }
            }

            const fileName = `${to.snake(config.name)}.json`
            this.persistFilePath = path.join(directory, fileName)
        }

        // Valve type
        if (config.type) {
            const valveTypes = Object.keys(Characteristic.ValveType)
            if (valveTypes.includes(config.type)) {
                this.type = Characteristic.ValveType[config.type]
            } else {
                this.log.error(`'${config.type}' is not a supported valve type.`)
                process.exit(2)
            }
        } else {
            this.type = Characteristic.ValveType.GENERIC_VALVE
        }

        // Identification
        this.supportsIdentify = config.supportsIdentify || true
        this.identifyDuration = config.identifyDuration || 10

        try {
            this.valve = new GPIOValve(config.pin, config.openOnHigh)
        } catch (error) {
            this.log.error('Error initializing GPIO valve')
            this.log.error(error.message)
            process.exit(3)
        }
    }

    identify(callback) {
        if (!this.supportsIdentify || this.identifyInProgress) {
            this.log('Identify request (will not open valve)')
            callback()
            return
        }

        this.log('Opening valve for identification')
        this.identifyInProgress = true

        this.valve.openFor(this.identifyDuration, () => {
            this.log('Closing valve')
            this.identifyInProgress = false
        })

        callback()
    }

    get duration() {
        if (this.cahcedDuration) {
            return this.cahcedDuration
        } else if (!fs.existsSync(this.persistFilePath)) {
            return this.defaultDuration
        }

        var contents, decoded
        try {
            contents = fs.readFileSync(this.persistFilePath, 'utf8')
            decoded = JSON.parse(contents)
        } catch(error) {
            this.log.warn('Error reading saved duration. Using default')
            this.log.warn(error.message)
            return this.defaultDuration
        }

        const duration = decoded.duration
        this.cahcedDuration = duration
        return duration
    }

    set duration(val) {
        this.cahcedDuration = val
        this.log(`Duration set to ${this.durationFormatted}`)

        const contents = { duration: val }
        const encoded = JSON.stringify(contents)

        fs.writeFile(this.persistFilePath, encoded, (error) => {
            if (error) {
                this.log.warn('Error writing duration')
                this.log.warn(error.message)
            }
        })
    }

    get durationFormatted() {
        return moment.duration(this.duration, 'seconds').format()
    }

    getServices() {
        this.informationService = new Service.AccessoryInformation()
        this.informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serialNumber)
	        .setCharacteristic(Characteristic.FirmwareRevision, this.firmwareRevision)

        this.valveService = new Service.Valve()
    	this.valveService
            .setCharacteristic(Characteristic.ValveType, this.type)

        if (this.isTimed) {
            this.valveService
                .setCharacteristic(Characteristic.SetDuration, this.duration)

            this.valveService.getCharacteristic(Characteristic.SetDuration)
            .on('get', (callback) => {
                callback(null, this.duration)
            })
            .on('set', (duration, callback) => {
                this.duration = duration
                callback()
            })

            this.valveService.getCharacteristic(Characteristic.RemainingDuration)
            .on('get', (callback) => {
                callback(null, this.valve.remaining)
            })
        }

        this.valveService.getCharacteristic(Characteristic.Active)
        .on('set', (isActive, callback) => {
            if (isActive == +true) {

                if (this.isTimed) {

                    this.log(`Opening valve for ${this.durationFormatted}`)
                    this.valve.openFor(this.duration, () => {
                        this.valveService
                            .setCharacteristic(Characteristic.Active, +false)
                            .setCharacteristic(Characteristic.InUse,  +false)
                            .setCharacteristic(Characteristic.RemainingDuration, 0)
                    })

                    this.valveService
                        .setCharacteristic(Characteristic.RemainingDuration, this.valve.remaining)

                } else {
                    this.log('Opening valve')
                    this.valve.open()
                }

                this.valveService
                    .setCharacteristic(Characteristic.InUse, +true)

            } else {
                this.log('Closing valve')
                this.valve.close()
                this.valveService
                    .setCharacteristic(Characteristic.InUse, +false)
                    .setCharacteristic(Characteristic.RemainingDuration, 0)
            }
            callback()
        })

        return [
            this.informationService,
            this.valveService
        ]
    }

}
