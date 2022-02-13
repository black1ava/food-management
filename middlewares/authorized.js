const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
  const token = req.cookies['authorized_token'];

  console.log(req.cookies);

  if(token){
    jwt.verify(token, process.env.SECRET, function(error, decodedToken){
      if(error){
        res.redirect('/login');
      }else{
        next();
      }
    });
  }else{
    res.redirect('/login');
  }
}