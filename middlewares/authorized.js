const jwt = require('jsonwebtoken');
const user = require('../models/user');

module.exports = function(req, res, next){
  const token = req.cookies['authorized_token'];

  if(token){
    jwt.verify(token, process.env.SECRET, async function(error, decodedToken){
      if(error){
        res.redirect('/login');
      }else{
        const $ = await user.findById(decodedToken.id);
        res.locals.user = $;
        next();
      }
    });
  }else{
    res.redirect('/login');
  }
}