const apiController = require('../controllers/api');

module.exports = function(app){
  app.use('/api/v1', apiController);
}