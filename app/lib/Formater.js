const moment = require('moment');

class Formater {
  static upper(str) {
    return str.toUpperCase();
  }

  static lower(str) {
    return str.toLowerCase();
  }

  // maybe do it without moment dipendency?
  static date(str,format) {
    if ( typeof str === 'object' ) {
      str = str.toISOString();
    }

    return moment(str).format(format);
  }

  static capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
}

module.exports = Formater;