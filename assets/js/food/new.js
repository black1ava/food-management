const name = document.getElementById('name');
const category = document.getElementById('category');
const price = document.getElementById('price');
const hour = document.getElementById('hour');
const minute = document.getElementById('minute');
const dishPerDay = document.getElementById('dish-per-day');
const addBtn = document.getElementById('add-btn');

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

addBtn.addEventListener('click', function(e){
  e.preventDefault();
  console.log(name.value);
});