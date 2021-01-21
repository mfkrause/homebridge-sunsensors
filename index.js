const SunsensorPlatform = require('./base/platform');

/* Register platform, set global variables */
module.exports = (homebridge) => {
  global.Service = homebridge.hap.Service;
  global.Characteristic = homebridge.hap.Characteristic;
  global.UUIDGen = homebridge.hap.uuid;
  global.Accessory = homebridge.platformAccessory;

  SunsensorPlatform.setHomebridge(homebridge);

  homebridge.registerPlatform('homebridge-sunsensors', 'Sunsensor', SunsensorPlatform);
};
