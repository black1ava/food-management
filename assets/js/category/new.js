const addBtn = document.getElementById('add-btn');
const name = document.getElementById('name');
const company_id = document.getElementById('c_id');
const invalidName = document.getElementById('invalid-name');

addBtn.addEventListener('click', async function(e){
  e.preventDefault();
  const get = await fetch('/api/v1/user');
  const response= await get.json();
  const { id } = response;

  try {
    const post = await fetch(`/company/${ company_id.innerText }/categories/new`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        user_id: id
      })
    });

    const $response = await post.json();

    if(post.status === 400){
      throw $response;
    }

    window.location = `/company/${ c_id.innerText }/categories`;
  }catch(error){
    console.error(error);
    const { name } = error;
    invalidName.innerText = name;
  }
});
