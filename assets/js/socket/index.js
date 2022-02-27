const socket = io();

const orderBtn = document.getElementById('order-btn');

orderBtn.addEventListener('click', async function(event){
  event.preventDefault();
  const request = await fetch(`/api/v1/company/${ companyId.innerText }/foods`);
  const _foods = await request.json();
  const $foods = document.getElementsByClassName('food');
  const foods = Array.prototype.map.call($foods, function(food){
    const orderId = food.getAttribute('order-id');
    const amount = document.getElementById(`amount-${ orderId }`);
    const selectedFood = _foods.find(f => f.name === food.value);
    return { food_id: selectedFood._id, amount: amount.value };
  });  

  const tableId = document.getElementById('table-id');

  const orders = { orders: foods, table_id: tableId.value, company_id: companyId.innerText }
  socket.emit('send-order', orders, function(callback){
    console.log(callback);
  });
});