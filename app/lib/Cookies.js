class Cookies {
  static set(res,cookieObj) {
    const {
      name,
      value
    } = cookieObj;

    if ( !name || !value ) throw new Error('Missing key or value when creating cookie');

    return res.setHeader('Set-Cookie',`${ name }=${ value }`);
  }

  static get(req,cookieName) {
    return Cookies.getAll(req)[cookieName];
  }

  static getAll(req) {
    if ( !req.headers.cookie ) return {};

    return req.headers.cookie
      .split(';')
      .filter(x => x && x !== '')
      .map(x => x.split('='))
      .map(x => [x[0].trim(),x[1].trim()])
      .reduce((total,[key,value]) => {
        total[key] = value; return total;
      },{});
  }
}

module.exports = Cookies;