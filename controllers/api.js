const router = require('express').Router();
const jwt = require('jsonwebtoken');
const authorized = require('../middlewares/authorized');
const user = require('../models/user');

router.use(authorized);

router.route('/user').get(function(req, res){
  const token = req.cookies['authorized_token'];

  jwt.verify(token, process.env.SECRET, function(err, decodedToken){
    const { id } = decodedToken;
    res.status(200).json({ id });
  })
});

module.exports = router;