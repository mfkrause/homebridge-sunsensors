const SunpositionPlatform = require('./base/platform');

/* Register platform, set global variables */
module.exports = (homebridge) => {
  global.Service = homebridge.hap.Service;
  global.Characteristic = homebridge.hap.Characteristic;
  global.UUIDGen = homebridge.hap.uuid;
  global.Accessory = homebridge.platformAccessory;

  SunpositionPlatform.setHomebridge(homebridge);

  homebridge.registerPlatform('homebridge-sunposition', 'Sunposition', SunpositionPlatform);
};
