require("dotenv").config();
// const dotenv = require("dotenv");
// dotenv.config();
const express = require("express");
const app = express();
const Joi = require("@hapi/joi");
const validateSchema = require("./validations/validation");
const debugget = require("debug")("genre-project:GET");
const debugpost = require("debug")("genre-project:POST");
const debugput = require("debug")("genre-project:PUT");
const debugdelete = require("debug")("genre-project:DELETE");
const cors = require("cors");
app.use(cors());


app.use(express.json());

const genres = [
  { id: 1, genre: "action" },
  { id: 2, genre: "thriller" },
  { id: 3, genre: "comedy" },
  { id: 4, genre: "romance" },
];

//get the details of the genres available within the application vidly
app.get("/vidly.com/api/genres", (req, res) => {
  debugget("debugging GET method");
  res.send(genres);
});

//post the new genre into the array
app.post("/vidly.com/api/genres", (req, res) => {
  debugpost("debugging POST method");
  var result = validateSchema.validatePostSchema(req.body);
  if (result) {
    res.status(201).send(result);
  }
  const genre = {
    id: genres.length + 1,
    genre: req.body.genre,
  };

  genres.push(genre);
  res.send(genres);
});

app.put("/vidly.com/api/genres", (req, res) => {
  debugput("debugging PUT method");
  var result = validateSchema.validateSchema(req.body);
  if (result) {
    res.status(201).send(result);
  }
  var genre = genres.find((gn) => gn.id === parseInt(req.body.id));

  if (!genre) {
    return res.status(201).send("The id given as a request is not available");
  }

  genre.genre = req.body.genre;
  res.send(genres);
});

//DELETE
app.delete("/vidly.com/api/genres", (req, res) => {
  debugdelete("debugging DELETE method");
  var result = validateSchema.validateDeleteSchema(req.param.id);
  if (result) {
    res.status(201).send(result);
  }
  var genre = genres.find((gn) => gn.id === parseInt(req.param.id));
  if (!genre) {
    return res.status(201).send("The id given as a request is not available");
  }
  var index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genres);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("connected to port ", port);
});
