const Controller = use('lib/Controller');

class LoginRegisterController extends Controller {
  async registerShow(req,res) {
    return res.render('register');
  }

  async registerDo(req,res) {
    const form = this.validate(req.body,{
      username:'required|minlength:20',
      password:'required'
    });

    if ( form.isValid() ) {
      return res.send('You have successfully registered');
    }

    const errors = form.errorMessages();

    return res.json(errors);
    
  }
}

module.exports = LoginRegisterController;