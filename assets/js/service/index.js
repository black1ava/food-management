const addOrderBtn = document.getElementById('add-order-btn');
const appOrder = document.getElementById('app-order');
const { v4 } = uuid;
const companyId = document.getElementById('c_id');

function checkIsInteger(){
  const integers = document.getElementsByClassName('is-integer');

  function isInteger(value){
    const values = value.split('');
    if(value[0] === '0'){
      return false;
    }
  
    return values.every(function(value){
      return valids.includes(value);
    });
  }

  Array.prototype.forEach.call(integers, function(integer){
    let prevValue = '';

    integer.addEventListener('input', function(){
      this.value = isInteger(this.value) ? this.value : prevValue;
      prevValue = isInteger(this.value) ? this.value : prevValue;
    });
  });
}

async function main(){
  const request = await fetch(`/api/v1/company/${ companyId.innerText }/foods`);
  const foods = await request.json();

  checkIsInteger();

  addOrderBtn.addEventListener('click', function(event){
    event.preventDefault();
  
    const id = v4();
  
    const formGroup = document.createElement('div');
    formGroup.setAttribute('class', 'form-group');
  
    appOrder.appendChild(formGroup);
  
    const formRow = document.createElement('div');
    formRow.setAttribute('class', 'form-row');
  
    formGroup.appendChild(formRow);
  
    const colMd4_1 = document.createElement('div');
    colMd4_1.setAttribute('class', 'col-md-4');
  
    formRow.appendChild(colMd4_1);
  
    const foodNameLabel = document.createElement('label');
    foodNameLabel.setAttribute('for', `name-${ id }`);
    foodNameLabel.innerText = 'Food name'
  
    colMd4_1.appendChild(foodNameLabel);
  
    const input = document.createElement('input');
    input.setAttribute('class', 'form-control');
    input.setAttribute('list', `list-${ id }`);
    input.setAttribute('id', `name-${ id }`);
  
    colMd4_1.appendChild(input);
  
    const dataList = document.createElement('datalist');
    dataList.setAttribute('id', `list-${ id }`);
  
    foods.forEach(function(food){
      const option = document.createElement('option');
      option.setAttribute('value', food._id);
      option.innerText = food.name;
  
      dataList.appendChild(option);
    });

    colMd4_1.appendChild(dataList);

    const colMd4_2 = document.createElement('div');
    colMd4_2.setAttribute('class', 'col-md-4');

    formRow.appendChild(colMd4_2);

    const amountLabel = document.createElement('label');
    amountLabel.setAttribute('id', `amount-${ id }`);
    amountLabel.innerText = 'Amount';

    colMd4_2.appendChild(amountLabel);

    const amountInput = document.createElement('input');
    amountInput.setAttribute('class', 'form-control');
    amountInput.setAttribute('id', `amount-${ id }`);

    colMd4_2.appendChild(amountInput);

    checkIsInteger();
  });
}

main();