const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your username'],
    unique: true,
    validate: [isEmail, 'Please enter a correct email']
  },
  role: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [8, 'Your passsword is too short']
  },
  work_at: {
    type: String,
  }
});

Schema.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

module.exports = mongoose.model('user', Schema);