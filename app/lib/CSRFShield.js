const { URL } = require('url');
const Cookies = use('lib/Cookies');

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
    return CSRFShield.checkOrigin(req) && CSRFShield.checkTokenAndCookie(req);
  }

  static checkOrigin(req) {
    if ( !req.headers.origin && !req.headers.referer ) {
      return false;
    }

    const url = new URL(req.headers.origin || req.headers.referer);
    const expectedProtocol = 'http:';
    const expectedOrigin = 'http://localhost:3000';
    const expectedPort = '3000';

    return !(
      expectedOrigin   !== url.origin   ||
      expectedProtocol !== url.protocol ||
      expectedPort     !== url.port
    );
  }

  static checkTokenAndCookie(req) {
    const tokenFromBody = req.body._token;

    if ( !tokenFromBody ) return false;

    return Cookies.get(req,'_token') === tokenFromBody;
  }
}

module.exports = CSRFShield;