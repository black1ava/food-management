const router = require('express').Router();
const user = require('../models/user');
const signupErrorHandling = require('../errorHandling/signup');

router.route('/').get(function(req, res){
  res.render('auth/signup');
});

router.route('/').post(async function(req, res){
  const { username, email, password } = req.body;
  
  try{
    const newUser = await user.create({ username, email, password });
  
    res.status(200).json(newUser);
  }catch(error){
    res.status(400).json(signupErrorHandling(error));
  }
});

module.exports = router;