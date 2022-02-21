const router = require('express').Router();
const authorized = require('../middlewares/authorized');
const company = require('../models/company');
const companyErrorHandler = require('../errorHandling/company');
const user = require('../models/user');
const userErrorHandling = require('../errorHandling/signup');
const jwt = require('jsonwebtoken');
const category = require('../models/category');

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

  res.render('company/show', { company: $company, role });
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

  if(role === 'Employer' || role === 'Chef Manager'){
    const $company = await company.findById(id);

    res.render('category/new', { company:$company, role });
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
    res.status(400).json(error);
  }
});

router.route('/:id/categories/:category_id').get(async function(req, res){
  const { id, category_id } = req.params;
  const token = req.cookies['authorized_token'];

  const role = await getRole(token, id);

  if(role === 'Employer' || role === 'Chef Manager'){
    const $company = await company.findById(id);
    const $category = await category.findById(category_id);

    res.render('category/show', { company: $company, role, category: $category });
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

module.exports = router;