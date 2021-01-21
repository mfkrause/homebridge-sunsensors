const SunpositionAccessory = require('./accessory');

let homebridge;

class SunpositionPlatform {
  constructor(log, config) {
    this.config = config;
    this.log = log;

    // Initialize accessories
    this.sensors = {};
    config.sensors.forEach((sensorConfig) => {
      this.sensors[sensorConfig.name] = new SunpositionAccessory(log, sensorConfig, config);
    });

    // Register new accessories after homebridge loaded
    homebridge.on('didFinishLaunching', this.registerAccessories.bind(this));
  }

  registerAccessories() {
    const { log, config } = this;
    const accessories = [];

    // Initialize sensors
    config.sensors.forEach((sensorConfig) => {
      if (
        !sensorConfig.threshold
        || !sensorConfig.threshold.length
        || typeof sensorConfig.threshold !== 'object'
        || sensorConfig.threshold.length !== 2
        || typeof sensorConfig.threshold[0] !== 'number'
        || typeof sensorConfig.threshold[1] !== 'number') {
        log(`Error: Thresholds of sensor ${sensorConfig.name} are not correctly configured. Please refer to the README.`);
        return;
      }

      const sensor = this.sensors[sensorConfig.name];
      if (!sensor.hasRegistered()) {
        accessories.push(sensor.initializeAccessory());
      }
    });

    // Collect all accessories after initialization to register them with homebridge
    if (accessories.length > 0) {
      homebridge.registerPlatformAccessories('homebridge-sunposition', 'Sunposition', accessories);
    }
  }

  configureAccessory(accessory) {
    const sensor = this.sensors[accessory.displayName];
    if (sensor) {
      sensor.setAccessory(accessory);
      sensor.setRegistered(true);
      accessory.updateReachability(true);
    } else {
      homebridge.unregisterPlatformAccessories('homebridge-sunposition', 'Sunposition', [accessory]);
    }
  }
}

/**
 * Set homebridge reference for platform, called from /index.js
 * @param {object} homebridgeRef The homebridge reference to use in the platform
 */
SunpositionPlatform.setHomebridge = (homebridgeRef) => {
  homebridge = homebridgeRef;
};

module.exports = SunpositionPlatform;
