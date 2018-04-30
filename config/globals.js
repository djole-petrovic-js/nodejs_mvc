const path = require('path');
const { PATHS:{ APP,ROOT } } = require('../config');
const promisifiedModules = require('./promisifiedModules');

module.exports = {
  use:(str) => {
    return require(path.join(APP,str));
  },
  requirePromisified:(moduleName) => {
    if ( !promisifiedModules[moduleName] ) {
      throw new Error('Promisified module does not exist.');
    }

    return promisifiedModules[moduleName];
  },
  requireFromConfig: (moduleName) => {
    return require(path.join(ROOT,'config',moduleName));
  },
  requireConfig() {
    return require(path.join(ROOT,'config'));
  }

}