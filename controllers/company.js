const router = require('express').Router();
const authorized = require('../middlewares/authorized');
const company = require('../models/company');
const companyErrorHandler = require('../errorHandling/company');
const user = require('../models/user');

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
  
        $.work_at.push({
          company_id: newCompany._id,
          role: 'employer'
        });
  
        await $.save();
  
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
            role: 'employer'
          }
        }
      });

      res.status(200).json({ msg: 'Create company successfully'});
    }catch(err){
      res.status(400).json(companyErrorHandler(err));
    }
  }
});

router.route('/:id').get(async function(req, res){

  const { id } = req.params;

  const $company = await company.findById(id);

  res.render('company/show', { company: $company });
});

router.route('/:id/employees').get(async function(req, res){
  const { id } = req.params

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

  return res.render('employee/index', { employees: $employees, company: $company });
});

router.route('/:id/employees/new').get(async function(req, res){

  const { id } = req.params;

  const $company = await company.findById(id);

  res.render('employee/new', { company: $company });
});

router.route('/:id/employees/new').post(async function(req, res){
  const { id } = req.params;
  const { username, email, password, role, employee_email } = req.body;

  try {
    const $company = await company.findById(id);

    if(employee_email === ''){
      const $user = new user({ username, email, password });

      $user.work_at.push({
        company_id: $company._id,
        role
      });
      
      await $user.save();
    }else{
      user.findOne({ email: employee_email}, async function(err, $){
        if($ === null){
         throw { employee_email: 'This email does not exist' }
        }

        $.work_at.push({
          company_id: $company._id,
          role
        });

        await $.save();
      });
    }

    res.status(200).json({ msg: 'Add employee successfully' });
  }catch(error){
    res.status(400).json(error);
  }
});

module.exports = router;