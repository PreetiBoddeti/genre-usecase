const mongoose = require("mongoose");
const auth= require("../middleware/auth");   
const admin = require("../middleware/admin");
const validateSchema = require("../validations/validation");
const {Genre} = require('../models/genre');
const express = require('express');
const debugget = require("debug")("genre-project:GET");
const debugpost = require("debug")("genre-project:POST");
const debugput = require("debug")("genre-project:PUT");
const debugdelete = require("debug")("genre-project:DELETE");
const router = express.Router();
let winston = require("winston");


const logger = winston.createLogger({
  transports:[
    new winston.transports.File({ filename: 'logfile.log' }),
    // new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
  ]
})
//get the details of the genres available within the application vidly
router.get("/vidly.com/api/genres", async (req, res) => {
    debugget("debugging GET method");
    console.log("Get genres");
    // throw new Error("Could not get the Genres");
    const genres = await Genre.find().sort("name");
    if(!genres){
      return logger.error("Could not get the Genres");
    }
    res.send(genres);
  });
  
  //post the new genre into the array
  //can post only if the user holds the correct authenticated token
  router.post("/vidly.com/api/genres", auth, async (req, res) => {
    debugpost("debugging POST method");
    var result = await validateSchema.validatePostSchema(req.body);
    if (result) {
      res.status(201).send(result);
    }
    let genre = new Genre({ genre: req.body.genre });
    genre = await genre.save();
    res.send(genre);
  });
  
  router.put("/vidly.com/api/genres",auth, async (req, res) => {
    debugput("debugging PUT method");
    var result = await validateSchema.validateSchema(req.body);
    if (result) {
      res.status(201).send(result);
    }
  
    let genre = await Genre.findById(req.body.id);
    if (genre) {
      genre.genre = req.body.genre;
      genre.save();
    } else {
      res.send("genre is empty");
    }
    if (!genre) {
      return res.status(201).send("The id given as a request is not available");
    }
    await res.send(genre);
  });
  
  //DELETE
  //Can delete only if the user is an admin and has their respective token
  router.delete("/vidly.com/api/genres", [auth, admin], async (req, res) => {
    debugdelete("debugging DELETE method", req.body);
    var result = await validateSchema.validateDeleteSchema(req.body);
    if (result) {
      res.status(201).send(result);
    }
    const genre = await Genre.deleteOne({ _id: req.body.id });
    if (!genre) {
      return res.status(201).send("The id given as a request is not available");
    }
  
    // genre.save();
    res.send("The genre " + req.body.id + " is deleted");
  });
  
  module.exports = router;