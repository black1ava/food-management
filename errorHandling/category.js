module.exports = function(error){
  const errors = { name: '' };

  if(error.name === 'ValidationError'){
    Object.values(error.errors).forEach(function(error){
      errors[error.path] = error.message;
    });
  }

  return errors;
}