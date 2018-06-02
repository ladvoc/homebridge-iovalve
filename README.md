# Homebridge GPIO Valve
Control a valve over a GPIO pin as a HomeKit valve accessory.

## Installation
```
npm install homebridge-gpio-valve -g
```

## Configuration
| Name | Description | Valid Values | Default |
|---|---|---|---|
| `pin` | The number to use for opening and closing the valve | The physical pin number of any valid pin. The selected pin should not be written to by any external applications | None |
| `defaultDuration` | The duration to open the value for when triggered. The user can change this value in the Home app | A duration in seconds no greater than 3600 (one hour) | `600` seconds (ten minutes) |
| `type` | The type of the attatched valve. Affects the icon displayed for the accessory in the home app. | `GENERIC_VALVE`, `IRRIGATION`, `SHOWER_HEAD`, or `WATER_FAUCET`; the icon displayed currently only seems to change when this option is set to `IRRIGATION`.  | `GENERIC_VALVE` |
| `isTimed` | Whether or not the valve is on a timer | `true` or `false` | `true` |
| `supportsIdentify` | Whether or not the valve opens in responce to an identify request. The user can trigger an identify request when adding the accessory to their home | `true` or `false` | `true` |
| `identifyDuration` | The duration to open the valve in responce to identify request | Any duration in seconds. Keep this valve as short as possible; just allow the valve to open and be identified | `10` seconds |
| `storageDirectory` | The directory in which to store the duration set by the user through the Home app. The directory is created if it does not exist | The path to any directory which is readable and writeable to NodeJS | A subdirectory called `gpio_valve` within the Homebridge storage directory. Using the deafult Homebridge storage directory, `~/.homebridge/gpio_valve` |
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
    "defaultDuration": 1200,
    "type": "IRRIGATION"
}
```
