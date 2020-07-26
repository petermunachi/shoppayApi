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
      type: String,
      required: [true, 'Please supply a parent Id 0 for main category']
   },
   typeImage: {
      type: Array
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

const products = new Schema({
   transcid: {
      type: String,
   },
   sellerId: {
      type: String,
      required: [true, 'sellerId field is required']
   },
   title: {
      type: String,
      required: [true, 'title field is required']
   },
   location: {
      type: String,
      required: [true, 'location field is required']
   },
   description: {
      type: String,
      required: [true, 'description field is required']
   },
   condition: {
      type: String,
      required: [true, 'condition field is required']
   },
   negotiation: {
      type: Boolean,
      required: [true, 'negotiation field is required']
   },
   brand: {
      type: String,
   },
   num_of_views: {
      type: Number,
   },
   categories: {
      type: String,
      required: [true, 'categories field is required']
   },
   pcategories: {
      type: String,
      required: [true, 'pcategories field is required']
   },
   price: {
      type: String,
      required: [true, 'price field is required']
   },
   picture: {
      type: Array,
      required: [true, 'picture is required']
   },
   publish: {
      type: Number,
   },
   commission: {
      type: String,
   },
   buyerId: {
      type: String,
   },
   date_created: {
      type: Date,
      required: [true, 'date_created is required']
   },
   sold: {
      type: Number,
   }
 
});

module.exports = {
   categoryType: mongoose.model('category_type', category_type),
   customer: mongoose.model('customer', customer),
   products: mongoose.model('products', products)
};