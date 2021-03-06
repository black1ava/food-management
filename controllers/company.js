const router = require('express').Router();
const authorized = require('../middlewares/authorized');
const company = require('../models/company');
const companyErrorHandler = require('../errorHandling/company');
const user = require('../models/user');
const userErrorHandling = require('../errorHandling/signup');
const jwt = require('jsonwebtoken');
const category = require('../models/category');
const categoryErrorHandling = require('../errorHandling/category');
const food = require('../models/food');
const foodErrorHandling = require('../errorHandling/food');
const table = require('../models/table');
const tableErrorHandling = require('../errorHandling/table');
const order = require('../models/order')

router.use(authorized);

router.route('/create').get(function(req, res){
  res.render('company/create');
});

router.route('/create').post(async function(req, res){
  const { name, phone, email, user_id, role, employer_email } = req.body;

  if(employer_email !== ''){
    user.findOne({ email: employer_email }, async function(err, $){
    
      try {
        if($ === null){
          throw { name: 'employee email not found', msg: 'This email is not existed' };
        }
  
        const newCompany = await company.create({ name, phone: '+855' + phone, email });
  
        await user.findByIdAndUpdate(user_id, {
          '$push': {
            work_at: {
              company_id: newCompany._id,
              role
            }
          }
        });

        await user.findOneAndUpdate({ email: employer_email }, {
          '$push': {
            work_at: {
              company_id: newCompany._id,
              role: 'Employer'
            }
          }
        });
  
        res.status(200).json({ msg: 'Create company successfully' });
      }catch(err){
        res.status(400).json(companyErrorHandler(err));
      }
    });
  }else{
    try {
      const newCompany = await company.create({ name, phone: '+855' + phone, email });

      await user.findByIdAndUpdate(user_id, {
        '$push': {
          work_at: {
            company_id: newCompany._id,
            role: 'Employer'
          }
        }
      });

      res.status(200).json({ msg: 'Create company successfully'});
    }catch(err){
      res.status(400).json(companyErrorHandler(err));
    }
  }
});

async function getRole(token, id){
  return jwt.verify(token, process.env.SECRET, async function(err, decodedToken){
    const employee_id = decodedToken.id;
    const employee = await user.findById(employee_id);

    const work_ats = employee.work_at;
    const work_at = work_ats.find(function(work_at){
      return work_at.company_id === id;
    });

    const { role } = work_at;

    return role;
  });
}


router.route('/:id').get(async function(req, res){

  const { id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  const $company = await company.findById(id);

  const foods = await food.find({ company_id: id });

  const tables = await table.find({ company_id: id });

  const _orders =  await order.find({ company_id: id, status: 'pending' });

  function convertOrders(orders){
    return orders.map(function(order){
      const table = tables.find(table => (table._id).toString() === order.table_id);
      const $foods = order.orders.map(function(order){
        const food = foods.find(f => (f._id).toString() === order.food_id);
        return { id: food._id, name: food.name, amount: order.amount, done: order.done };
      });
  
      return { id: order._id, foods: $foods, table: table.name }
    });
  }

  const $orders =  await order.find({ company_id: id, status: 'accepted' });
  const $$orders = $orders.filter(order => order.orders.every(food => food.done === false));
  const a = $$orders.map(function(b){
    return b.orders;
  });

  const $ = [];

  a.forEach(b => b.forEach(c => $.push(c)));
  // console.log($);
  const c = $.map(_ => ({ id: _.food_id, amount: _.amount }));
  const e = foods.map(f => {
    const a = c.filter(w => w.id === (f._id).toString());
    let o = 0;

    a.forEach(b => { o += b.amount });
    console.log(o);
    return { name: f.name, amount: o };
  });

  const orders = convertOrders(_orders);

  const _acceptedOrders = await order.find({ company_id: id, status: 'accepted' });
  let acceptedOrders = convertOrders(_acceptedOrders);
  acceptedOrders = acceptedOrders.filter(function(order){
    return order.foods.every(food => food.done === false);
  });

  res.render('company/show', { 
    company: $company, 
    role, 
    foods,
    tables,
    orders,
    acceptedOrders,
    orderFoods: e
  });
});

router.route('/:id/employees').get(async function(req, res){
  const { id } = req.params

  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);
  
  if(role === 'Employer'){
    const users = await user.find();

    const employees = users.filter(function(user){
      return user.work_at.some(function(w){
        return w.company_id === id;
      })
    });

    const $employees = employees.map(function(employee){
      return ({
        id: employee._id,
        name: employee.username,
        email: employee.email,
        role: employee.work_at.find(w => w.company_id === id ).role
      });
    });

    const $company = await company.findById(id);

   res.render('employee/index', { employees: $employees, company: $company, role });
   return;
  }

  res.redirect(`/company/${ id }`);

});

router.route('/:id/employees/new').get(async function(req, res){

  const { id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Employer'){
    const $company = await company.findById(id);

    res.render('employee/new', { company: $company, role });
    return;
  }

  res.redirect(`/company/${ id }`);
});

router.route('/:id/employees/new').post(async function(req, res){
  const { id } = req.params;
  const { username, email, password, role, employee_email } = req.body;

  try {
    const $company = await company.findById(id);

    if(employee_email === ''){
      const $user = await user.create({ 
        username, 
        email, 
        password, 
        work_at: [{ 
          company_id: $company._id, role 
        }] 
      });

      res.status(200).json({ msg: 'Add employee successfully' });
    }else{
      user.findOne({ email: employee_email}, async function(err, $){

        try {
          if($ === null){
           throw { employee_email: 'This email does not exist' }
          }

          if($.work_at.some(company => company.company_id === ($company._id).toString())){
            throw { employee_email: 'This employee already exist in your company' };
          }

          await user.findOneAndUpdate({ email: employee_email }, {
            '$push': {
              work_at: {
                company_id: $company._id,
                role
              }
            }
          });

          res.status(200).json({ msg: 'Add employee successfully' });
        }catch(error){
          res.status(400).json(error);
        }
      });
    }
  }catch(error){
    console.log(error);
    res.status(400).json(userErrorHandling(error));
  }
});

router.route('/:id/categories').get(async function(req, res){
  const { id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Employer' || role === 'Chef Manager'){
    const $company = await company.findById(id);

    const categories = await category.find({ company_id: id });
    const $categories = categories.map(async function(category){
      const added_by = await user.findById(category.added_by);
      return ({
        id: category._id,
        name: category.name,
        added_by: added_by.username
      });
    });

    const _categories = await Promise.all($categories);

    res.render('category/index', { company: $company, role, categories: _categories });
    return;
  }

  res.redirect(`/company/${ id }`);
});

router.route('/:id/categories/new').get(async function(req, res){
  const { id }  = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Chef Manager'){
    const $company = await company.findById(id);

    res.render('category/new', { company:$company, role });
    return;
  }

  if(role === 'Employer'){
    res.redirect(`/company/${ id }/categories`);
    return;
  }

  res.redirect(`/company/${ id }`);
});

router.route('/:id/categories/new').post(async function(req, res){
  const { id } = req.params;
  const { name, user_id } = req.body;

  try {
    await category.create({ name, added_by: user_id, company_id: id });
    res.status(200).json({ msg: 'Add category successfully' });
  }catch(error){
    res.status(400).json(categoryErrorHandling(error));
  }
});

router.route('/:id/categories/:category_id').get(async function(req, res){
  const { id, category_id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Chef Manager'){
    const $company = await company.findById(id);
    const $category = await category.findById(category_id);

    res.render('category/show', { company: $company, role, category: $category });
    return;
  }

  if(role === 'Employer'){
    res.redirect(`/company/${ id }/categories`);
    return;
  }

  res.redirect(`/company/${ id }`);
});

router.route('/:id/categories/:category_id').put(async function(req, res){
  const { category_id } = req.params;
  const { name, user_id } = req.body;
  
  try {
    await category.findByIdAndUpdate(category_id, {
      name,
      added_by: user_id
    });

    res.status(200).json({ msg: 'Updated successfully'});
  }catch(error){
    console.log(error);
    res.status(400).json(error);
  }
})

router.route('/:id/categories/:category_id').delete(async function(req, res){
  const { category_id } = req.params;
  await category.findByIdAndDelete(category_id);

  res.status(200).json({ msg: 'Delete successfully' })
});

router.route('/:id/foods').get(async function(req, res){
  const { id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Employer' || role === 'Chef Manager'){
    const $company = await company.findById(id);

    const $foods = await food.find({ company_id: id });

    const _foods = $foods.map(async function(food){

      const $categories = food.categories.map(function(cat){
        return category.findById(cat);
      });

      const _categories = await Promise.all($categories);

      const categories = _categories.map(function(category){
        return category.name;
      });

      return {
        id: food._id,
        name: food.name,
        categories,
        price: food.price,
        duration: food.duration,
        dish_per_day: food.dish_per_day
      };
    });

    const foods = await Promise.all(_foods);

    res.render('foods/index', { company: $company, role, foods });
    return;
  }

  res.redirect(`/company/${ id }`);
});

router.route('/:id/foods/new').get(async function(req, res){
  const { id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Chef Manager'){
    const $company = await company.findById(id);

    const categories = await category.find({ company_id: id });


    res.render('foods/new', { company: $company, role, categories });
    return;
  }

  if(role === 'Employer'){
    res.redirect(`/company/${ id }/foods`);
    return;
  }

  res.render(`/company/${ id }`);
})

router.route('/:id/foods/new').post(async function(req, res){
  const { id } = req.params;
  const { name, categories, price, hour, minute, dish_per_day } = req.body;

  try {
    await food.create({
      name,
      categories,
      price,
      duration: {
        hour,
        minute
      },
      dish_per_day,
      company_id: id
    });

    res.status(200).json({ msg: 'created food successfully'});
  }catch(error){
    res.status(400).json(foodErrorHandling(error));
  }
});

router.route('/:id/foods/:food_id').get(async function(req, res){
  const { id, food_id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Chef Manager'){
    const $company = await company.findById(id);

    const categories = await category.find({ company_id: id });

    const $food = await food.findById(food_id);

    res.render('foods/edit', { company: $company, role, categories, food: $food });
    return;
  }

  if(role === 'Employer'){
    res.render(`/company/${ id }/foods`);
    return;
  }

  res.redirect(`/company/${ id }`);
});

router.route('/:id/foods/:food_id').put(async function(req, res){
  const { food_id } = req.params;
  const { name, price, categories, hour, minute, dish_per_day } = req.body;

  try {
    await food.findByIdAndUpdate(food_id, {
      name,
      price,
      categories,
      duration: {
        hour,
        minute
      },
      dish_per_day
    });

    res.status(200).json({ msg: 'Update food successfully' });
  }catch(error){
    res.status(400).json(foodErrorHandling(error));
  }
});

router.route('/:id/foods/:food_id').delete(async function(req, res){
  const { food_id } = req.params;

  await food.findByIdAndDelete(food_id);

  res.status(200).json({ msg: 'Food deleted successfully' });
});

router.route('/:id/tables').get(async function(req, res){
  const { id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Chef Manager' || role === 'Employer'){
    const $company = await company.findById(id);
    const tables = await table.find({ company_id: id });
    res.render('table/index', { company: $company, role, tables });
    return;
  }

  res.redirect(`/company/${ id }`);
});

router.route('/:id/tables').post(async function(req, res){
  const { id } = req.params;
  const { name } = req.body;

  try {
    const tables = await table.find({ company_id: id });

    if(tables.some(table => table.name === name)){
      throw { code: 11000 };
    }

    await table.create({ name, company_id: id });

    res.status(200).json({ msg: 'Add a new table successfully' });
  }catch(error){
    res.status(400).json(tableErrorHandling(error));
  }
});

router.route('/:id/tables/:table_id').put(async function(req, res){
  const { id, table_id} = req.params;
  const { name } = req.body;

  try {
    const tables = await table.find({ company_id: id });

    if(tables.some(table => table.name === name)){
      throw { code: 11000 };
    }

    await table.findByIdAndUpdate(table_id, {
      name
    });

    res.status(200).json({ msg: 'Update table successfully' });

  }catch(error){
    console.log(error);
    res.status(400).json(tableErrorHandling(error));
  }
});

router.route('/:id/tables/:table_id').delete(async function(req, res){
  const { table_id } = req.params;

  await table.findByIdAndDelete(table_id);

  res.status(400).json({ msg: 'Delete table successfully' });
});

module.exports = router;