const express = require('express');
const bcrypt = require('bcrypt');
const shoppayRouter = express.Router();

var db_schema = require('./model/db_schema');

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

               let userDetails = new db_schema.customer(req.body);

               userDetails.save()
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
                        response.msg = value;
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

const checkUser = (email) => {
   

}

const validateSignupHandler = (data) => {

   // let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   let emailReg = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

   let passwordReg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

   let response = {};

   if (data.firstName == '') {
      response.msg = 'First name is required';
      response.status = 0;
      return response;
   }

   if (data.lastName == '') {
      response.msg = 'Last name is required';
      response.status = 0;
      return response;
   }
   
   if (data.email == '') {
      response.msg = 'Email is required';
      response.status = 0;
      return response;
   }
   
   if (data.phoneNumber == '') {
      response.msg = 'Phone number is required';
      response.status = 0;
      return response;
   }
  
   if (data.telephone1.length != 11) {
      response.msg = 'Invalid Phone Number';
      response.status = 0;
      return response;
   }
   
   if (!emailReg.test(data.email)) {
      response.msg = 'Enter a valid email address';
      response.status = 0;
      return response;
   }
   if (data.password == '') {
      response.msg = 'Password is required';
      response.status = 0;
      return response;
   }
   if (passwordReg.test(data.password) == false) {
      response.msg = 'Password must contain letter and alphabets';
      response.status = 0;
      return response;
   }
   if (data.gender == '') {
      response.msg = 'Gender is required';
      response.status = 0;
      return response;
   }
  
   response.status = 1;
   return response;

}
const validateLoginHandler = (data) => {

   let response = {};

   if (data.email == '') {
      response.msg = 'Email is required';
      response.status = 0;
      return response;
   }
   
   if (data.password == '') {
      response.msg = 'Password is required';
      response.status = 0;
      return response;
   }
 
   response.status = 1;
   return response;

}

module.exports = shoppayRouter