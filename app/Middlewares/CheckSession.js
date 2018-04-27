const Middleware = use('lib/Middleware');

class CheckSession extends Middleware {
  async handle(req,res,next) {
    return next();
  }
}

module.exports = CheckSession;