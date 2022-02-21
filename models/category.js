const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please insert your categroy name']
  },
  added_by: String,
  company_id: String
});

module.exports = mongoose.model('category', Schema);