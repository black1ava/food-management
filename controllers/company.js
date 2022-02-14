const router = require('express').Router();
const authorized = require('../middlewares/authorized');
const company = require('../models/company');
const user = require('../models/user');

router.use(authorized);

router.route('/create').get(function(req, res){
  res.render('company/create');
});

router.route('/create').post(async function(req, res){
  const { name, phone, email, employer_id } = req.body;

  const newCompany = await company.create({ name, email, phone});
  await user.findByIdAndUpdate(employer_id, { work_at: newCompany._id});

  res.status(200).json({ message: 'Create a company successfully' });
});

module.exports = router;