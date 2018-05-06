const CSRFShield = use('lib/CSRFShield');
const Cookies = use('lib/Cookies');

class CSRF {
  async handle(req,res,next) {
    if ( req.method === 'GET' ) {
      const token = CSRFShield.csrfToken();

      req.csrfToken = () => token;

      Cookies.set(res,{
        name:'_token',
        value:token
      })

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