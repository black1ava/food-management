const hasAccount = document.getElementById('has-account');
const noAccount = document.getElementById('no-account');
const yesAccount = document.getElementById('yes-account');

if(hasAccount.checked){
  noAccount.setAttribute('class', 'app-hidden');
  yesAccount.setAttribute('class', '');
}else{
  yesAccount.setAttribute('class', 'app-hidden');
  noAccount.setAttribute('class', '');
}

hasAccount.addEventListener('change', function(){
  noAccount.classList.toggle('app-hidden');
  yesAccount.classList.toggle('app-hidden');
});