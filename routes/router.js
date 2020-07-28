const express = require('express');
const bcrypt = require('bcrypt');
const shoppayRouter = express.Router();

var fs = require("fs");
var formidable = require('formidable');
const multer = require('multer')
const Mime = require('mime/Mime');



var db_schema = require('./model/db_schema');
var state = require('../state.json');
var lga = require('../lga.json');

const {
   validateSignupHandler,
   validateLoginHandler,
   validateProductHandler,
} = require('./model/validation');
const { log } = require('console');

var dateStamp = new Date();
var timeStamp = dateStamp.getTime();
var recentDate = dateStamp.toDateString();

function generateRandomString(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


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


shoppayRouter.get('/latest_product', (req, res) => {
   db_schema.products.find({}).limit(100).sort({ date_created : 1 } ).exec(function(err, result) {  
      if (err)
         console.log(err);
      else
         res.json(result);
   });  
   
});
shoppayRouter.get('/get_mainCategory', (req, res) => {

   db_schema.categoryType.find({ parent: "0", type: "mainCategory" }, function (err, categories) {
      if (err)
         console.log(err);
      else
         res.json(categories);
   })
   
});

shoppayRouter.get('/states', (req, res) => {
   res.json(state);
   
});
shoppayRouter.get('/lga/:id', (req, res) => {
   let id = parseInt(req.params.id);
   console.log(id);
   let local = lga;

   let returnedArray = [];

   for (const states in local) {
      if (local.hasOwnProperty(states)) {
         const element = local[states];
         // console.log(element.state.name);
         if (element.state.id == id) {
            console.log(local);
            returnedArray = element.state.locals;

         }
         
      }
   }

   // console.log(returnedArray);
   res.json(returnedArray);

   
   
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
shoppayRouter.get('/product_list/:id', (req, res) => {
   let id = req.params.id.toString();
   console.log(req.params.id);
   
   db_schema.products.find({ categories: id }, function (err, products) {
      if (err)
         console.log(err);
      else
         res.json(products);
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

shoppayRouter.post('/add_product', (req, res)=>{
   const response = {};
  
   if (req.body) {
      const validateInput = validateProductHandler(req.body);
      if (validateInput.status == 1) {
         let photo = req.body.picture;
         let savedPhotos = [];
         // console.log(photo);
         req.body.transcid = ''; req.body.brand = ''; req.body.num_of_views = 0; 
         req.body.picture = savedPhotos; req.body.publish = 1; req.body.commission = "";
         req.body.buyerId = ""; req.body.date_created = recentDate; req.body.sold = 0;
         
         if (!photo) {
            return new Error('Invalid Input String')
         }

         let fullUrl = req.protocol + '://' + req.get('host')+'/';
         
         for (let i = 0; i < photo.length; i++) {
            let photobase = photo[i].photobase64;
            let url = photo[i].photourl;
            // console.log(url);

            let res = Buffer.from(photobase, 'base64');
            let name = generateRandomString(5);
            let secondName = generateRandomString(3);
            let decodeImg = res;
            let imageBuffer = decodeImg;
            let extension = url.split('.').pop();
            // http: //192.168.43.12:3000/
            let fileName = name + timeStamp + secondName + "." + extension;
            savedPhotos.push(fullUrl+fileName)
            fs.writeFileSync('./uploads/' + fileName, imageBuffer, 'utf8');
         }
         
         let productsSchema = new db_schema.products(req.body);
         productsSchema.save()
            .then(value => {
               console.log(value);
               response.status = 1;
               res.status(200).json(response);
            })
            .catch(err => {
               console.log(err);
               res.status(400).send(err.message);
            });
      } else if (validateInput.status == 0) {

         response.status = 0;
         response.msg = validateInput.msg;
         res.status(400).json(response);

      }
   } else {
      res.status(400).send("No request found");
   }
   
});





module.exports = shoppayRouter