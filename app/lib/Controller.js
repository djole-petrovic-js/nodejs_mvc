const Form = use('lib/Form');
const { PATHS:{ VIEWS } } = requireConfig();
const path = require('path');
const TemplateEngine = use('lib/TemplateEngine');

class Controller {
  validate(data,rules) {
    const form = new Form(rules);

    form.bindValues(data);
    form.validate();

    return form;
  }

  // request methods
  wantsJSON(req) {
    const header = req.headers['x-requested-with'] || '';
    
    if ( header.toLowerCase() === 'xmlhttprequest' ) return true;

    if ( req.headers.accept && req.headers.accept.indexOf('json') > -1 ) return true;

    return false;
  }

  // response methods
  async render(res,view,data) {
    const html = await TemplateEngine.compile(path.join(VIEWS,view + '.html'),data);

    res.writeHead(200,{ 'Content-Type':'text/html' });
    res.write(html);

    return res.end();
  }

  redirect(res,url) {
    res.writeHead(302,{ Location:url });

    return res.end();
  }

  send(res,text) {
    res.writeHead(200,{ 'Content-Type':'text/plain' });
    res.write(text);

    return res.end();
  }

  json(res,data,...config) {
    res.writeHead(...(
      config && config.length > 0
        ? config
        : [200,{ 'Content-Type':'application/json' }]
    ));
    
    res.write(JSON.stringify(data));

    return res.end();
  }
}

module.exports = Controller;