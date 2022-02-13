const mongoose = require('mongoose');
const { isEmail } = require('validator');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your company name'],
    unique: true
  },
  email: {
    type: String,
    unique: true,
    validate: [isEmail, 'Please enter a correct email']
  },
  phone: {
    type: String,
    required: [true, 'Please enter your company phone number']
  }
});

module.exports = mongoose.model('company', Schema);