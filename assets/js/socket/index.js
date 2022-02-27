const socket = io();

async function $(_orders){
  const appList = document.getElementById('app-list');

  const companyId = document.getElementById('c_id');

  const requestFoods = await fetch(`/api/v1/company/${ companyId.innerText }/foods`);
  const requestTables = await fetch(`/api/v1/company/${ companyId.innerText }/tables`);

  const foods = await requestFoods.json();
  const tables = await requestTables.json();

  const { table_id, orders } = _orders;

  if(appList){
    const card = document.createElement('div');
    card.classList.add('card');

    appList.appendChild(card);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    card.appendChild(cardBody);

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    
    cardBody.appendChild(cardHeader);

    const table = tables.find(function(table){
      return table._id === table_id;
    });

    const h2 = document.createElement('h2');
    h2.innerText = `Order for table: ${ table.name }`;

    cardHeader.appendChild(h2);

    const $foods = orders.map(function(order){
      const f = foods.find(food => food._id === order.food_id);
      return { name: f.name, amount: order.amount };
    });

    const ul = document.createElement('ul');
    ul.classList.add('list-group');

    cardBody.appendChild(ul);

    $foods.forEach(function(food){
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerHTML = `Food: <strong>${ food.name }</strong>, Amount: <strong>${ food.amount }</strong>`
      ul.appendChild(li);
    });

    const acceptBtn = document.createElement('button');
    acceptBtn.setAttribute('class', 'btn btn-primary');
    acceptBtn.innerText = 'Accept';
    acceptBtn.setAttribute('style', 'margin-right: .5em');

    const rejectBtn = document.createElement('button');
    rejectBtn.setAttribute('class', 'btn btn-danger');
    rejectBtn.innerText = 'Reject';

    cardBody.appendChild(document.createElement('br'));

    cardBody.appendChild(acceptBtn);
    cardBody.appendChild(rejectBtn);
  }
}

async function $$(){

  const companyId = document.getElementById('c_id');

  const request = await fetch(`/api/v1/company/${ companyId.innerText }/orders`);
  const _orders = await request.json();

  const _ = _orders.map(function(order){
    const { table_id, orders } = order;
    return $({ table_id, orders });
  });

  await Promise.all(_);
}

$$();

const orderBtn = document.getElementById('order-btn');

orderBtn?.addEventListener('click', async function(event){
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

socket.on('send-order', async function(_orders){
  await $(_orders);
});