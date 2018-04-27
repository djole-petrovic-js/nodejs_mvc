module.exports = () => {
  const globals = require('../../config/globals');

  for ( const [name,fn] of Object.entries(globals) ) {
    global[name] = fn;
  }
}