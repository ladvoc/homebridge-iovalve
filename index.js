var Service, Characteristic;
const packageFile = require('./package.json')

module.exports = (homebridge) => {
    Service = homebridge.hap.Service
    Characteristic = homebridge.hap.Characteristic
    homebridge.registerAccessory(packageFile.name, 'GPIOValve', GPIOValveAccessory)
}

class GPIOValveAccessory {

    constructor(log, config) {
        this.log = log

        this.manufacturer = config.manufacturer
        this.model = config.model
        this.serial = config.serial
    }

    identify(callback) {
        callback()
    }

    getServices() {
        this.informationService = new Service.AccessoryInformation()
        this.informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serial)
	    .setCharacteristic(Characteristic.FirmwareRevision, packageFile.version)

        return [
            this.informationService
        ]
    }

}
