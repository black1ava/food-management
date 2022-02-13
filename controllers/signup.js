const router = require('express').Router();
const user = require('../models/user');
const signupErrorHandling = require('../errorHandling/signup');
const generateToken = require('../jwt/generateToken');

const minute = 60;
const maxAge = 15 * minute;

router.route('/').post(async function(req, res){
  const { username, email, password } = req.body;
  
  try{
    const newUser = await user.create({ username, email, password });
  
    const token = generateToken(newUser._id, maxAge);
    res.cookie('authorized_token', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ message: 'Signup successfully' });
  }catch(error){
    res.status(400).json(signupErrorHandling(error));
  }
});

module.exports = router;