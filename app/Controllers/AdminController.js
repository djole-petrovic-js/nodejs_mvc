const Controller = use('lib/Controller');
const User = use('Models/User');

class AdminController extends Controller {
  async index(req,res) {
    const users = await User.all();

    return await this.render(res,'admin',{ users });
  }
}

module.exports = AdminController;