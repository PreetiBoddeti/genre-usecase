const validateSchema = require("../validations/validation");
const mongoose = require("mongoose");
const {Rental} = require('../models/rental');
const debugget = require("debug")("genre-project:GET");
const debugpost = require("debug")("genre-project:POST");
const debugput = require("debug")("genre-project:PUT");
const debugdelete = require("debug")("genre-project:DELETE");
const express = require('express');
const router = express.Router();
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');


//RENTAL API CALLS
//GET
router.get("/vidly.com/api/rentals", async (req, res) => {
    debugget("debugging GET method");
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
  });
  
  //POST
  router.post("/vidly.com/api/rentals", async (req, res) => {
    debugpost("debugging POST method");
    var result = await validateSchema.validateRental(req.body);
    if (result) {
      res.status(201).send(result);
    }
    let isValidId = mongoose.Types.ObjectId.isValid(req.body.customerId);
    if (!isValidId) return res.status(400).send("Invalid customer");
    const customer = await Customer.findById(req.body.customerId);
  
    isValidId = mongoose.Types.ObjectId.isValid(req.body.movieId);
    if (!isValidId) return res.status(400).send("Invalid movie");
    let movie = await Movie.findById(req.body.movieId);
  
    let rental = await new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
      dateOut: req.body.dateOut,
      dateReturned: req.body.dateReturned,
      rentalFee: req.body.rentalFee,
    });
    rental = await rental.save();
    if (rental) {
      console.log("stock ", movie.numberInStock);
      movie.numberInStock = movie.numberInStock - 1;
      movie.save();
    }
    await res.send(rental);
  });
  
  //PUT
  router.put("/vidly.com/api/rentals", async (req, res) => {
    debugput("debugging PUT method");
    var result = await validateSchema.validateRentalUpdate(req.body);
    if (result) {
      res.status(201).send(result);
    }
    let isValidId = mongoose.Types.ObjectId.isValid(req.body.customerId);
    if (!isValidId) return res.status(400).send("Invalid customer");
    const customer = await Customer.findById(req.body.customerId);
  
    isValidId = mongoose.Types.ObjectId.isValid(req.body.movieId);
    if (!isValidId) return res.status(400).send("Invalid movie");
    const movie = await Movie.findById(req.body.movieId);
  
    isValidId = mongoose.Types.ObjectId.isValid(req.body.id);
    if (!isValidId) return res.status(400).send("Invalid rental");
    const rental = await Rental.findById(req.body.id);
  
    if (rental) {
      rental.customer._id = req.body.customerId;
      (rental.customer.name = customer.name),
        (rental.customer.isGold = customer.isGold),
        (rental.customer.phone = customer.phone);
  
      (rental.movie._id = req.body.movieId),
        (rental.movie.title = movie.title),
        (rental.movie.dailyRentalRate = movie.dailyRentalRate);
  
      (rental.dateOut = req.body.dateOut),
        (rental.dateReturned = req.body.dateReturned),
        (rental.rentalFee = req.body.rentalFee);
      rental.save();
    } else {
      res.send("Rental is empty");
    }
    await res.send(rental);
  });
  
  //DELETE
  router.delete("/vidly.com/api/rentals", async (req, res) => {
    debugdelete("debugging DELETE method", req.body);
    var result = await validateSchema.validateRentalDelete(req.body);
    if (result) {
      res.status(201).send(result);
    }
    const rental = await Rental.deleteOne({ _id: req.body.id });
    if (!rental) {
      return res.status(201).send("The id given as a request is not available");
    }
  
    await res.send("The rental " + req.body.id + " is deleted");
  });
  module.exports = router;