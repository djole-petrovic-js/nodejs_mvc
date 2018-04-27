const fs = require('fs');
const path = require('path');

module.exports = (env) => {
  try {
    fs
      .readFileSync(env,'utf-8')
      .split('\n')
      .filter(x => x && x !== '')
      .map(x => x.trim() && x.split('='))
      .forEach(([key,value = '']) => {
        process.env[key] = process.env[key] || value;
      });

  } catch(e) {
    console.error(e);
  }
}