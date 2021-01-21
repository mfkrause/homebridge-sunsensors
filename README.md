# homebridge-sunposition

This is a plugin for [homebridge](https://github.com/nfarina/homebridge). It allows you to create sensors (occupancy sensors) which will be turned on or off based on the current sun position (azimuth). This is especially useful to, for example, fine-control window coverings.

# Installation

1.  Install homebridge (if not already installed) using: `npm install -g homebridge`
2.  Install this plugin using: `npm install -g homebridge-sunposition`
3.  Update your configuration file (see below).

# Example Configuration

See `config-sample.json` for an example config. This plugin can also be configured through a GUI like [homebridge-config-ui-x](https://github.com/oznu/homebridge-config-ui-x).

## Platform Configuration

| Parameter | Note                                                                  |
| --------- | --------------------------------------------------------------------- |
| `lat`     | Latitude of the location the sun position should be calculated for.   |
| `long`    | Longitude of the location the sun position should be calculated for.  |
| `sensors` | Array of objects containing configuration for the sensors, see below. |

## Sensors Configuration

| Parameter   | Note                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `name`           | Display name of the sensor.                                                                                |
| `lowerThreshold` | Lower threshold in degrees between -360 and 720 (-360 to 0 and 360 to 720 can be used to create overlaps). |
| `upperThreshold` | Upper threshold in degrees between -360 and 720 (-360 to 0 and 360 to 720 can be used to create overlaps). |

**Thresholds example**: If you want the sensor to turn on when the sun is between 0° and 90° azimuth, set the lower threshold to 0 and the upper threshold to 90. See the example configuration file for a basic set-up (north, east, south, west).