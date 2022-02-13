const companyController = require('../controllers/company');

module.exports = function(app){
  app.use('/company', companyController);
}