require("dotenv").config();
// const dotenv = require("dotenv");
// dotenv.config();
require("express-async-errors");
const express = require("express");
const app = express();
const Joi = require("@hapi/joi");
require("winston-mongodb");
const asyncMiddleware = require("./middleware/async");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Mongoose } = require("mongoose");
const cors = require("cors");

app.use(cors()); //to avoid disturbances in connectivity with cloud server
app.use(express.json());
app.use(require('./routes/genre'));
app.use(require('./routes/movie'));
app.use(require('./routes/customer'));
app.use(require('./routes/rental'));
app.use(require('./routes/user'));

mongoose
  .connect(
    "mongodb://localhost/vidly",
    { useNewUrlParser: true, useUnifiedTopology: true },
    { useFindAndModify: false }
  )
  .then(() => console.log("database connected...!!!"))
  .catch((err) => console.error("Could not connect to the database.."));

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("connected to port ", port);
  });



