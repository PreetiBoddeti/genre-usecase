const validateSchema = require("../validations/validation");
const auth= require("../middleware/auth");   
const admin = require("../middleware/admin");
const {Movie} =require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const debugget = require("debug")("genre-project:GET");
const debugpost = require("debug")("genre-project:POST");
const debugput = require("debug")("genre-project:PUT");
const debugdelete = require("debug")("genre-project:DELETE");


//MOVIE API CALLS
//GET
router.get("/vidly.com/api/movies", async (req, res) => {
  debugget("debugging GET method");
    const movies = await Movie.find().sort("title");
    res.send(movies);
  });
  
  //POST
  router.post("/vidly.com/api/movies",auth, async (req, res) => {
    debugpost("debugging POST method");
    var result = await validateSchema.validateMovie(req.body);
    if (result) {
      res.status(201).send(result);
    }
    const isValidId = mongoose.Types.ObjectId.isValid(req.body.genreId);
    if (!isValidId) return res.status(400).send("Invalid genre");
    const genre = await Genre.findById(req.body.genreId);
  
    let movie = await new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        genre: genre.genre,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    movie = await movie.save();
    await res.send(movie);
  });
  
  //PUT
  router.put("/vidly.com/api/movies",auth, async (req, res) => {
    debugput("debugging PUT method");
    var result = await validateSchema.validateMovie(req.body);
    if (result) {
      res.status(201).send(result);
    }
  
    let movie = await Movie.findById(req.body.id);
    let genre = await Genre.findById(req.body.genreId);
  
    if (movie && genre) {
      movie.title = req.body.title;
      movie.genre._id = genre._id;
      movie.genre.genre = genre.genre;
      movie.numberInStock = req.body.numberInStock;
      movie.dailyRentalRate = req.body.dailyRentalRate;
      movie.save();
    }
    await res.send(movie);
  });
  
  //DELETE
  router.delete("/vidly.com/api/movies",[auth,admin], async (req, res) => {
    debugdelete("debugging DELETE method", req.body);
    var result = await validateSchema.validateMovieDelete(req.body);
    if (result) {
      res.status(201).send(result);
    }
    const movie = await Movie.deleteOne({ _id: req.body.id });
    if (!movie) {
      return res.status(201).send("The id given as a request is not available");
    }
  
    res.send("The movie " + req.body.id + " is deleted");
  });
 module.exports = router;