const suncalc = require('suncalc');

class SunpositionAccessory {
  constructor(log, config) {
    this.accessory = null;
    this.hasRegistered = null;
    this.config = config;
    this.log = log;
  }

  initializeAccessory() {
    const { config } = this;
    const uuid = UUIDGen.generate(config.name);
    const accessory = new Accessory(config.name, uuid);

    const SensorService = accessory.addService(Service.OccupancySensor, config.name);

    if (SensorService) {
      SensorService.getCharacteristic(Characteristic.OccupancyDetected).setValue(0);
    }

    this.setAccessory(accessory);

    return accessory;
  }

  getAccessory() {
    return this.accessory;
  }

  setAccessory(accessory) {
    this.accessory = accessory;
    this.setAccessoryEventHandlers();
  }

  hasRegistered() {
    return this.hasRegistered;
  }

  setRegistered(status) {
    this.hasRegistered = status;
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

  getState(callback) {
    const { config, log } = this;
    const { lat, long } = config;
    const { threshold } = config;

    if (
      !config.lat
      || !config.long
      || typeof config.lat !== 'number'
      || typeof config.long !== 'number') {
      log('Error: Lat/Long incorrect. Please refer to the README.');
      callback(null, 0);
      return;
    }

    const sunPos = suncalc.getPosition(Date.now(), lat, long);
    const sunPosDegrees = (sunPos.azimuth * 180) / Math.PI;

    if (threshold[0] < 0) threshold[0] = 360 + threshold[0];
    if (threshold[1] < 0) threshold[1] = 360 + threshold[1];

    if (
      (sunPosDegrees >= threshold[0] && sunPosDegrees <= threshold[1])
      || (sunPosDegrees >= threshold[1] && sunPosDegrees <= threshold[0])
    ) {
      callback(null, 1);
      log(this.getAccessory().displayName, 'getState: 1');
    } else {
      callback(null, 0);
      log(this.getAccessory().displayName, 'getState: 0');
    }
  }
}

module.exports = SunpositionAccessory;
