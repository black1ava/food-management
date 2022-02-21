const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please insert food name']
  },
  category: {
    type: String,
    required: [true, 'Please inert food category']
  },
  price: {
    type: String,
    required: [true, 'Please insert price']
  },
  duration: String,
  dish_per_day: Number
});

module.exports = mongoose.model('food', Schema);