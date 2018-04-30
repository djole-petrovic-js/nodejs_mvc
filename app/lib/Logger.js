const fs = requirePromisified('fs');
const path = require('path');

const { LOGS:{ PATH,DEFAULT_NAME,EXTENSION } } = require('../../config');

class Logger {
  static async log(error,location = null) {
    try {
      const timestamp = new Date().toLocaleString();

      const content = `
        *******************************************
        Date : ${ timestamp }
        ${ error } \n
        Stack trace : ${ error.stack || 'none' } \n
        *******************************************
      `;

      const logPath = path.join(PATH,(location ? location : DEFAULT_NAME)  + EXTENSION);

      await fs.writeFileAsync(logPath,content,{ flag:'a' });
    } catch(e) {
      console.error('Could not logg error ' + e);
    }
  }
}

module.exports = Logger;