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
  const { name, phone, email, employer_id, role, employer_email } = req.body;

  try {
    const newCompany = await company.create({ name, email, phone});
    await user.findByIdAndUpdate(employer_id, {
      '$push': {
        work_at: {
          company_id: newCompany._id,
          role
        }
      }
    });
  
    res.status(200).json({ message: 'Create a company successfully' });
  }catch(error){
    res.status(400).json(companyErrorHandler(error));
  }
});

module.exports = router;