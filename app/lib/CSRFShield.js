const { URL } = require('url');

class CSRFShield {
  static _generateToken() {
    const chars = [
      'a','b','c','d','e','f','g','h','y',
      '1','2','3','4','5','6','7','8','9'
    ];

    const token = [];
    const min = 0;
    const max = chars.length;

    for ( let i = 0; i < 50; i++ ) {
      const index = min + Math.floor(Math.random() * (max - min + 1));
      token.push(chars[index]);
    }

    return token.join('');
  }

  static csrfToken() {
    const token = CSRFShield._generateToken();

    return token;
  }

  static verify(req) {
    return CSRFShield.checkTokenAndCookie(req);
  }

  static checkOrigin(req) {
    if ( !req.headers.origin && !req.headers.referer ) {
      return false;
    }

    const url = new URL(req.headers.origin || req.headers.referer);
    const expectedProtocol = 'http:';
    const expectedOrigin = 'http://localhost:3001';
    const expectedPort = '3001';

    if (
      expectedOrigin   !== url.origin   ||
      expectedProtocol !== url.protocol ||
      expectedPort     !== url.port
    ) {
      return false;
    }

    return true;
  }

  static checkTokenAndCookie(req) {
    const tokenFromBody = req.body._token;

    if ( !tokenFromBody ) return false;

    if ( !req.headers.cookie ) return false;

    const tokenFromCookie = req.headers.cookie
      .split(';')
      .filter(x => x && x !== '')
      .map(x => x.split('='))
      .map(x => [x[0].trim(),x[1].trim()])
      .find(cookie => cookie[0] === '_token');

    if ( !tokenFromCookie ) return false;

    if ( tokenFromCookie[1] !== tokenFromBody ) return false;

    return true;
  }
}

module.exports = CSRFShield;