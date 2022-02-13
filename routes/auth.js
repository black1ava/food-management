const loginController = require('../controllers/login');
const signupController = require('../controllers/signup');
const logoutController = require('../controllers/logout');

module.exports = function(app){

  app.use('/login', loginController);
  app.use('/signup', signupController);
  app.use('/logout', logoutController);
}