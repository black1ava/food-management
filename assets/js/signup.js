const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordConfirmation = document.getElementById('password_confirmation');
const signupBtn = document.getElementById('signup-btn');
const usernameInvalid = document.getElementById('username-invalid');
const emailInvalid = document.getElementById('email-invalid');
const passwordInvalid = document.getElementById('password-invalid');

handleChange(username, usernameInvalid);
handleChange(email, emailInvalid);
handleChange(password, passwordInvalid);

async function signUserUp(signup){
  if(signup.password === signup.passwordConfirmation){
    const post = await fetch('/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signup)
    });

    const response = await post.json();

    if(post.status === 400){
      throw response;
    }

    window.location = '/';
    return;
  }

  throw { password: 'Password is not matched' }
}

signupBtn.addEventListener('click', async function(e){
  e.preventDefault();

  const signup = { 
    username: username.value, 
    email: email.value,
    password: password.value, 
    passwordConfirmation: passwordConfirmation.value
  };

  try {
    await signUserUp(signup);
  }catch(error){

    usernameInvalid.innerText = error.username ?? '';
    emailInvalid.innerText = error.email ?? '';
    passwordInvalid.innerText = error.password ?? '';
  }

});