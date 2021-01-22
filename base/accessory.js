const suncalc = require('suncalc');

class SunsensorAccessory {
  constructor(log, config, platformConfig) {
    this.accessory = null;
    this.registered = null;
    this.config = config;
    this.platformConfig = platformConfig;
    this.log = log;
  }

  getAccessory() {
    return this.accessory;
  }

  setAccessory(accessory) {
    this.accessory = accessory;
    this.setAccessoryEventHandlers();
  }

  hasRegistered() {
    return this.registered;
  }

  initializeAccessory() {
    const { config } = this;
    const uuid = UUIDGen.generate(config.name);
    const accessory = new Accessory(config.name, uuid);

    const SensorService = accessory.addService(Service.OccupancySensor, config.name);

    if (SensorService) {
      SensorService.getCharacteristic(Characteristic.OccupancyDetected);

      SensorService.setCharacteristic(Characteristic.OccupancyDetected, this.updateState());
      setInterval(() => {
        SensorService.setCharacteristic(Characteristic.OccupancyDetected, this.updateState());
      }, 10000);
    }

    this.setAccessory(accessory);

    return accessory;
  }

  setRegistered(status) {
    this.registered = status;
  }

  setAccessoryEventHandlers() {
    const { log } = this;

    this.getAccessory().on('identify', (paired, callback) => {
      log(this.getAccessory().displayName, `Identify sensor, paired: ${paired}`);
      callback();
    });

    const SensorService = this.getAccessory().getService(Service.OccupancySensor);

    if (SensorService) {
      SensorService
        .getCharacteristic(Characteristic.OccupancyDetected)
        .on('get', this.getState.bind(this));
    }
  }

  updateState() {
    const { config, platformConfig, log } = this;
    const { lat, long } = platformConfig;
    const { lowerThreshold, upperThreshold } = config;
    const threshold = [lowerThreshold, upperThreshold];

    if (!lat || !long || typeof lat !== 'number' || typeof long !== 'number') {
      log('Error: Lat/Long incorrect. Please refer to the README.');
      return 0;
    }

    const sunPos = suncalc.getPosition(Date.now(), lat, long);
    let sunPosDegrees = Math.abs((sunPos.azimuth * 180) / Math.PI + 180);

    if (platformConfig.debugLog) log(`Current azimuth: ${sunPosDegrees}°`);

    if (threshold[0] > threshold[1]) {
      const tempThreshold = threshold[1];
      threshold[1] = threshold[0];
      threshold[0] = tempThreshold;
    }

    let newState;
    if (sunPosDegrees >= threshold[0] && sunPosDegrees <= threshold[1]) {
      newState = 1;
    } else {
      newState = 0;
    }
    if (threshold[0] < 0 && newState === 0) {
      sunPosDegrees = -(360 - sunPosDegrees);
      if (sunPosDegrees >= threshold[0] && sunPosDegrees <= threshold[1]) {
        newState = 1;
      } else {
        newState = 0;
      }
    }
    if (threshold[1] > 360 && newState === 0) {
      sunPosDegrees = 360 + sunPosDegrees;
      if (sunPosDegrees >= threshold[0] && sunPosDegrees <= threshold[1]) {
        newState = 1;
      } else {
        newState = 0;
      }
    }

    return newState;
  }

  getState(callback) {
    const { platformConfig, log } = this;
    const newState = this.updateState();

    callback(null, newState);
    if (platformConfig.debugLog) log(this.getAccessory().displayName, `getState: ${newState}`);
  }
}

module.exports = SunsensorAccessory;
