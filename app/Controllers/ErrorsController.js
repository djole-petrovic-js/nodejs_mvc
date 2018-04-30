const Controller = use('lib/Controller');

class ErrorsController extends Controller {
  async handle404(req,res) {
    if ( req.wantsJSON() ) {
      return res.json({
        message:'Not found',
        status:404
      },404);
    }
    try {
      return await res.render('404');
    } catch(e) {
      return res.send('Ooops error occured...');
    }
  }

  async handleAllErrors(req,res,error) {
    if ( req.wantsJSON() ) {
      return res.json({
        status:error.status || 500,
        message:'Something went wrong...'
      },error.status || 500);
    }

    try {
      return await res.render('errors',{
        message:error.message,
        error:process.env.ENV === 'DEVELOPMENT' ? error.stack.split(' at ').join('<br/> at ') : '',
        status:error.status || 500
      });
    } catch(e) {
      return res.send('Ooops error occured...');
    }
  }
}

module.exports = ErrorsController;