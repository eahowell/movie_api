const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birthday: Date,
    Death_day: Date,
    TopMovies: String,
  },
  Actors: [String],
  ImagePath: String,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  ToWatch: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let genreSchema = mongoose.Schema({
  Name: String,
  Description: String,
});

let directorSchema = mongoose.Schema({
  Name: String,
  Bio: String,
  Birthday: Date,
  Deathday: Date,
});

let actorsSchema = mongoose.Schema({
  Name: String,
  Bio: String,
  Birthday: Date,
  Deathday: Date,
});

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Director = mongoose.model("Director", directorSchema);
let Genre = mongoose.model("Genre", genreSchema);
let Actor = mongoose.model("Actor", actorsSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;
module.exports.Actor = Actor;
