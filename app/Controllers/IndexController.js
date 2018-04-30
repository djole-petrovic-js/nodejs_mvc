const Controller = use('lib/Controller');
const Password = use('lib/Password');

class IndexController extends Controller {
  async index(req,res) {
    return this.render(res,'index');
  }
}

module.exports = IndexController;