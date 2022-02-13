const loginController = require('../controllers/login');
const signupController = require('../controllers/signup');

module.exports = function(app){
  app.use('/login', loginController);
  app.use('/signup', signupController);
}