module.exports = function(app){
  app.get('/login', function(req, res){
    res.render('auth/login');
  });

  app.get('/signup', function(req, res){
    res.render('auth/signup');
  });
}