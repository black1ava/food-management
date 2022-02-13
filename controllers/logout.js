const authorized = require('../middlewares/authorized');
const router = require('express').Router();

router.use(authorized);

router.route('/').delete(function(req, res){
  res.cookie('authorized_token', '', { maxAge: 1 });
  res.status(200).json({ message: 'logout successfully' });
});

module.exports = router;