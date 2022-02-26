const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  company_id: String
});

Schema.pre('save', async function(next){
  const tables = await this.find();
  console.log(tables);
  next();
});

module.exports = model('table', Schema);