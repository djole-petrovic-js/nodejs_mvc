const TemplateEngine = require('../app/lib/TemplateEngine');
const path = require('path');
const { PATHS:{ VIEWS } } = require('../config');

module.exports = {
  redirect:(res) => (url) => {
    res.writeHead(307,{ Location:url });

    return res.end();
  },
  render:(res) => async (view,data) => {
    res.writeHead(200,{ 'Content-Type':'text/html' });
    
    const html = await TemplateEngine.compile(path.join(VIEWS,view + '.html'),data);
    res.write(html);

    return res.end();
  },
  send:(res) => (text) => {
    res.writeHead(200,{ 'Content-Type':'text/plain' });
    res.write(text);

    return res.end();
  },
  json:(res) => (data,...config) => {
    if ( config && config.length > 0 ) {
      res.writeHead(...config);
    } else {
      res.writeHead(200,{ 'Content-Type':'application/json' });
    }
    
    res.write(JSON.stringify(data));

    return res.end();
  }
};