const validateSchema = require("../validations/validation");
const {User} = require('../models/user');
const mongoose = require("mongoose");
const auth= require("../middleware/auth");   
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const express = require('express');
const router = express.Router();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
}

//USERS API CALLS
//GET Current User
router.get("/vidly.com/api/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  });
  
  //POST
  router.post("/vidly.com/api/users", async (req, res) => {
    var result = await validateSchema.validateUserSchema(req.body);
    if (result) {
      res.status(201).send(result);
    }
  
    let user = await User.findOne({ email: req.body.userEmail });
    if (user) return res.status(400).send("User already  registered");
    user = new User({
      name: req.body.userName,
      email: req.body.userEmail,
      password: req.body.userPassword,
    });
    const salt = await bcrypt.genSalt(10);
    console.log("salt ", salt);
    user.password = await bcrypt.hash(user.password, salt);
    console.log(user.password);
    user = await user.save();
    console.log("user ", user);
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      "jwtPrivateKey"
    );
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  });
  
  router.post("/vidly.com/api/auth", async (req, res) => {
    var result = await validateSchema.validateAuthUserSchema(req.body);
    if (result) {
      res.status(201).send(result);
    }
  
    let user = await User.findOne({ email: req.body.userEmail });
    console.log(user);
    if (!user) return res.status(400).send("Invalid email or password");
    console.log("entered pwd", req.body.userPassword);
    console.log("db pwd", user.password);
    const validPassword = await bcrypt.compare(
      req.body.userPassword,
      user.password
    );
    console.log(validPassword);
    if (!validPassword) return res.status(400).send("Invalid Password ");
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      config.get("jwtPrivateKey")
    );
    res.send(token);
  });
  module.exports = router;
  
  