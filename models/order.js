const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  orders_id: [String],
  table_id: String,
  company_id: String
});

module.exports = mongoose.model('order', Schema);