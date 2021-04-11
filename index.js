const SunlightPlatform = require('./base/platform');

/* Register platform, set global variables */
module.exports = (homebridge) => {
  global.Service = homebridge.hap.Service;
  global.Characteristic = homebridge.hap.Characteristic;
  global.UUIDGen = homebridge.hap.uuid;
  global.Accessory = homebridge.platformAccessory;

  SunlightPlatform.setHomebridge(homebridge);

  homebridge.registerPlatform('homebridge-sunlight', 'Sunlight', SunlightPlatform);
};
