const name = document.getElementById('name');
const category = document.getElementsByName('category[]');
const price = document.getElementById('price');
const hour = document.getElementById('hour');
const minute = document.getElementById('minute');
const dishPerDay = document.getElementById('dish-per-day');
const addBtn = document.getElementById('add-btn');
const company_id = document.getElementById('c_id');

let prevPriceValue = '';

price.addEventListener('input',function(){
  this.value = isFloat(this.value) ? this.value : prevPriceValue;
  prevPriceValue = isFloat(this.value) ? this.value : prevPriceValue;
});

let prevHourValue = '';

hour.addEventListener('input', function(){
  this.value = isInteger(this.value) ? this.value : prevHourValue;
  prevHourValue = isInteger(this.value) ? this.value : prevHourValue;
  
});

let prevMinuteValue = '';

minute.addEventListener('input', function(){
  this.value = isInteger(this.value) ? this.value : prevMinuteValue;
  prevMinuteValue = isInteger(this.value) ? this.value : prevMinuteValue;
});

let prevDishPerDayValue = '';

dishPerDay.addEventListener('input', function(){
  this.value = isInteger(this.value) ? this.value : prevDishPerDayValue;
  prevDishPerDayValue = isInteger(this.value) ? this.value : prevDishPerDayValue;
});

addBtn.addEventListener('click', async function(e){
  e.preventDefault();

  const categories = [];

  Array.prototype.forEach.call(category, function(cat){
    if(cat.checked){
      categories.push(cat.value);
    }
  });

  
  try {
    const post = await fetch(`/company/${ company_id.innerText }/foods/new`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        categories,
        price: price.value,
        hour: hour.value || 0,
        minute: minute.value || 0,
        dish_per_day: dishPerDay.value
      })
    });

    const response = await post.json();

    if(post.status === 400){
      throw response;
    }

    window.location = `/company/${ company_id.innerText }/foods`;
  }catch(err){
    console.error(err);
  }
});