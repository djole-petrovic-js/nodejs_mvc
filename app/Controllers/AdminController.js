const Controller = use('lib/Controller');
const User = use('Models/User');
const Session = use('lib/SessionManager');

class AdminController extends Controller {
  async index(req,res) {
    const users = await User.all();

    const fl = await this.flash.get('message');

    // const http = await this.fetch({
    //   hostname:'localhost',
    //   port:'5000',
    //   path:'/upload/json',
    //   method:'POST',
    //   headers:{
    //     'Content-Type':'application/json'
    //   }
    // },{
    //   username:'djole'
    // });

    const sessionData = await Session.get(req);

    console.log(sessionData);

    await this.flash.set('message','djole');

    return await this.render(res,'admin',{ users });
  }
}

module.exports = AdminController;