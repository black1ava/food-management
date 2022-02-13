const router = require('express').Router();
const user = require('../models/user');
const generateToken = require('../jwt/generateToken');

const minute = 60;
const maxAge = 15 * minute;

router.route('/').post(async function(req, res){
  const { email, password } = req.body;
  
  try{
    const $ = await user.login(email, password);
    const token = generateToken($._id, maxAge);
    res.cookie('authorized_token', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ massage: 'login succesfully '});

  }catch(error){
    console.log(error)
    res.status(400).json(error);
  }
});

module.exports = router;