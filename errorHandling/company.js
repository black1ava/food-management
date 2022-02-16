module.exports = function(error){
  const errors = {
    name: '',
    email: '',
    phone: '',
    employer_email: ''
  };

  if(error.name === 'ValidationError'){
    Object.values(error.errors).forEach(function(error){
      errors[error.path] = error.message;
    });
  }

  if(error.code === 11000){
    errors.email = 'This email is already taken';
  }

  if(error.name === 'employee email not found'){
    errors.employer_email = 'Employee email not found'
  }

  return errors;
}