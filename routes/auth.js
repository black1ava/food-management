const loginController = require('../controllers/login');
const signupController = require('../controllers/signup');
const notAuthorizedMiddleware = require('../middlewares/notAuthorized');

module.exports = function(app){

  app.get('/login', notAuthorizedMiddleware, function(req, res){
    res.render('auth/login');
  });
  app.use('/login', loginController);

  app.get('/signup', notAuthorizedMiddleware, function(req, res){
    res.render('auth/signup')
  });
  app.use('/signup', signupController);

  app.get('/logout', function(req, res){
    res.cookie('authorized_token', '', { maxAge: 1 });
    res.redirect('/');
  });
}