require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

var API = require('./routes/router');
var connection = require('./routes/model/db_connection');

const PORT = 3000;

connection.once('open', function () {
  console.log("MongoDB database connection established successfully");
})
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use('/shoppay', API);

app.listen(process.env.PORT, function () {
  console.log("Server is running on Port: " + process.env.PORT);
});
