const express = require('express');
const bcrypt = require('bcrypt');
const shoppayRouter = express.Router();

var fs = require("fs");
var formidable = require('formidable');
const multer = require('multer')




var db_schema = require('./model/db_schema');
const {
   validateSignupHandler,
   validateLoginHandler,
   validateProductHandler,
} = require('./model/validation');

var d = new Date();
var recentDate = d.toDateString();


shoppayRouter.post('/signup', (req, res) => {
   const response = {};
   
   if (req.body){
      
      const validateInput = validateSignupHandler(req.body);
      
      if(validateInput.status == 1) {

         db_schema.customer.find({ email: req.body.email }, function (err, result) {
            if (result.length == 0) {
              
               let passwordBcrypt = bcrypt.hashSync(req.body.password, 10);

               req.body.password = passwordBcrypt; req.body.dateRegistered = recentDate;
               req.body.contact = ""; req.body.address1 = ""; req.body.address2 = "";
               req.body.telephone2 = ""; req.body.city = ""; req.body.state = "";
               req.body.country = ""; req.body.shippingDetails = ""; req.body.others = "";
               req.body.picture = ""; req.body.referral = ""; req.body.lastLogin = recentDate; req.body.zipcode = "";

               let userDetailSchema = new db_schema.customer(req.body);

               userDetailSchema.save()
                  .then(value => {
                     response.status = 1;
                     response.msg = 'Signup successfully';
                     res.status(200).json(response);
                  })
                  .catch(err => {
                     res.status(400).send(err.message);
                  });

            } else if (result.length != 0) {

               response.status = 0;
               response.msg = 'User already exist with this email, click forgot password to recover account';
               res.status(400).json(response);

            }
         })
  
      } else if (validateInput.status == 0) {

         response.status = 0;
         response.msg = validateInput.msg;
         res.status(400).json(response);

      }
      
   }else{
      res.status(400).send("No request found");
   }


});


shoppayRouter.post('/login', (req, res) => {
  const response = {};
   
   if (req.body){
      
      const validateInput = validateLoginHandler(req.body);
      if(validateInput.status == 1) {

         db_schema.customer.find({ email: req.body.email }, function (err, result) {
            if (result.length == 1) {

               if (bcrypt.compareSync(req.body.password, result[0].password)) {
                  let userDetails = new db_schema.customer(req.body);

                  db_schema.customer.updateOne(
                     { email: result[0].email },
                     {
                        $currentDate: { lastLogin: true }
                     }
                  )
                  .then(value => {
                        response.status = 1;
                        response.msg = result;
                        res.status(200).json(response);

                     })
                     .catch(err => {
                        res.status(400).send(err.message);
                     });

               } else {
                  response.status = 0;
                  response.msg = 'Password is incorrect, click forgot password to recover';
                  res.status(400).json(response);
               }

            } else if (result.length == 0) {

               response.status = 0;
               response.msg = 'User not found, click signup to register';
               res.status(400).json(response);

            }


         })
  
      } else if (validateInput.status == 0) {

         response.status = 0;
         response.msg = validateInput.msg;
         res.status(400).json(response);

      }
      
   }else{
      res.status(400).send("No request found");
   }

});


shoppayRouter.get('/get_mainCategory', (req, res) => {
   
   db_schema.categoryType.find({ parent: "0", type: "mainCategory" }, function (err, categories) {
      if (err)
         console.log(err);
      else
         res.json(categories);
   })
   
});

shoppayRouter.get('/get_subcategory/:id', (req, res) => {
   let id = req.params.id.toString();
   console.log(req.params.id);
   
   db_schema.categoryType.find({ parent: id, type: "subCategory" }, function (err, categories) {
      if (err)
         console.log(err);
      else
         res.json(categories);
   })
   
});

shoppayRouter.post('/add_subcategory', (req, res) => {
   req.body.type = "subCategory";

   let categoriesSchema = new db_schema.categoryType(req.body);
   categoriesSchema.save()
      .then(value => {
         console.log(value);
         res.status(200).json({
            'sub-categories': 'sub-categories added successfully'
         });
      })
      .catch(err => {
         // console.log(err);
         res.status(400).send(err.message);
      });
});
shoppayRouter.post('/add_category', (req, res) => {
   req.body.parent = "0"; req.body.type = "mainCategory";
   console.log(req.body);

   let categoriesSchema = new db_schema.categoryType(req.body);
   categoriesSchema.save()
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


shoppayRouter.post('/add_product', (req, res, next) => {
   console.log(req.body);
   try {
      // to declare some path to store your converted image
      const path = './uploads/'+Date.now()+'.jpg'
      const imgdata = req.body.picture;
      // to convert base64 format into random filename
      const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      
      fs.writeFileSync(path, base64Data,  {encoding: 'base64'});
      return res.send(path);
   } catch (e) {
        next(e);
   }
});





module.exports = shoppayRouter