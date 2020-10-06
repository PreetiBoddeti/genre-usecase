const validateSchema = require("../validations/validation");
const {Customer} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const debugget = require("debug")("genre-project:GET");
const debugpost = require("debug")("genre-project:POST");
const debugput = require("debug")("genre-project:PUT");
const debugdelete = require("debug")("genre-project:DELETE");



//Customer API Calls
router.get("/vidly.com/api/customers", async (req, res) => {
    debugget("debugging GET method");
    const customers = await Customer.find().sort("name");
    res.send(customers);
  });
  
  router.post("/vidly.com/api/customers", async (req, res) => {
    debugpost("debugging POST method");
    var result = await validateSchema.validateCustomer(req.body);
    if (result) {
      res.status(201).send(result);
    }
    let customer = await new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
      address: req.body.address,
    });
    customer = await customer.save();
    await res.send(customer);
  });
  
  //PUT
  router.put("/vidly.com/api/customers", async (req, res) => {
    debugput("debugging PUT method");
    var result = await validateSchema.validateCustomerUpdate(req.body);
    if (result) {
      res.status(201).send(result);
    }
  
    let customer = await Customer.findById(req.body.id);
    if (customer) {
      (customer.name = req.body.name),
        (customer.isGold = req.body.isGold),
        (customer.phone = req.body.phone),
        (customer.address = req.body.address);
      customer.save();
    } else {
      res.send("customer is empty");
    }
    await res.send(customer);
  });
  
  router.delete("/vidly.com/api/customers", async (req, res) => {
    debugdelete("debugging DELETE method", req.body);
    var result = await validateSchema.validateCustomerDelete(req.body);
    if (result) {
      res.status(201).send(result);
    }
    const customer = await Customer.deleteOne({ _id: req.body.id });
    if (!customer) {
      return res.status(201).send("The id given as a request is not available");
    }
  
    res.send("The customer " + req.body.id + " is deleted");
  });
  module.exports=router;