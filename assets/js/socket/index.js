const socket = io();

if(Notification.permission !== 'denied'){
  Notification.requestPermission();
}

function activateButtons(){
  const rejectBtns = document.getElementsByClassName('btn-reject');
  const acceptBtns = document.getElementsByClassName('btn-accept');

  Array.prototype.forEach.call(rejectBtns, function(rejectBtn){
    rejectBtn?.addEventListener('click', function(){
      const companyId = document.getElementById('c_id');
      const id = this.getAttribute('order-id');
      socket.emit('check-order', id, 'rejected', function(){
        window.location = `/company/${ companyId.innerText }`;
      });
    });
  });

  Array.prototype.forEach.call(acceptBtns, function(acceptBtn){
    acceptBtn?.addEventListener('click', function(){
      const companyId = document.getElementById('c_id');
      console.log('Hi');
      const id = this.getAttribute('order-id');
      socket.emit('check-order', id, 'accepted', function(){
        window.location = `/company/${ companyId.innerText }`;
      });
    });
  });
}

activateButtons();

async function $(_orders, div = 'app-list', isChefManager = false){
  const appList = document.getElementById(div);

  const companyId = document.getElementById('c_id');

  const requestFoods = await fetch(`/api/v1/company/${ companyId.innerText }/foods`);
  const requestTables = await fetch(`/api/v1/company/${ companyId.innerText }/tables`);

  const foods = await requestFoods.json();
  const tables = await requestTables.json();

  const { table_id, orders, _id } = _orders;

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

    if(isChefManager){
      const acceptBtn = document.createElement('button');
      acceptBtn.setAttribute('class', 'btn btn-primary btn-accept');
      acceptBtn.setAttribute('order-id', `${ _id }`);
      acceptBtn.innerText = 'Accept';
      acceptBtn.setAttribute('style', 'margin-right: .5em');
  
      const rejectBtn = document.createElement('button');
      rejectBtn.setAttribute('class', 'btn btn-danger btn-reject');
      rejectBtn.setAttribute('order-id', `${ _id }`);
      rejectBtn.innerText = 'Reject';
  
      cardBody.appendChild(document.createElement('br'));
  
      cardBody.appendChild(acceptBtn);
      cardBody.appendChild(rejectBtn);
    }
  }
}

const orderBtn = document.getElementById('order-btn');

orderBtn?.addEventListener('click', async function(event){
  event.preventDefault();
  const request = await fetch(`/api/v1/company/${ companyId.innerText }/foods`);
  const _foods = await request.json();
  const $foods = document.getElementsByClassName('food');

  if(Array.prototype.some.call($foods, food => food.value === '')){
    const invalid = Array.prototype.find.call($foods, food => food.value === '');
    const orderId = invalid.getAttribute('order-id');
    const i = document.getElementById(`invalid-${ orderId }`);
    handleChange(invalid, i);
    i.innerText = 'Please choose a food';
    return;
  }

  if(!Array.prototype.every.call($foods,food => _foods.some(f => f.name === food.value))){
    const invalid = Array.prototype.find.call($foods,food => _foods.every(f => f.name !== food.value));
    const orderId = invalid.getAttribute('order-id');
    const i = document.getElementById(`invalid-${ orderId }`);
    handleChange(invalid, i);
    i.innerText = 'We don\'t serve this food in your restaurant';
    return;
  }

  const amounts = document.getElementsByClassName('amount');

  if(Array.prototype.some.call(amounts, amount => amount.value === '')){
    const invalid = Array.prototype.find.call(amounts, amount => amount.value === '');
    const orderId = invalid.getAttribute('order-id');
    const i = document.getElementById(`invalid-amount-${ orderId }`);
    handleChange(invalid, i);
    i.innerText = 'Please enter amount of food';
    return;
  }

  const foods = Array.prototype.map.call($foods, function(food){
    const orderId = food.getAttribute('order-id');
    const amount = document.getElementById(`amount-${ orderId }`);
    const selectedFood = _foods.find(f => f.name === food.value);
    return { food_id: selectedFood._id, amount: amount.value };
  });  

  const tableId = document.getElementById('table-id');

  const orders = { orders: foods, table_id: tableId.value, company_id: companyId.innerText }

  socket.emit('send-order', orders, function(callback){
    if(callback.status === 400){
      document.getElementById('invalid-table').innerText = 'Please select a table';
    }else{
      window.location = `/company/${ companyId.innerText }`;
    }
  });
});

socket.on('send-order', async function(_orders){
  const { table_id, orders, _id } = _orders;
  await $({table_id, orders, _id}, true);
  activateButtons();
  if(Notification.permission === 'granted'){
    const notification = new Notification('There\'s a new order!');
    return;
  }
});

socket.on('order-accepted', async function(_orders){
  const { table_id, orders, _id } = _orders;
  console.log({ table_id, orders, _id });
  await $({ table_id, orders, _id}, 'app-list-fs');
  if(Notification.permission === 'granted'){
    const notification = new Notification('There\'s a new order!');
    return;
  }
});