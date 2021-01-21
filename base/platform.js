const SunpositionAccessory = require('./accessory');

let homebridge;

class SunpositionPlatform {
  constructor(log, config) {
    this.config = config;
    this.log = log;
    this.accessories = [];

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

    // Unregister removed accessories first
    this.accessories.forEach((accessory) => {
      const configExists = config.sensors.find(
        (sensor) => UUIDGen.generate(sensor.name) === accessory.UUID,
      );

      if (!configExists) {
        log('Removing existing platform accessory from cache:', accessory.displayName);
        try {
          homebridge.unregisterPlatformAccessories('homebridge-sunposition', 'Sunposition', [accessory]);
        } catch (e) {
          log('Could not unregister platform accessory!', e);
        }
      }
    });

    // Initialize sensors
    config.sensors.forEach((sensorConfig) => {
      log('Registering accessory:', sensorConfig.name);

      if (
        !sensorConfig.threshold
        || !sensorConfig.threshold.length
        || typeof sensorConfig.threshold !== 'object'
        || sensorConfig.threshold.length !== 2
        || typeof sensorConfig.threshold[0] !== 'number'
        || typeof sensorConfig.threshold[1] !== 'number'
        || sensorConfig.threshold[0] > 720
        || sensorConfig.threshold[0] < -360
        || sensorConfig.threshold[1] > 720
        || sensorConfig.threshold[1] < -360) {
        log(`Error: Thresholds of sensor ${sensorConfig.name} are not correctly configured. Please refer to the README.`);
        return;
      }

      const sensor = this.sensors[sensorConfig.name];
      if (!sensor.hasRegistered()) {
        this.accessories.push(sensor.initializeAccessory());
      }
    });

    // Collect all accessories after initialization to register them with homebridge
    if (this.accessories.length > 0) {
      homebridge.registerPlatformAccessories('homebridge-sunposition', 'Sunposition', this.accessories);
    }
  }

  configureAccessory(accessory) {
    this.accessories.push(accessory);
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
