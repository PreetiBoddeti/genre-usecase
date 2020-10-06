const mongoose = require('mongoose');

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

  exports.genreSchema = genreSchema;
  exports.Genre = Genre;