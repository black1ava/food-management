const express = require('express');
require('dotenv').config();
const authRoute = require('./routes/auth');

const app = express();
const { PORT } = process.env;

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

authRoute(app);

app.listen(PORT, function(){
  console.log(`Server is running on port ${ PORT }`);
});