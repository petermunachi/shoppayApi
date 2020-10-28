require('dotenv').config();

const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

// app.use(express.json());

var API = require('./routes/router');
var connection = require('./routes/model/db_connection');

const PORT = 3000;

connection.once('open', function () {
  console.log("MongoDB database connection established successfully");
})
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(fileUpload({
  createParentPath: true
}));

app.use(express.static(__dirname + '/uploads'));

app.use(cors());
app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
// app.use(morgan('dev'));
app.use('/shoppay', API);

app.listen(process.env.PORT, function () {
  console.log("Server is running on Port: " + process.env.PORT);
});
