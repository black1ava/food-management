const router = require('express').Router();
const jwt = require('jsonwebtoken');
const authorized = require('../middlewares/authorized');
const food = require('../models/food');
const table = require('../models/table');
const order = require('../models/order');

router.use(authorized);

router.route('/user').get(function(req, res){
  const token = req.cookies['authorized_token'];

  jwt.verify(token, process.env.SECRET, function(err, decodedToken){
    const { id } = decodedToken;
    res.status(200).json({ id });
  })
});

router.route('/company/:id/foods').get(async function(req, res){
  const { id } = req.params;
  const foods = await food.find({ company_id: id });
  res.status(200).json(foods);
});

router.route('/company/:id/tables').get(async function(req, res){
  const { id } = req.params;
  const tables = await table.find({ company_id: id });
  res.status(200).json(tables);
});

router.route('/company/:id/orders').get(async function(req, res){
  const { id } = req.params;
  const orders = await order.find({ company_id: id, status: 'pending' });
  res.status(200).json(orders);
});

module.exports = router;