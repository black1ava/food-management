const phone = document.getElementById('phone');

phone.addEventListener('input', function(){
  this.value = parseInt(this.value) || '';
})

const isEmployer = document.getElementById('is-employer');
const hiddenSection = document.getElementById('hidden-section');

if(isEmployer.checked){
  hiddenSection.setAttribute('class',  'app-hidden');
}else{
  hiddenSection.setAttribute('class', '');
}

isEmployer.addEventListener('change', function(){
  hiddenSection.classList.toggle('app-hidden');
});

const name = document.getElementById('name');
const email = document.getElementById('email');
const employerEmail = document.getElementById('employer-email');
const role = document.getElementById('role');

const invalidEmail = document.getElementById('invalid-email');
const invalidName = document.getElementById('invalid-name');
const invalidPhone = document.getElementById('invalid-phone');
const invalidEmployerEmail = document.getElementById('invalid-employer-email');
const invalidRole = document.getElementById('invalid-role');

handleChange(email, invalidEmail);
handleChange(name, invalidName);
handleChange(phone, invalidPhone);
handleChange(employerEmail, invalidEmployerEmail);
handleChange(role, invalidRole, 'select');

const createBtn = document.getElementById('create-btn');

createBtn.addEventListener('click', async function(e){
  e.preventDefault();

  const get = await fetch('/api/v1/user');
  const user = await get.json();

  try {
    if(isEmployer.checked){
      const post = await fetch('/company/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          phone: phone.value,
          role: 'employer',
          employer_id: user.id
        })
      });
  
      const response = await post.json();
  
      if(post.status === 400){
        throw response;
      }
  
      window.location = '/';
    }else {
      if(role.value === ''){
        invalidRole.innerText = 'Please select your role'
        return;
      }

      if(employerEmail.value === ''){
        invalidEmployerEmail.innerText = 'Please enter your employer email';
        return;
      }
    }
  }catch(error){
    const { name, email, phone } = error;

    invalidName.innerText = name;
    invalidEmail.innerText = email;
    invalidPhone.innerText = phone;
  }
});