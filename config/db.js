const express = require('express');
const mongoose = require("mongoose");
const config = require('config');
console.log("name",config.get('name'));
console.log("config", config.get('db'));
mongoose
  .connect(
    config.get('db'),
    { useNewUrlParser: true, useUnifiedTopology: true },
    { useFindAndModify: false }
  )
  .then(() => console.log(`database connected to ${config.get('db')}...!!!`))
  .catch((err) => console.error("Could not connect to the database.."));