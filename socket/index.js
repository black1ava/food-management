const order = require('../models/order');

module.exports = function(io){
  io.on('connection', function(socket){
    console.log('A user is connected');

    socket.on('send-order', async function(_orders, callback){
      const { orders, company_id, table_id } = _orders;

      try {
        const $order = await order.create({ orders, company_id, table_id });
        socket.broadcast.emit('send-order', $order);
        callback({ status: 200, msg: 'An order created successfully' });
      }catch(error){
        callback({
          status: 400,
          msg: error
        });
      }
    });

    socket.on('check-order', async function(id, status, callback){

      const $order = await order.findByIdAndUpdate(id, { status });

      console.log($order);

      if(status === 'accepted'){
        socket.broadcast.emit('order-accepted', $order);
      }

      callback({ 
        status: 200,
        msg: 'Update successfully'
      });
    });

    socket.on('done-order', async function(orderId, foodId, callback){
      const $order = await order.findById(orderId);
      const food = $order.orders.map(function(f){
        if(f.food_id === foodId){
          f.done = true
        }

        return f;
      });

      await order.findByIdAndUpdate(orderId, { orders: food });

      callback({
        status: 200,
        msg: 'Update successfully'
      });
    })
  });
}