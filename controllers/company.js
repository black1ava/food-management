const router = require('express').Router();
const authorized = require('../middlewares/authorized');

router.use(authorized);

router.route('/create').get(function(req, res){
  res.render('company/create');
});

module.exports = router;