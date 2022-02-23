const deleteBtn = document.getElementById('delete-btn');
const companyId = document.getElementById('c_id');

deleteBtn.addEventListener('click', async function(e){
  e.preventDefault();

  const del = await fetch(`/company/${ companyId.innerText }/foods/${ foodId.value }`, {
    method: 'delete'
  });

  window.location = `/company/${ companyId.innerText }/foods`
});