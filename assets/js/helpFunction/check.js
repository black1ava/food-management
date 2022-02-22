const valid = '1234567890';
const valids = valid.split('');

function isFloat(value){
  const values = value.split('');

  const dot = {
    availability: 1
  }

  if(value[0] === '.'){
    return false;
  }

  if(value.length > 1){
    if(value[0] === '0' && value[1] !== '.'){
      return false;
    }
  }

  return values.every(function(value){
    if(value === '.' && dot.availability){
      dot.availability--;
      return true;
    }
    return valids.includes(value);
  });
}

function isInteger(value){
  const values = value.split('');
  if(value[0] === '0'){
    return false;
  }

  return values.every(function(value){
    return valids.includes(value);
  });
}