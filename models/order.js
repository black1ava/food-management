const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  orders: [
    {
      food_id: {
        type: String,
        required: [true, 'Please choose a food']
      },
      amount: {
        type: Number,
        required: [true, 'Please enter the amount of food']
      }
    }
  ],
  status: {
    type: String,
    default: 'pending'
  },
  table_id: {
    type: String,
    required: [true, 'Please select a table']
  },
  company_id: String
});

module.exports = mongoose.model('order', Schema);