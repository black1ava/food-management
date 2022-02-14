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


const createBtn = document.getElementById('create-btn');

createBtn.addEventListener('click', async function(e){
  e.preventDefault();

  const get = await fetch('/user');
  const user = await get.json();
  
  if(isEmployer.checked){
    try {
      const post = await fetch('/company/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          phone: '+855' + phone.value,
          employer_id: user.id
        })
      });

      const response = await post.json();

      if(post.status === 400){
        throw response;
      }

      console.log(response);
    }catch(error){
      console.error(error);
    }
  }
});