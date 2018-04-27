const Controller = use('lib/Controller');

class UsersController extends Controller {
  async index(req,res) {
    return res.render('users',{
      title:'User Panel MOFO!',
      users:[
        { username:'djole', email:'macka' },
        { username:'keba', email:'kraba' }
      ]
    });
  }
}

module.exports = UsersController;