const router = require('express').Router();
const user = require('../models/user');
const signupErrorHandling = require('../errorHandling/signup');
const jwt = require('jsonwebtoken');

const minute = 60;
const maxAge = 15 * minute;

function generateToken(id){
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
}

router.route('/').get(function(req, res){
  res.render('auth/signup');
});

router.route('/').post(async function(req, res){
  const { username, email, password } = req.body;
  
  try{
    const newUser = await user.create({ username, email, password });
  
    const token = generateToken(newUser._id);
    res.cookie('authorized_token', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ message: 'Signup successfully' });
  }catch(error){
    res.status(400).json(signupErrorHandling(error));
  }
});

module.exports = router;