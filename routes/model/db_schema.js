const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category_type = new Schema({
   name: {
      type: String,
      required: [true, 'Name field is required']
   },
   type: {
      type: String,
      required: [true, 'Type field is required']
   },
   parent: {
      type: Number,
      required: [true, 'Please supply a parent Id 0 for main category']
   },
   typeImage: {
      type: String
   }
});
const customer = new Schema({
   firstName: {
      type: String,
      required: [true, 'firstName field is required']
   },
   lastName: {
      type: String,
      required: [true, 'lastName field is required']
   },
   contact: {
      type: String,
   },
   address1: {
      type: String,
   },
   address2: {
      type: String,
   },
   telephone1: {
      type: String,
      required: [true, 'telephone1 is required']
   },
   telephone2: {
      type: String,
      
   },
   email: {
      type: String,
      required: [true, 'email is required']
   },
   password: {
      type: String,
      required: [true, 'password is required']

   },
   gender: {
      type: String,
      required: [true, 'gender is required']
   },
   city: {
      type: String,
   },
   state: {
      type: String,
   },
   country: {
      type: String,
   },
   shippingDetails: {
      type: String,
   },
   others: {
      type: String,
   },
   picture: {
      type: String,
   },
   referral: {
      type: String,
   },
   lastLogin: {
      type: Date,
   },
   dateRegistered: {
      type: Date,
   },
   zipcode: {
      type: Number,
   }
   
});

module.exports = {
   categoryType: mongoose.model('category_type', category_type),
   customer: mongoose.model('customer', customer),
};