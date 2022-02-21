const name = document.getElementById('name');
const updateBtn = document.getElementById('update-btn');
const company_id = document.getElementById('c_id');
const category_id = document.getElementById('category-id');

updateBtn.addEventListener('click', async function(e){
  e.preventDefault();
  const get = await fetch('/api/v1/user');
  const response = await get.json();
  const user_id = response.id;

  try {
    const patch = await fetch(`/company/${ company_id.innerText }/categories/${ category_id.innerText }`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        user_id
      })
    });

    const response = await patch.json();

    if(patch.status === 400){
      throw response;
    }

    window.location = `/company/${ company_id.innerText }/categories`;
  }catch(error){
    console.error(error);
  }
});

const deleteBtn = document.getElementById('delete-btn');

deleteBtn.addEventListener('click', async function(e){
  e.preventDefault();
  await fetch(`/company/${ company_id.innerText }/categories/${ category_id.innerText }`, {
    method: 'delete'
  });

  window.location = `/company/${ company_id.innerText }/categories`;
});