const Middleware = use('lib/Middleware');

class CheckIfLoggedIn extends Middleware {
  async handle(req,res,next) {
    req.user = {
      username:'djole',
      email:'mail'
    }

    const error = new Error();
    error.message = 'Not allowed';

    return next();
    // return res.send('not authorized');
  }
}

module.exports = CheckIfLoggedIn;