const CSRFShield = use('lib/CSRFShield');

class CSRF {
  async handle(req,res,next) {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0]  || req.connection.remoteAddress;

    if ( req.method === 'GET' ) {
      const token = CSRFShield.csrfToken();

      req.csrfToken = () => token;
      res.setHeader('Set-Cookie','_token=' + token);

      return next();
    }

    if ( !CSRFShield.verify(req) ) {
      const error = new Error('Bad Request.');
      error.status = 400;

      return next(error);
    }

    return next();
  }
}

module.exports = CSRF;