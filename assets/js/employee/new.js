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

const addBtn = document.getElementById('add-btn');
const companyId = document.getElementById('company-id').value;
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordConfirmation = document.getElementById('password_confirmation');
const role = document.getElementById('role');
const employeeEmail = document.getElementById('employee-email');

const passwordInvalid = document.getElementById('password-invalid');
const invalidRole = document.getElementById('invalid-role');
const invalidEmployeeEmail = document.getElementById('invalid-employee-email');

handleChange(password, passwordInvalid);
handleChange(passwordConfirmation, passwordInvalid);
handleChange(role, invalidRole, 'select');
handleChange(employeeEmail, invalidEmployeeEmail);

addBtn.addEventListener('click', async function(e){
  e.preventDefault();

  try {
    if(role.value === ''){
      throw { role: 'Please choose a role ' };
    }else{
      if(hasAccount.checked){
        if(employeeEmail.value === ''){
          throw { employeeEmail: 'Please enter your employee email' };
        }

        const post = await fetch(`/company/${ companyId }/employees/new`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
            role: role.value,
            employee_email: employeeEmail.value
          })
        });

        const response = await post.json();

        if(post.status === 400){
          throw response;
        }

        console.log(response);
      }else{
        if(password.value === passwordConfirmation.value){
          const post = await fetch(`/company/${ companyId }/employees/new`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: username.value,
              email: email.value,
              password: password.value,
              role: role.value,
              employee_email: employeeEmail
            })
          });

          const response = await post.json();

          if(post.status === 400){
            throw response;
          }

          console.log(response);

        }else{
          throw { password: 'Password is not matched' };
        }
      }
    }
  }catch(error){

    console.log(error);

    passwordInvalid.innerText = error.password ?? '';
    invalidRole.innerText = error.role ?? '';
    invalidEmployeeEmail.innerText = error.employeeEmail ?? '';
  }
});