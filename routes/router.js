const express = require('express');
const shoppayRouter = express.Router();

var db_schema = require('./model/db_schema.js');


shoppayRouter.post('/signup', (req, res) => {
   let categories = new db_schema.categoryType(req.body);
   categories.save()
      .then(value => {
         console.log(value);
         res.status(200).json({
            'categories': 'categories added successfully'
         });
      })
      .catch(err => {
         // console.log(err);
         res.status(400).send(err.message);
      });
});


shoppayRouter.get('/get_mainCategory', (req, res) => {
   
   db_schema.categoryType.find({ parent: 0, type: "mainCategory" }, function (err, categories) {
      if (err)
         console.log(err);
      else
         res.json(categories);
   })
   
});

shoppayRouter.post('/add_category', (req, res) => {
   let categories = new db_schema.categoryType(req.body);
   categories.save()
      .then(value => {
         console.log(value);
         res.status(200).json({
            'categories': 'categories added successfully'
         });
      })
      .catch(err => {
         // console.log(err);
         res.status(400).send(err.message);
      });
});



module.exports = shoppayRouter