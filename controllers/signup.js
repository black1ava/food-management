const router = require('express').Router();

router.route('/').get(function(req, res){
  res.render('auth/signup');
});

module.exports = router;