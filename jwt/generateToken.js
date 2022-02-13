const jwt = require('jsonwebtoken');

module.exports = function(id, maxAge){
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
}