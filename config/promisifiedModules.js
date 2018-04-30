const bluebird = require('bluebird');

const objectsToPromisify = [
  { moduleName:'fs', moduleToPromisify:'fs' },
  { moduleName:'bcrypt', moduleToPromisify:'bcrypt-nodejs' }
];

const all = {};

objectsToPromisify
  .map(({ moduleName,moduleToPromisify }) => {
    const mod = require(moduleToPromisify);

    return {
      moduleName,
      moduleToPromisify:bluebird.promisifyAll(mod)
    };
  })
  .forEach(({ moduleName,moduleToPromisify }) => {
    all[moduleName] = moduleToPromisify;
  });

module.exports = all;