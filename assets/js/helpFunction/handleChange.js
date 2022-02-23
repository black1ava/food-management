function handleChange(input, error, option = 'input'){
  switch(option){
    case 'input':
      input.addEventListener('keypress', function(){
        error.innerText = ''
      });
      break;

    case 'select':
      input.addEventListener('change', function(){
        error.innerText = '';
      });
      break;

    case 'checkbox':
      Array.prototype.forEach.call(input, function(i){
        i.addEventListener('change', function(){
          error.innerText = '';
        });
      });
      break;

    default:
      break;
  }
}