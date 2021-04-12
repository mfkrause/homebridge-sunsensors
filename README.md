# Homebridge Sunlight
[![npm-version](https://badgen.net/npm/v/homebridge-sunlight)](https://www.npmjs.com/package/homebridge-sunlight))
[![npm-downloads](https://badgen.net/npm/dt/homebridge-sunlight))](https://www.npmjs.com/package/homebridge-sunlight))


This is a plugin for [homebridge](https://github.com/nfarina/homebridge). It provides contact sensors to automate sun protection. Sensors are opened (breached) when the sun is in a given section of the sky (azimuth) and optionally if an [OpenWeather API key](https://openweathermap.org/api) is provided when the sun is above the horizon and the sky is not overcast.


# Installation
Intall via hombridge GUI [homebridge-config-ui-x](https://github.com/oznu/homebridge-config-ui-x) or manually via:

1.  Install homebridge (if not already installed) using: `npm install -g homebridge`
2.  Install this plugin using: `npm install -g homebridge-sunlight`
3.  Update your configuration file (see below).

# Example Configuration

See `config-sample.json` for an example config. This plugin can also be configured through a GUI like [homebridge-config-ui-x](https://github.com/oznu/homebridge-config-ui-x).

## Platform Configuration

| Parameter  | Note                                                                  |
| ---------- | --------------------------------------------------------------------- |
| `lat`      | Latitude of the location the sun position should be calculated for   |
| `long`     | Longitude of the location the sun position should be calculated for  |
| `apikey`     | Your [OpenWeather API key](https://openweathermap.org/api), optional  |
| `sensors`  | Array of objects containing configuration for the sensors, see below |
| `debugLog` | Debug log output, optional, default: false                 |

## Sensors Configuration

| Parameter   | Note                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `name`           | Display name of the sensor.                                                                                |
| `lowerThreshold` | Lower threshold in degrees between -360 and 720 (-360 to 0 and 360 to 720 can be used to create overlaps). |
| `upperThreshold` | Upper threshold in degrees between -360 and 720 (-360 to 0 and 360 to 720 can be used to create overlaps). |

**Thresholds example**: If you want the sensor to turn on when the sun is between 0° and 90° azimuth, set the lower threshold to 0 and the upper threshold to 90. See the example configuration file for a basic set-up (north, east, south, west).

For help or in case of issues please visit the [GitHub repository](https://github.com/Krillle/homebridge-sunhsine/issues).    
This plugin is based on [homebridge-sunsensors](https://github.com/mfkrause/homebridge-sunsensors).
