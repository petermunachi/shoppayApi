exports.validateSignupHandler = function (data) {

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

exports.validateLoginHandler = function (data) {

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

exports.validateProductHandler = function (data) {

   let response = {};

   if (data.title == '') {
      response.msg = 'Name or Title of the product is required';
      response.status = 0;
      return response;
   }

   if (data.pcategories == '') {
      response.msg = 'Product category is required';
      response.status = 0;
      return response;
   }

   if (data.categories == '') {
      response.msg = 'Product sub-category is required';
      response.status = 0;
      return response;
   }

   if (data.location == '') {
      response.msg = 'Product location or city is required';
      response.status = 0;
      return response;
   }
   if (data.condition == '') {
      response.msg = 'Product condition is required';
      response.status = 0;
      return response;
   }
   if (data.price == '') {
      response.msg = 'Product price is required';
      response.status = 0;
      return response;
   }
   if (isNaN(data.price)) {
      response.msg = 'Enter a valid product price ';
      response.status = 0;
      return response;
   }

   if (data.description == '') {
      response.msg = 'Product description is required';
      response.status = 0;
      return response;
   }

   if (data.description.length < 30) {
      response.msg = 'Product description must be greather than 30 characters';
      response.status = 0;
      return response;
   }
   if (data.picture == '') {
      response.msg = 'Product picture(s) is required';
      response.status = 0;
      return response;
   }

   response.status = 1;
   return response;

}
