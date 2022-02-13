const authorizedMiddleware = require('../middlewares/authorized');

module.exports = function(app){
  app.get('/', authorizedMiddleware, function(req, res){
    res.render('index');
  });
}