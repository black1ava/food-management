const submitBtn = document.getElementById('submit-btn');
const companyId = document.getElementById('c_id');
const name = document.getElementById('name');

const invalidName = document.getElementById('invalid-name');
handleChange(name, invalidName);

submitBtn.addEventListener('click', async function(event){
  event.preventDefault();

  try {
    const post = await fetch(`/company/${ companyId.innerText }/tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name.value })
    });

    const response = await post.json();

    if(post.status === 400){
      throw response;
    }

    window.location = `/company/${ companyId.innerText }/tables`;
  }catch(error){
    const { name } = error;
    invalidName.innerText = name;
  }
});

const updateBtns = document.getElementsByClassName('update');

Array.prototype.forEach.call(updateBtns, function(updateBtn){
  updateBtn.addEventListener('click', async function(event){
    event.preventDefault();
    const id = this.getAttribute('update-id');
    const name = document.getElementById(`table-${ id }`);
    const invalidName = document.getElementById(`invalid-name-${ id }`);

    handleChange(name, invalidName);
    
    try {
      const post = await fetch(`/company/${ companyId.innerText }/tables/${ id }`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name.value })
      });

      const response = await post.json();

      if(post.status === 400){
        throw response;
      }

      window.location = `/company/${ companyId.innerText }/tables`;
    }catch(error){
      console.error(error);
      invalidName.innerText = error.name;
    }
  });
});

const deleteBtns = document.getElementsByClassName('delete');

Array.prototype.forEach.call(deleteBtns, function(deleteBtn){
  deleteBtn.addEventListener('click', async function(event){
    event.preventDefault();
    const id = this.getAttribute('delete-id');

    await fetch(`/company/${ companyId.innerText }/tables/${ id }`, {
      method: 'DELETE'
    });

    window.location = `/company/${ companyId.innerText }/tables/`;
  });
});