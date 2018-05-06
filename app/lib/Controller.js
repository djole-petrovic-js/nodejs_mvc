const Form = use('lib/Form');
const { PATHS:{ VIEWS } } = requireConfig();
const path = require('path');
const TemplateEngine = use('lib/TemplateEngine');
const http = require('http');
const connection = use('db/connection');

connection.getConnection((err) => {
  Controller.isConnected = !err;
  // config set and get methods for flash messages
  // depend on whether it is connected to db or not
  const flash = use(`lib/${ Controller.isConnected ? 'FlashDB' : 'FlashLocal' }`);

  flash.loadFlash();

  Controller.flashMessages = { get:flash.get,set:flash.set };
});

class Controller {
  validate(data,rules) {
    const form = new Form(rules);

    form.bindValues(data);
    form.validate();

    return form;
  }

  get flash() {
    return {
      get:Controller.flashMessages.get,
      set:Controller.flashMessages.set,
    }
  }

  fetch(options,dataToSend) {
    return new Promise((resolve,reject) => {
      const request = http.request(options,(response) => {
        let data = '';

        if ( response.statusCode < 200 && response.statusCode > 299 ) {
          const error = new Error('Request failed, status code : ' + response.statusCode);
          error.status = response.statusCode;

          return reject(error);
        }

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end',() => {
          try {
            data = JSON.parse(data);
          } catch(e) { }

          resolve(data);
        });
      });

      request.on('error',(error) => {
        return reject(error);
      })

      if ( dataToSend ) {
        try {
          dataToSend = JSON.stringify(dataToSend);
        } catch(e) { }

        request.write(dataToSend);
      }

      request.end();
    });
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