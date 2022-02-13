module.exports = function(error){

  const errors = {
    username: '',
    email: '',
    password: ''
  };

  if(error.name === 'ValidationError'){
    Object.values(error.errors).forEach(function(error){
      errors[error.path] = error.message
    });
  }

  if(error.code === 11000){
    errors.email = 'This email is already exist'
  }

  return errors;k
}