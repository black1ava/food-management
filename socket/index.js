module.exports = function(io){
  io.on('connection', function(){
    console.log('A user is connected');
  });
}