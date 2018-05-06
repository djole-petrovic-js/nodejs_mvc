const Middleware = use('lib/Middleware');
const SessionManager = use('lib/SessionManager');
const Cookies = use('lib/Cookies');
const Controller = use('lib/Controller');

class Session extends Middleware {
  async handle(req,res,next) {
    if ( req.url.startsWith('/public') ) return next();

    if ( new Controller().wantsJSON(req) ) return next();

    if ( !Cookies.get(req,'sid') ) {
      const sid = await SessionManager.initSession();

      Cookies.set(res,{
        name:'sid',
        value:sid
      });
    }

    return next();
  }
}

module.exports = Session;