var Service, Characteristic;
const packageFile = require('./package.json')

const toCase = require('to-case')

module.exports = (homebridge) => {
    Service = homebridge.hap.Service
    Characteristic = homebridge.hap.Characteristic
    homebridge.registerAccessory(packageFile.name, 'GPIOValve', GPIOValveAccessory)
}

class GPIOValveAccessory {

    constructor(log, config) {
        this.log = log

        this.manufacturer     = config.manufacturer     || packageFile.author
        this.model            = config.model            || toCase.title(packageFile.name)
        this.serialNumber     = config.serialNumber     || 'None'
        this.firmwareRevision = config.firmwareRevision || packageFile.version
    }

    identify(callback) {
        callback()
    }

    getServices() {
        this.informationService = new Service.AccessoryInformation()
        this.informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serialNumber)
	        .setCharacteristic(Characteristic.FirmwareRevision, this.firmwareRevision)

        return [
            this.informationService
        ]
    }

}
