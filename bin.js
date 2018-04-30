require('./app/utils/loadEnv')('./.env');
require('./app/utils/registerGlobals')();

process.on('unhandledRejection', (reason, p) => {
  console.log('||||||||||||||||||||||||||');
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

// Da implementiram CSRF, kukije da sredim malo, da bude same-origin
// Nekako izgleda da cudno radi, treba da se proveri

// View formaters da mogu vise filtera da se ubace!
// Modeli da ima relacije!

//git
// Added filters and sanitization
// Moved response methods to Controller class
// Improved Error Handling
// Moved request methods to Controller class???
// Move view methods to View Class

const Migration = use('lib/Migration');

Migration.checkMigrationStatus();

const {
  SITE_NAME,
  PATHS:{
    CONTROLLERS,
    VIEWS,
    LIB,
    APP,
    ROOT,
    MIDDLEWARES,
  }
} = requireConfig();

const app = require('./server');
const port = process.env.PORT || 3000;

const 
  http             = require('http'),
  path             = require('path'),
  fs               = require('fs'),
  TemplateEngine   = use('lib/TemplateEngine'),
  Logger           = use('lib/Logger'),
  { URL }          = require('url'),
  requestMethods   = require('./config/requestMethods'),
  ErrorsController = use('Controllers/ErrorsController');

const server = http.createServer(async (req,res) => {
  const Errors = new ErrorsController();

  try {
    await app.applyRequestMiddlewares(req,requestMethods);

    const requestObject = new URL(req.url,SITE_NAME);
    const assetsDir = app.assetsDir();

    if ( requestObject.pathname === '/favicon.ico' ) {
      res.writeHead(404);
      return res.end();
    }

    if ( assetsDir && requestObject.pathname.startsWith(assetsDir) ) {
      return app.handleStaticFilesRequests(req,res);
    }

    await app.atachQueryParams(req,requestObject);

    if ( ['POST'].includes(req.method) ) {
      await app.extractBody(req,res);
    }

    for ( const { controller,route,method } of app.getRoutes() ) {
      if ( !route || !method ) {
        const isNextCalled = await app.applyMiddleware(req,res,controller);

        if ( typeof isNextCalled === 'object' ) {
          throw isNextCalled;
        }

        if ( !isNextCalled ) return;

        continue;
      }

      if ( requestObject.pathname !== route ) continue;
      if ( req.method !== method ) continue;

      const [ctrlName,ctrlMethod] = controller.split('@');
      const MainController = require(path.join(CONTROLLERS,ctrlName + '.js'));
      const mainCtrl = new MainController();

      if ( !mainCtrl[ctrlMethod] || typeof mainCtrl[ctrlMethod] !== 'function' ) {
        throw new Error(`Method ${ method } not found on controller ${ ctrl }`);
      }

      return await mainCtrl[ctrlMethod](req,res);
    }

    return await Errors.handle404(req,res);
  } catch(e) {
    console.log(e);
    // Logger.log(e);

    await Errors.handleAllErrors(req,res,e)
  }
});

server.listen(port);