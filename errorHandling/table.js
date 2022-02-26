module.exports = function(error){

  const errors = {
    name: ''
  };

  if(error.name === 'ValidationError'){
    Object.values(error.errors).forEach(function(error){
      errors[error.path] = error.message
    });
  }

  if(error.code === 11000){
    errors['name'] = 'This table is already exist';
  }

  return errors;
}
