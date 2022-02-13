const mongoose = require('mongoose');
const { isEmail } = required('validator');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your company name']
  },
  province: {
    type: String,
    required: [true, 'Please enter your company location']
  },
  address: {
    type: String,
    required: [true, 'Please insert your company address']
  },
  email: {
    type: String,
    validate: [isEmail, 'Please enter a correct email']
  },
  phone: {
    type: String,
    required: [true, 'Please enter your company phone number']
  }
});

module.exports = mongoose.model('company', Schema);