const email = document.getElementById('email');
const password = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const emailInvalid = document.getElementById('email-invalid');
const passwordInvalid = document.getElementById('password-invalid');

handleChange(email, emailInvalid);
handleChange(password, passwordInvalid);

async function logUserIn(email, password){
  const post = await fetch('/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const response = await post.json();

  if(post.status === 400){
    throw response;
  }

  window.location = '/'
}

loginBtn.addEventListener('click', async function(e){
  e.preventDefault();

  try {
    await logUserIn(email.value, password.value);
  }catch(error){
    emailInvalid.innerText = error.email;
    passwordInvalid.innerText = error.password;
  }
});