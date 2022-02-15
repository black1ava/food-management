const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your username'],
    unique: true,
    validate: [isEmail, 'Please enter a correct email']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [8, 'Your passsword is too short']
  },
  work_at: [{
    company_id: String,
    role: String
  }]
});

Schema.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

Schema.statics.login = async function(email, password){
  const user = await this.findOne({ email });

  function errors(email = '', password = ''){
    this.email = email;
    this.password = password;
  }

  errors.prototype = new Error();

  if(user){
    const auth = await bcrypt.compare(password, user.password);

    if(auth){
      return user;
    }else{
      throw new errors('', 'Incorrect password');
    }
  }else{
    throw new errors('Incorrect email');
  }
}

module.exports = mongoose.model('user', Schema);