const fs = requirePromisified('fs');
const path = require('path');
const { PATHS:{ ROOT,MIDDLEWARES },PUBLIC } = requireConfig();
const querystring = require('querystring');
const Route = use('lib/Route');

class App {
  constructor() {
    this._routes = [];
  }

  assetsDir() {
    return PUBLIC;
  }

  getRoutes() {
    return this._routes;
  }

  middleware(controller) {
    if ( typeof controller === 'string' ) {
      return this._routes.push({
        controller
      });
    }

    const route = new Route({
      controller
    });

    return this._routes.push(route);
  }

  get(route,controller) {
    return this._addRoute(route,controller,'GET');
  }

  post(route,controller) {
    return this._addRoute(route,controller,'POST');
  }

  group(route,groupFN,config) {
    this._prefix = route;

    groupFN();

    this._prefix = '';
  }

  _addRoute(route,controller,method) {
    const r = new Route({ route,controller,method });
    
    if ( this._prefix ) {
      r.route = this._prefix + r.route;
    }

    this._routes.push(r);

    return r;
  }

  async handleStaticFilesRequests(req,res) {
    const mimes = {
      'js':'text/javascript',
      'css':'text/css',
      'jpg':'image/jpg',
      'jpeg':'image/jpeg',
      'png':'image/png'
    }

    try {
      const mime = req.url.split('.')[1];

      if ( !mimes[mime] ) {
        res.write(404);
      } else {
        const params = [path.join(ROOT,req.url)];

        if ( !['jpg','jpeg','png'].includes(mime) ) params.push('utf-8');

        const content = await fs.readFileAsync(...params);

        res.writeHead(200,{ 'Content-Type':mimes[mime] });
        res.write(content);
      }
    } catch(e) {
      res.writeHead(404);
    } finally {
      return res.end();
    }
  }

  async atachQueryParams(req,requestObject) {
    const entries = requestObject.searchParams.entries();

    req.query = [...entries].reduce((acc,[key,value]) => {
      acc[key] = value; return acc;
    },{});
  }

  extractBody(req,res) {
    return new Promise((resolve,reject) => {
      let body = '';

      req.on('data',(data) => {
        body += data;
      });

      req.on('end',() => {
        req.body = querystring.parse(body);
        resolve();
      });
    });
  }

  async applyMiddleware(req,res,controller) {
    let isNextCalled = true;
    let error = null;

    const next = (err) => { 
      error = err,
      isNextCalled = true;
    };

    if ( typeof controller === 'function' ) {
      await controller(req,res,next);
    } else {
      const MiddlewareController = use('Middlewares/' + controller);
      const middleware = new MiddlewareController();
      
      if ( !middleware.handle || typeof middleware.handle !== 'function') {
        throw new Error('Middleware functions needs to impelement handle function!');
      }

      await middleware.handle(req,res,next);
    }

    if ( res.headersSent ) isNextCalled = false;

    return error ? error : isNextCalled;
  }
}

module.exports = App;