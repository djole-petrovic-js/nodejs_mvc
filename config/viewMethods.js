const app = require('../server');
const path = require('path');

module.exports = {
  js:(str) => `<script src="${ path.join(app.assetsDir(),'js',str + '.js') }"></script>`,
  css:(str) => `<link rel="stylesheet" href="${ path.join(app.assetsDir(),'css',str + '.css') }"/>`,
  url:(name) => {
    const routes = app.getRoutes();

    const url = routes
      .filter(x => typeof x !== 'string')
      .find(x => x.name === name);

    if ( !url ) {
      throw new Error(`Url with name ${ name } doesnt exist!`);
    }

    return url.route;
  }
}