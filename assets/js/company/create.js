const phone = document.getElementById('phone');

phone.addEventListener('input', function(){
  this.value = parseInt(this.value) || '';
})

const isEmployer = document.getElementById('is-employer');
const role = document.getElementById('role');

isEmployer.addEventListener('change', function(){
  role.classList.toggle('app-hidden');
});