const userController = require('../controllers/user');

module.exports = function(app){
  app.use('/user', userController);
}