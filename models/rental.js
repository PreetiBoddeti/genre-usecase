const mongoose = require('mongoose');

//Rental Schema
const Rental = mongoose.model(
    "Rental",
    new mongoose.Schema({
      customer: {
        type: new mongoose.Schema({
          name: {
            type: String,
            required: true,
            ref: "Customer",
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
            maxlength: 50,
          },
        }),
        required: true,
      },
      movie: {
        type: new mongoose.Schema({
          title: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255,
          },
          dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
            max: 255,
          },
        }),
        required: true,
      },
      dateOut: {
        type: Date,
        required: true,
        default: Date.now,
      },
      dateReturned: {
        type: Date,
      },
      rentalFee: {
        type: Number,
        min: 0,
      },
    })
  );

  exports.Rental=Rental;
  