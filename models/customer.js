const mongoose = require('mongoose');

//Customer Schema
const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 10,
      },
      address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
      },
    })
  );
  exports.Customer =Customer;