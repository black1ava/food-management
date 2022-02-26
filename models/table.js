const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name : {
    type: String,
    required: [true, 'Please insert your table name']
  },
  company_id: String
});

module.exports = mongoose.model('table', Schema);