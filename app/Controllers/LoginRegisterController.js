const Controller = use('lib/Controller');
const User = use('Models/User');
const Password = use('lib/Password');

class LoginRegisterController extends Controller {
  async registerShow(req,res) {
    const messages = await req.flash.get('messages');
    const message = await req.flash.get('message');
    const data = { _token:req.csrfToken() };

    if ( message ) {
      data.message = message;
    }

    if ( messages ) {
      data.errors = messages;
    }

    return res.render('register',data);
  }

  async registerDo(req,res) {
    const form = this.validate(req.body,{
      username:'required',
      password:'required'
    });

    if ( !form.isValid() ) {
      const errors = form.errorMessages();

      await req.flash.set('messages',errors);

      return res.redirect('/register');
    }

    const { username,password,email } = req.body;
    const usernameExists = await User.all({ where:{ username } });

    if ( usernameExists.length !== 0 ) {
      await req.flash.set('message','Username aleady exists!');

      return res.redirect('/register');
    }

    const emailExists = await User.all({ where:{ email } });

    if ( emailExists.length !== 0 ) {
      await req.flash.set('message','Email aleady exists!');

      return res.redirect('/register');
    }

    const hash = await Password.hash(password);

    await User.insert({
      username,
      password:hash,
      email
    });

    return res.send('yeah');
  }
}

module.exports = LoginRegisterController;