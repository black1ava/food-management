const express = require('express');
require('dotenv').config();
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const homeRoute = require('./routes/home');
const companyRoute = require('./routes/company');
const apiRoute = require('./routes/api');

const app = express();
const { PORT, URI } = process.env;

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(cookieParser());

mongoose.connect(URI);

mongoose.connection.once('open', function(){
  console.log('Connect to database successfully');
});

authRoute(app);
homeRoute(app);
companyRoute(app);
apiRoute(app);

app.listen(PORT, function(){
  console.log(`Server is running on port ${ PORT }`);
});