const path = require('path');

module.exports = {
  // All Relevant paths to controllers, views etc
  PATHS:{
    ROOT:__dirname,
    APP:path.join(__dirname,'app'),
    CONTROLLERS:path.join(__dirname,'app','Controllers'),
    VIEWS:path.join(__dirname,'app','Views'),
    MODELS:path.join(__dirname,'app','Models'),
    MIGRATIONS:path.join(__dirname,'app','Migrations'),
    LIB:path.join(__dirname,'app','lib'),
    MIDDLEWARES:path.join(__dirname,'app','Middlewares')
  },
  PUBLIC:'/public',
  SITE_NAME:'http://localhost:3000',
  LOGS:{
    DEFAULT_NAME:'main',
    EXTENSION:'.log',
    PATH:path.join(__dirname,'logs')
  }
};