const Gpio = require('onoff').Gpio;

class GPIOValve {

    constructor(pin, openOnHigh = true) {

        if (!pin) { throw new Error('A valve control pin must be specified') }

        this._openLevel   = +openOnHigh
        this._closedLevel = +!openOnHigh

        this._valve = new Gpio(pin, 'out')
        this._writeClosed()

        process.on('SIGINT', () => {
            this._valve.unexport()
        })
    }

    openFor(duration, done) {

        this._startTime = Date.now()
        this._duration = duration * 1000

        this.open()

        this._timer = setTimeout(() => {
            this.close()
            done()
        }, this._duration)

    }

    get elasped() {
        if (!this._isOpen) { return 0 }
        return msToS(Date.now() - this._startTime)
    }

    get remaining() {
        if (!this._isOpen) { return 0 }
        return msToS(this._duration) - this.elasped
    }

    open() {
        this._isOpen = true
        this._writeOpen()
    }

    close() {
        this._isOpen = false
        this._startTime = 0
        this._duration = 0
        clearTimeout(this._timer)
        this._writeClosed()
    }

    _writeOpen() {
        this._valve.writeSync(this._openLevel)
    }

    _writeClosed() {
        this._valve.writeSync(this._closedLevel)
    }

}
module.exports = GPIOValve

function msToS(val) {
    return Math.round(val / 1000)
}
