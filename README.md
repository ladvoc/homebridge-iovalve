# Homebridge GPIO Valve

[![Greenkeeper badge](https://badges.greenkeeper.io/jacobgelman/homebridge-gpio-valve.svg)](https://greenkeeper.io/)

Control a valve over a GPIO pin as a HomeKit valve accessory.

## Installation
```
sudo npm install homebridge-gpio-valve -g --unsafe-perm
```
<small>Depending on how you have Node installed, you may or may not need `sudo` and the `--unsafe-perm` flag.</small>

## Configuration
| Name | Description | Valid Values | Default |
|---|---|---|---|
| `pin` | The pin to use for opening and closing the valve | The GPIO pin number of any valid pin. The selected pin should not be written to by any external applications | None |
| `openOnHigh` | Whether or not the valve opens when the pin is high | `true` or `false` | `true`|
| `defaultDuration` | The duration to open the value for when triggered. The user can change this value in the Home app | A duration in seconds no greater than 3600 (one hour) | `600` seconds (ten minutes) |
| `type` | The type of attached valve. Affects the icon displayed for the accessory in the Home app. | As of iOS 11.3: `"GENERIC_VALVE"`, `"IRRIGATION"`, `"SHOWER_HEAD"`, or `"WATER_FAUCET"` | `"GENERIC_VALVE"` |
| `isTimed` | Whether or not the valve is on a timer | `true` or `false` | `false` |
| `supportsIdentify` | Whether or not the valve opens in responce to an identify request. The user can trigger an identify request when adding the accessory to their home | `true` or `false` | `true` |
| `identifyDuration` | The duration to open the valve for in responce to an identify request | Any duration in seconds. Keep this valve as short as possible; just allow the valve to open and be identified | `10` seconds |
| `storageDirectory` | The directory for storing the user set duration. The directory is created if it does not exist | The path to any directory which is readable and writeable to Node | A subdirectory called `gpio_valve` within the Homebridge storage directory. Using the default Homebridge storage directory: `~/.homebridge/gpio_valve` |
| `manufacturer` | The value of the manufacturer characteristic of the information service | Any string | The author of this package |
| `model` | The value of the model characteristic of the information service | Any string | `"GPIO Valve"` |
| `serialNumber` | The value of the serial number characteristic of the information service | Any string | `"None"` |
| `firmwareRevision` | The value of the firmware revision characteristic of the information service | Any string | The current version of this package |

### Sample
```json
 {
    "accessory": "GPIOValve",
    "name": "Grass",
    "pin": 11,
    "openOnHigh": false,
    "isTimed": true,
    "defaultDuration": 1200,
    "type": "IRRIGATION"
}
```
## Known Issues
- As of iOS 11.3, the Home app only displays a special icon for irrigation valves. All other valve types receive the same generic icon.
