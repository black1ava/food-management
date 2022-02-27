const order = require('../models/order');

module.exports = function(io){
  io.on('connection', function(socket){
    console.log('A user is connected');

    socket.on('send-order', async function(_orders, callback){
      const { orders, company_id, table_id } = _orders;

      try {
        await order.create({ orders, company_id, table_id });
        socket.broadcast.emit('send-order', _orders);
        callback({ status: 200, msg: 'An order created successfully' });
      }catch(error){
        callback({
          status: 400,
          msg: error
        });
      }
    });
  });
}