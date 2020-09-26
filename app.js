require("dotenv").config();
// const dotenv = require("dotenv");
// dotenv.config();
const express = require("express");
const app = express();
const Joi = require("@hapi/joi");
const validateSchema = require("./validations/validation");
const auth = require("./middleware/auth");
const admin = require("./middleware/admin");
const debugget = require("debug")("genre-project:GET");
const debugpost = require("debug")("genre-project:POST");
const debugput = require("debug")("genre-project:PUT");
const debugdelete = require("debug")("genre-project:DELETE");
const cors = require("cors");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Mongoose } = require("mongoose");
const string = require("@hapi/joi/lib/types/string");
app.use(cors()); //to avoid disturbances in connectivity with cloud server
app.use(express.json());

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
}
mongoose
  .connect(
    "mongodb://localhost/vidly",
    { useNewUrlParser: true, useUnifiedTopology: true },
    { useFindAndModify: false }
  )
  .then(() => console.log("database connected...!!!"))
  .catch((err) => console.error("Could not connect to the database.."));

const genreSchema = new mongoose.Schema({
  genre: {
    type: { String, Array },
    _id: Object,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Genre = mongoose.model("Genre", genreSchema);

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trime: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

//Customer Schema
const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
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
      maxlength: 10,
    },
    address: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
  })
);

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

//User Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  },
});
const User = mongoose.model("Users", userSchema);

//get the details of the genres available within the application vidly
app.get("/vidly.com/api/genres", async (req, res) => {
  debugget("debugging GET method");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

//post the new genre into the array
//can post only if the user holds the correct authenticated token
app.post("/vidly.com/api/genres", auth, async (req, res) => {
  debugpost("debugging POST method");
  var result = await validateSchema.validatePostSchema(req.body);
  if (result) {
    res.status(201).send(result);
  }
  let genre = new Genre({ genre: req.body.genre });
  genre = await genre.save();
  res.send(genre);
});

app.put("/vidly.com/api/genres", async (req, res) => {
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
app.delete("/vidly.com/api/genres", [auth, admin], async (req, res) => {
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

//MOVIE API CALLS
//GET
app.get("/vidly.com/api/movies", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

//POST
app.post("/vidly.com/api/movies", async (req, res) => {
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
app.put("/vidly.com/api/movies", async (req, res) => {
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
app.delete("/vidly.com/api/movies", async (req, res) => {
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

//Customer API Calls
app.get("/vidly.com/api/customers", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

app.post("/vidly.com/api/customers", async (req, res) => {
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
app.put("/vidly.com/api/customers", async (req, res) => {
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

app.delete("/vidly.com/api/customers", async (req, res) => {
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

//RENTAL API CALLS
//GET
app.get("/vidly.com/api/rentals", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

//POST
app.post("/vidly.com/api/rentals", async (req, res) => {
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
app.put("/vidly.com/api/rentals", async (req, res) => {
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
app.delete("/vidly.com/api/rentals", async (req, res) => {
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

//USERS API CALLS
//GET Current User
app.get("/vidly.com/api/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
//POST
app.post("/vidly.com/api/users", async (req, res) => {
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

app.post("/vidly.com/api/auth", async (req, res) => {
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
  if (!validPassword) return res.status(400).send("Error ");
  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("connected to port ", port);
});
