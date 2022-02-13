const mongoose = require('mongoose');
const { isEmail } = require('validator');

const Schema = new mongoose.Schema({
  usernmae: {
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
    required: [true, 'Please choose a role']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [8, 'Your passsword is too short']
  },
  work_at: {
    type: Number,
    required: [true, 'Company section cannot be blanked']
  }
});

module.exports = mongoose.model('user', Schema);