const moment = require('moment');

class Formater {
  upper(str) {
    return str.toUpperCase();
  }

  lower(str) {
    return str.toLowerCase(); 
  }

  // maybe do it without moment dependency?
  date(str,format) {
    if ( typeof str === 'object' ) {
      str = str.toISOString();
    }

    return moment(str).format(format);
  }

  capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  currency(str,currencyVal) {
    str = Number(str);

    return Number.isNaN(str)
      ? str
      : String(str.toFixed(2)) + ( currencyVal ? currencyVal : '$' );
  }

  limitTo(str,num) {
    num = Number(num);

    if ( !num || Number.isNaN(num) ) return str;

    return str.slice(0,num);
  }
}

module.exports = Formater;