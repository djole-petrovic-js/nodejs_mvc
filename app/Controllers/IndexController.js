const Controller = use('lib/Controller');

class IndexController extends Controller {
  async index(req,res) {
    return res.render('index');
  }

  async about(req,res) {
    return res.render('about',{
      name:'Djole',
      lastname:'Petrovic',
    });
  }

  async login(req,res) {
    const { username,password } = req.query;

    return res.json({ username,password })
  }

  async loginPOST(req,res) {
    const isValid = this.validate(req.body,{});

    return res.send('proslo kao');
  }

  async xhr(req,res) {
    return res.json({
      username:'kao',
      password:'kao....'
    });
  }
}

module.exports = IndexController;