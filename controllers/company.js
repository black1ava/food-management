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

      const $ = await user.findById(user_id);

      res.status(200).json({ msg: 'Create company successfully'});
    }catch(err){
      res.status(400).json(companyErrorHandler(err));
    }
  }
});

router.route('/:id').get(async function(req, res){

  const { id } = req.params;

  const $company = await company.findById(id);

  res.render('company/index', { company: $company });
});

module.exports = router;