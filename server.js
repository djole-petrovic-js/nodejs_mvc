const App = use('lib/App');
const app = new App();
const path = require('path');

app.middleware('CSRF');
app.get('/','IndexController@index').name('index');

app.group('/admin',() => {
  app.get('/','AdminController@index').name('adminShow');
});

app.get('/register','LoginRegisterController@registerShow').name('registerShow');
app.post('/register','LoginRegisterController@registerDo').name('registerDo');

module.exports = app;