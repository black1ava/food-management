const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
  const token = req.cookies['authorized_token'];

  if(token){
    jwt.verify(token, process.env.SECRET, function(err){
      if(err){
        next();
      }else{
        res.redirect('/');
      }
    });
  }else{
    next();
  }
}