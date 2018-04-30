const Controller = use('lib/Controller');

class ErrorsController extends Controller {
  async handle404(req,res) {
    if ( this.wantsJSON(req) ) {
      return this.json(res,{
        message:'Not found',
        status:404
      },404);
    }

    return this.render(res,'404');
  }

  async handleAllErrors(req,res,error) {
    if ( this.wantsJSON(req) ) {
      return this.json(res,{
        status:error.status || 500,
        message:'Something went wrong...'
      },error.status || 500);
    }

    return await this.render(res,'errors',{
        message:error.message,
        error:process.env.ENV === 'DEVELOPMENT' ? error.stack.split(' at ').join('<br/> at ') : '',
        status:error.status || 500
    });
  }
}

module.exports = ErrorsController;