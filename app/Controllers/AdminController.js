const Controller = use('lib/Controller');

class AdminController extends Controller {
  async index(req,res) {
    return res.render('admin');
  }

  async config(req,res) {
    return res.send('macka neka');
  }
}

module.exports = AdminController;