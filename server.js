const App = require('./App');
const app = new App();
const path = require('path');

app.assets('public');

app.middleware((req,res,next) => {
  const error = new Error();
  error.message = 'greska kao neka jebiga';

  return next();
});

app.middleware('CheckIfLoggedIn');
app.get('/','IndexController@index').name('index');
app.get('/about','IndexController@about').name('about');
app.middleware('CheckSession');
app.get('/users','UsersController@index').name('users');
app.get('/index/xhr','IndexController@xhr');

app.group('/admin',() => {
  app.get('/','AdminController@index').name('adminShow');
  app.get('/config','AdminController@config');
});

app.get('/register','LoginRegisterController@registerShow').name('registerShow');
app.post('/register','LoginRegisterController@registerDo').name('registerDo');

module.exports = app;