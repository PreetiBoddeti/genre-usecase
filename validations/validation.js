const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

async function validateSchema(requestBody) {
  const requestBodySchema = await Joi.object().keys({
    id: Joi.required(),
    genre: Joi.string().required(),
  });

  const { error } = await requestBodySchema.validate(requestBody);

  if (error) {
    return error.details[0].message;
  }
}

async function validateDeleteSchema(requestBody) {
 const requestBodyDeleteSchema =await  Joi.object().keys({
    id: Joi.required(),
  });

  const { error } = await requestBodyDeleteSchema.validate(requestBody);

  if (error) {
    return error.details[0].message;
  }
}

async function validatePostSchema(requestBody) {
  const requestBodyPostSchema =await Joi.object().keys({
    genre: Joi.string().required(),
  });
  const { error } =await  requestBodyPostSchema.validate(requestBody);
  if (error) {
    return error.details[0].message;
  }
}

async function validateMovie(movie){
  const schema=await Joi.object().keys({
    title:  Joi.string().required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required() 
  });
  const {error} = await schema.validate(movie);
  if(error){
    return error.details[0].mesaage;
  }
}

async function validateMovieUpdate(movie){
  const schema=await Joi.object().keys({
    id:Joi.required(),
    title:  Joi.string().required(),
    genreId: Joi.string().required(),
    genreName:Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required() 
  });
  const {error} = await schema.validate(movie);
  if(error){
    return error.details[0].mesaage;
  }
}

async function validateMovieDelete(movie){
  const schema=await Joi.object().keys({
    id:Joi.required()
  });
  const {error} = await schema.validate(movie);
  if(error){
    return error.details[0].mesaage;
  }
}

async function validateRental(rental){
  console.log(rental);
  const schema = await Joi.object().keys({
    customerId:Joi.string().required(),
    movieId:Joi.string().required(),
    dateOut: Joi.required(),
    dateReturned: Joi.required(),
    rentalFee:Joi.number().required()
  });
  const {error} = await schema.validate(rental);
  if(error){
    return error.details[0].message;
  }
}

async function validateRentalUpdate(rental){
  const schema = await Joi.object().keys({
    id: Joi.string().required(),
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
    dateOut:Joi.required(),
    dateReturned:Joi.required(),
    rentalFee:Joi.number().required()
  });
  const {error} = await schema.validate(rental);
  if(error){
    return error.details[0].message;
  }
}

async function validateRentalDelete(rental){
  const schema=await Joi.object().keys({
    id:Joi.required()
  });
  const {error} = await schema.validate(rental);
  if(error){
    return error.details[0].mesaage;
  }
}

async function validateCustomer(customer){
  const schema = await Joi.object().keys({
    name:Joi.string().required(),
    isGold: Joi.required(),
    phone:Joi.string().required(),
    address:Joi.string().required()
  });
  const {error} = await schema.validate(customer);
  if(error){
    return error.details[0].message;
  }
}

async function validateCustomerUpdate(customer){
  const schema = await Joi.object().keys({
    id:Joi.string().required(),
    name:Joi.string().required(),
    isGold: Joi.required(),
    phone:Joi.string().required(),
    address:Joi.string().required()
  });
  const {error} = await schema.validate(customer);
  if(error){
    return error.details[0].message;
  }
}

async function validateCustomerDelete(customer){
  const schema=await Joi.object().keys({
    id:Joi.required()
  });
  const {error} = await schema.validate(customer);
  if(error){
    return error.details[0].mesaage;
  }
}


module.exports = { validateSchema, validateDeleteSchema, validatePostSchema ,validateMovie, validateMovieUpdate, validateMovieDelete, validateRental, validateRentalUpdate, validateRentalDelete, validateCustomer, validateCustomerUpdate, validateCustomerDelete};
