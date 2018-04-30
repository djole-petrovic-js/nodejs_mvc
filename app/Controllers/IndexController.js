const Controller = use('lib/Controller');
const Password = use('lib/Password');

class IndexController extends Controller {
  async index(req,res) {
    return res.render('index');
  }

  async about(req,res) {
    return res.render('about',{
      name:'Djole',
      lastname:'Petrovic',
      show:true
    });
  }

  async xhr(req,res) {
    return res.json({
      username:'kao',
      password:'kao....'
    });
  }
}

module.exports = IndexController;