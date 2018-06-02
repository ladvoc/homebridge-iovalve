const rpio = require('rpio')

class GPIOValve {

    constructor(pin, openOnHigh = true) {

        if (!pin) { throw new Error('A valve control pin must be specified') }

        this._pin = pin
        this._openLevel   = +openOnHigh
        this._closedLevel = +!openOnHigh

        rpio.open(pin, rpio.OUTPUT, this._closedLevel)
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
        rpio.write(this._pin, this._openLevel)
    }

    close() {
        this._isOpen = false
        this._startTime = 0
        this._duration = 0
        clearTimeout(this._timer)
        rpio.write(this._pin, this._closedLevel)
    }

}
module.exports = GPIOValve

function msToS(val) {
    return Math.round(val / 1000)
}
