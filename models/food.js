const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please insert food name']
  },
  categories: [String],
  price: {
    type: String,
    required: [true, 'Please insert price']
  },
  duration: {
    hour: Number,
    minute: Number
  },
  dish_per_day: Number,
  company_id: String
});

module.exports = mongoose.model('food', Schema);