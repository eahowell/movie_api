/**
 * @fileoverview Express server implementation for myFlix movie API
 * @requires express
 * @requires morgan
 * @requires fs
 * @requires path
 * @requires body-parser
 * @requires method-override
 * @requires uuid
 * @requires mongoose
 * @requires passport
 * @requires cors
 */
require('dotenv').config();
console.log("Loaded CONNECTION_URI:", process.env.CONNECTION_URI);
const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  uuid = require("uuid");
const { title } = require("process");
const mongoose = require("mongoose");
const Models = require("./models.js");
const { Model } = require("module");

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;
const Actors = Models.Actor;

// Mongoose to connect to that database so it can perform CRUD operations on the documents it contains from within your REST API.
// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/eahowellDB";

// mongoose
//   .connect(dbURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));

mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
// Debug MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});
const app = express();
// Add detailed request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err);
  res.status(500).send('Server error occurred');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));
// Create a write stream (in append mode) a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// Setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: true })); // Ensures Express is available in other files
app.use(bodyParser.json());
app.use(methodOverride());

const cors = require("cors");
let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:4200",
  "http://testsite.com",
  "http://localhost:1234",
  "https://wtp8hh.csb.app",
  "https://myflix-eahowell-7d843bf0554c.herokuapp.com",
  "https://eahowell-myflix.netlify.app",
  "https://www.mongodb.com/",
  "https://eahowell.github.io",
  "https://eahowell.github.io/myFlix-Angular-client/",
  "https://github.com/",
  "https://github.com/eahowell/myFlix-Angular-client",
  "http://cc-myflix-website.s3-website-us-east-1.amazonaws.com",
  "http://ehowell-dev.me/myFlix-Angular-client",
  "http://ehowell-dev.me/myFlix-Angular-client/",
  "http://ehowell-dev.me/",
  "http://ehowell-dev.me",
  "*"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application does not allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth")(app);
let validate = require("./validation")(app);
const passport = require("passport");
require("./passport"); // Local passport file
const { check, validationResult } = require("express-validator");
const req = require("express/lib/request.js");

// Pass through the static files stored in the public folder
app.use(express.static("public"));

// READ - GET - Return a list of ALL movies to the user

/**
 * @function GET/movies
 * @route {GET} /movies
 * @name GET/movies: All Movies
 * @description Returns a list of all movies to the user
 * @access Authentication JWT required
 * @returns {object[]} 200 - An array of movie objects
 * @throws {Error} 500 - Unexpected error
 */

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return data about a single movie by title to the user

/**
 * @function GET/movies/:title
 * @route {GET} /movies/:title
 * @name GET/movies:  Movie by Title
 * @authentication JWT required
 * @param {String} Title (Required) - Movie title
 * @returns {Object} 200 - Movie object
 * @example Response - 200 - Success Response
 *{
 *  {
 *  "Genre": {
 *    "Description": "Movies intended to elicit emotional responses from the audience, often featuring intense character    development and interpersonal conflicts.",
 *    "Name": "Drama"
 *  },
 *  "Director": {
 *    "Bio": "Boaz Yakin is an American filmmaker, screenwriter, and director known for his work on Remember the Titans and Fresh.",
 *    "Birthday": "1966-06-20T05:00:00.000Z",
 *    "Name": "Boaz Yakin"
 *  },
 *  "_id": "65ea3766ecc7df78687ec88f",
 *  "Actors": ["Denzel Washington", "Will Patton", "Wood Harris"],
 *  "Description": "A film based on the true story of a newly appointed African-American coach and his high school team on their first season as a racially integrated unit.",
 *  "ImagePath": "image_url_here",
 *  "Title": "Remember the Titans"
 *  }
 *}
 * @throws {Error} 400 - Movie not found
 * @throws {Error} 500 - Unexpected error
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        if (!movie) {
          res
            .status(400)
            .send("The movie " + req.params.title + " was not found");
        } else {
          res.status(200).json(movie);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return data about a genre (description) by name (e.g., “Drama”)
/**
 * @function GET/genres/:genreName
 * @route GET /genres/:genreName
 * @authentication JWT required
 * @param {string} Genre (Required) - The name of the genre you want info on
 * @returns {Object} 200 - Genre object
 * @throws {Error} 400 - Genre not found
 * @throws {Error} 500 - Unexpected error
 * @example Response - 200 - Success Response
 * {
 *    "_id": "6",
 *    "Name": "Drama"
 *    "Description": "Movies intended to elicit emotional responses from the audience, often featuring intense character development and interpersonal conflicts.",

 * }
 */
app.get(
  "/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Genres.findOne({ Name: req.params.genreName })
      .then((genre) => {
        if (genre) {
          res.status(200).json(genre);
        } else {
          res
            .status(400)
            .send("The genre " + req.params.genreName + " was not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return data about a director (bio, birth year, death year) by name
/**
 * @function GET/directors/:directorName
 * @route GET /directors/:directorName
 * @authentication JWT required
 * @param {String} Director (Required) - The name of the specific director
 * @returns {Object} 200 - Director object
 * @throws {Error} 400 - Director not found
 * @throws {Error} 500 - Unexpected error
 * @example Response - 200 - Success Response
 * {
 *     "_id_": "65ea58f9c4e85e82e09e8fa3",
 *     "Name": "Christopher Nolan",
 *     "Birthday": "1970-07-30T00:00:00.000Z",
 *     "Deathday": null,
 *     "Bio": "Christopher Edward Nolan is a British-American film director, producer, and screenwriter. He is known for his distinct filmmaking style, which often includes nonlinear narratives, complex plots, and philosophical themes. Nolan has directed several critically acclaimed and commercially successful films, including Inception, The Dark Knight Trilogy, and Interstellar."
 * }
 */
app.get(
  "/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Directors.findOne({ Name: req.params.directorName })
      .then((director) => {
        if (director) {
          res.status(200).json(director);
        } else {
          res
            .status(400)
            .send("The director " + req.params.directorName + " was not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return a list of ALL users to the
/**
 * @function GET/users
 * @route GET /users
 * @authentication JWT required
 * @returns {Object[]} 201 - An array of user objects
 * @throws {Error} 500 - Unexpected error
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Verify username in the request body matches the one in the request parameter
    // if (req.user.Username !== req.params.username) {
    //   return res.status(400).send(`Permission denied`);
    // }
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return the details of a specific to the user
/**
 * GET user by username
 * @route GET /users/:username
 * @authentication JWT required
 * @param {String} Username (Required) - The username of the user
 * @returns {Object} 200 - User object
 * @throws {Error} 400 - Permission denied
 * @throws {Error} 404 - User not found
 * @throws {Error} 500 - Unexpected error
 * @example Response - 200 - Success Response
 * * @example Response - 201 - Success Response
 * {
 *   "user": {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "john_doe",
 *     "Password": "hashed_password_here",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FirstName": "John",
 *     "LastName": "Doe",
 *     "FavoriteMovies": [],
 *     "ToWatch": [],
 *   },
 * }
 */
app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Verify username in the request body matches the one in the request parameter
    if (req.user.Username !== req.params.username) {
      return res
        .status(400)
        .send(
          `Permission denied ${req.user.Username} is not ${req.params.username}`
        );
    }
    await Users.findOne({ Username: req.params.username })
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .send("Username " + req.params.username + " was not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// CREATE - POST - Allow new users to register;  (username, password, first name, last name, email, date of birth)
/**
 * @function POST/users
 * @name POST/users:  User Registration
 * @summary User Registration Endpoint
 * @description Allow new users to register
 *
 * @example Request Body
 * {
 *   "Username": { type: String, required: true },
 *   "Password": { type: String, required: true },
 *   "Email": { type: String, required: true },
 *   "Birthday": { type: Date, required: true },
 *   "FirstName": { type: String, required: true },
 *   "LastName": { type: String, required: true },
 * }
 *
 * @example Response - 201 - Success Response
 * {
 *   "user": {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "john_doe",
 *     "Password": "hashed_password_here",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FirstName": "John",
 *     "LastName": "Doe",
 *     "FavoriteMovies": [],
 *     "ToWatch": [],
 *   },
 * }
 *
 * @returns {Object} 201 - Created user object
 * @returns {Error} 409 - Username already exists
 * @returns {Error} 422 - Validation error
 * @returns {Error} 500 - Unexpected error
 */

app.post(
  "/users",
  [
    // Username must be between 5 and 15 letters and be alphanumeric
    check("Username", "Username is required").isLength({ min: 5, max: 15 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    // Password must be present and between 8 and 25 characters
    check("Password", "Password is required").not().isEmpty(),
    check(
      "Password",
      "Password must be between 8 and 25 characters long."
    ).isLength({ min: 8, max: 25 }),
    // First & Last Name, Email, and Birthday must be present
    check("FirstName", "First Name is required").not().isEmpty(),
    check("LastName", "Last Name is required").not().isEmpty(),
    check("Birthday", "Birthday is required").not().isEmpty(),
    check("Email", "Email is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res, info) => {
    // Check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          console.log("Username " + req.body.Username + " already exists");

          return {
            res: res
              .status(409)
              .send("Username " + req.body.Username + " already exists"),
          };
        } else {
          let hashPassword = Users.hashPassword(req.body.Password);
          Users.create({
            Username: req.body.Username.toLowerCase(),
            Password: hashPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// UPDATE - PUT - Allow users to update their user info (email, first name, last name, and password)
// Only those fields can be updated because we don't want username, userID, and DOB to be changed

/**
 * @function PUT/users
 * @name PUT/users:  Update User Info
 * @summary Update User Info Endpoint
 * @param {String} Username (Required) - The username of the user
 *
 * @example Request Body
 * {
 *   "Username": { type: String, required: true },
 *   "Password": { type: String, required: true },
 *   "Email": { type: String, required: true },
 *   "FirstName": { type: String, required: true },
 *   "LastName": { type: String, required: true },
 * }
 *
 * @example Response - 201 - Success Response
 * {
 *   "user": {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "john_doe",
 *     "Password": "hashed_password_here",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FirstName": "John",
 *     "LastName": "Doe",
 *     "FavoriteMovies": [],
 *     "ToWatch": [],
 *   },
 * }
 *
 * @example Response - 409 - Error Response
 * {
 *   "message": "Username already exists"
 * }
 * @example Response - 422 - Error Response
 * {
 *   A JSON object holding an array of the validation errors
 * }
 * @example Response - 500 - Error Response
 * {
 *   "message":  Description of the error
 * }
 */

app.put(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  [
    // Password must be between 8 and 25 characters if provided
    check("Password")
      .optional()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 and 25 characters long."),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // Verify username in the request body matches the one in the request parameter
    if (req.user.Username !== req.params.username) {
      return res
        .status(400)
        .send(
          `Permission denied ${req.user.Username} is not ${req.params.username}`
        );
    }
    // Create an object with only the fields that are present in the request body
    const updateFields = {};
    if (req.body.Email) updateFields.Email = req.body.Email;
    if (req.body.FirstName) updateFields.FirstName = req.body.FirstName;
    if (req.body.LastName) updateFields.LastName = req.body.LastName;

    if (req.body.Password) {
      let hashPassword = Users.hashPassword(req.body.Password);
      updateFields.Password = hashPassword;
    }

    await Users.findOneAndUpdate(
      { Username: req.params.username },
      { $set: updateFields },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(200).json(updatedUser);
        } else {
          res
            .status(404)
            .send("Username " + req.params.username + " was not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// UPDATE - PUT - Allow users to add a movie to their list of favorites
/**
 * @function PUT/users/:username/favorites/:MovieID
 * @name PUT/users: Add Movie to Favorites
 * @summary Add a movie to user's favorites list
 * @description Allows users to add a movie to their list of favorite movies
 * @route {PUT} /users/:username/favorites/:MovieID
 * @authentication JWT required
 *
 * @param {String} Username (Required) - The username of the user
 * @param {String} MovieID  (Required) - The ID of the movie to add to favorites
 *
 * @example Request URL
 * PUT /users/johndoe/favorites/65ea3766ecc7df78687ec88f
 *
 * @returns {Object} 201 - Updated user object
 * @example Response - 201 - Success Response
 * {
 *   "_id": "60f5b1c8c45e4c1b8c6f5678",
 *   "Username": "johndoe",
 *   "Email": "john.doe@example.com",
 *   "Birthday": "1990-05-15T00:00:00.000Z",
 *   "FirstName": "John",
 *   "LastName": "Doe",
 *   "FavoriteMovies": ["65ea3766ecc7df78687ec88f"], // Added movie ID appears in array
 *   "ToWatch": []
 * }
 *
 * @throws {Error} 400 - Permission denied - when username doesn't match authenticated user
 * @throws {Error} 404 - Username not found
 * @throws {Error} 500 - Internal server error
 */
app.put(
  "/users/:username/favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Verify username in the request body matches the one in the request parameter
    if (req.user.Username !== req.params.username) {
      return res
        .status(400)
        .send(
          `Permission denied ${req.user.Username} is not ${req.params.username}`
        );
    }
    await Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $addToSet: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(201).json(updatedUser);
        } else {
          res
            .status(404)
            .send("Username " + req.params.username + " was not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// DELETE - Allow users to remove a movie from their list of favorites
/**
 * @function DELETE/users/:username/favorites/:MovieID
 * @name DELETE/users: Remove Movie from Favorites
 * @summary Remove a movie from user's favorites list
 * @description Allows users to remove a movie from their list of favorite movies
 * @route {DELETE} /users/:username/favorites/:MovieID
 * @authentication JWT required
 *
 * @param {String} Username (Required) - The username of the user
 * @param {String} MovieID  (Required) - The ID of the movie to remove from favorites
 *
 * @returns {Object} 201 - Updated user object
 * @example Request URL
 * DELETE /users/johndoe/favorites/65ea3766ecc7df78687ec88f
 *
 * @example Response - 201 - Success Response
 * {
 *   "_id": "60f5b1c8c45e4c1b8c6f5678",
 *   "Username": "johndoe",
 *   "Email": "john.doe@example.com",
 *   "Birthday": "1990-05-15T00:00:00.000Z",
 *   "FirstName": "John",
 *   "LastName": "Doe",
 *   "FavoriteMovies": [], // Movie ID removed from array
 *   "ToWatch": []
 * }
 *
 * @throws {Error} 400 - Permission denied - when username doesn't match authenticated user
 * @throws {Error} 404 - Username not found
 * @throws {Error} 500 - Internal server error
 */
app.delete(
  "/users/:username/favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Verify username in the request body matches the one in the request parameter
    if (req.user.Username !== req.params.username) {
      return res
        .status(400)
        .send(
          `Permission denied ${req.user.Username} is not ${req.params.username}`
        );
    }
    await Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(201).json(updatedUser);
        } else {
          res
            .status(404)
            .send("Username " + req.params.username + " was not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Update - PUT - Allow users to add movie to the “To Watch” list
/**
 * @function PUT/users/:username/toWatch/:MovieID
 * @name PUT/users: Add Movie to Watch List
 * @summary Add a movie to user's to-watch list
 * @description Allows users to add a movie to their list of movies to watch later
 * @route {PUT} /users/:username/toWatch/:MovieID
 * @authentication JWT required
 *
 * @param {String} Username (Required) - The username of the user
 * @param {String} MovieID  (Required) - The ID of the movie to add to watch list
 *
 * @returns {Object} 201 - Updated user object
 * @example Request URL
 * PUT /users/johndoe/toWatch/65ea3766ecc7df78687ec88f
 *
 * @example Response - 201 - Success Response
 * {
 *   "_id": "60f5b1c8c45e4c1b8c6f5678",
 *   "Username": "johndoe",
 *   "Email": "john.doe@example.com",
 *   "Birthday": "1990-05-15T00:00:00.000Z",
 *   "FirstName": "John",
 *   "LastName": "Doe",
 *   "FavoriteMovies": [],
 *   "ToWatch": ["65ea3766ecc7df78687ec88f"] // Added movie ID appears in array
 * }
 *
 * @throws {Error} 400 - Permission denied - when username doesn't match authenticated user
 * @throws {Error} 404 - Username not found
 * @throws {Error} 500 - Internal server error
 */
app.put(
  "/users/:username/toWatch/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Verify username in the request body matches the one in the request parameter
    if (req.user.Username !== req.params.username) {
      return res
        .status(400)
        .send(
          `Permission denied ${req.user.Username} is not ${req.params.username}`
        );
    }
    await Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $addToSet: { ToWatch: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(201).json(updatedUser);
        } else {
          res
            .status(404)
            .send("Username " + req.params.username + " was not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// DELETE - Allow users to remove a movie from their list of To Watch
/**
 * @function DELETE/users/:username/toWatch/:MovieID
 * @name DELETE/users: Remove Movie from Watch List
 * @summary Remove a movie from user's to-watch list
 * @description Allows users to remove a movie from their list of movies to watch later
 * @route {DELETE} /users/:username/toWatch/:MovieID
 * @authentication JWT required
 *
 * @param {String} Username (Required) - The username of the user
 * @param {String} MovieID  (Required) - The ID of the movie to remove from watch list
 *
 * @returns {Object} 201 - Updated user object
 * @example Request URL
 * DELETE /users/johndoe/toWatch/65ea3766ecc7df78687ec88f
 *
 * @example Response - 201 - Success Response
 * {
 *   "_id": "60f5b1c8c45e4c1b8c6f5678",
 *   "Username": "johndoe",
 *   "Email": "john.doe@example.com",
 *   "Birthday": "1990-05-15T00:00:00.000Z",
 *   "FirstName": "John",
 *   "LastName": "Doe",
 *   "FavoriteMovies": [],
 *   "ToWatch": [] // Movie ID removed from array
 * }
 *
 * @throws {Error} 400 - Permission denied - when username doesn't match authenticated user
 * @throws {Error} 404 - Username not found
 * @throws {Error} 500 - Internal server error
 */
app.delete(
  "/users/:username/toWatch/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Verify username in the request body matches the one in the request parameter
    if (req.user.Username !== req.params.username) {
      return res
        .status(400)
        .send(
          `Permission denied ${req.user.Username} is not ${req.params.username}`
        );
    }
    await Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $pull: { ToWatch: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(201).json(updatedUser);
        } else {
          res
            .status(404)
            .send("Username " + req.params.username + " was not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// DELETE - Allow existing users to deregister
/**
 * @function DELETE/users/:username
 * @name DELETE/users: Deregister User
 * @summary Delete user account
 * @description Allows existing users to completely delete their account and all associated data
 * @route {DELETE} /users/:username
 * @authentication JWT required
 *
 * @param {String} Username (Required) - The username of the account to be deleted
 *
 * @returns {String} 200 - Success message
 *
 * @example Request URL
 * DELETE /users/johndoe
 *
 * @example Response - 200 - Success Response
 * "johndoe was deleted."
 *
 * @example Response - 400 - Error Response (User Not Found)
 * "johndoe was not found"
 *
 * @example Response - 400 - Error Response (Permission Denied)
 * "Permission denied john_smith is not johndoe"
 *
 * @security
 * - Requires valid JWT token
 * - Can only delete your own account (username in token must match username in URL)
 * - Action is permanent and irreversible
 * - All user data including favorites and watch lists will be deleted
 *
 * @throws {Error} 400 - Permission denied - when username doesn't match authenticated user
 * @throws {Error} 400 - User not found - when username doesn't exist
 * @throws {Error} 500 - Internal server error
 */
app.delete(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Verify username in the request body matches the one in the request parameter
    if (req.user.Username !== req.params.username) {
      return res
        .status(400)
        .send(
          `Permission denied ${req.user.Username} is not ${req.params.username}`
        );
    }
    await Users.findOneAndDelete({ Username: req.params.username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.username + " was not found");
        } else {
          res.status(200).send(req.params.username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return a list of ALL directors to the user
/**
 * @function GET/directors
 * @name GET/directors: All Directors
 * @summary Get all movie directors
 * @description Returns a list of all directors with their biographical information
 * @route {GET} /directors
 * @authentication JWT required
 *
 * @returns {Object[]} 200 - An array of director objects
 * @example Request URL
 * GET /directors
 *
 * @example Response - 200 - Success Response
 * [
 *   {
 *     "_id": "65ea58f9c4e85e82e09e8fa3",
 *     "Name": "Christopher Nolan",
 *     "Bio": "Christopher Edward Nolan is a British-American film director, producer, and screenwriter. He is known for his distinct filmmaking style, which often includes nonlinear narratives, complex plots, and philosophical themes.",
 *     "Birthday": "1970-07-30T00:00:00.000Z",
 *     "Deathday": null
 *   },
 *   {
 *     "_id": "65ea58f9c4e85e82e09e8fa4",
 *     "Name": "Quentin Tarantino",
 *     "Bio": "Quentin Jerome Tarantino is an American film director, screenwriter, producer, and actor. His films are characterized by nonlinear storylines, dark humor, stylized violence, extended dialogue, and references to popular culture.",
 *     "Birthday": "1963-03-27T00:00:00.000Z",
 *     "Deathday": null
 *   }
 * ]
 *
 * @throws {Error} 500 - Internal server error
 */
app.get(
  "/directors",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Directors.find()
      .then((directors) => {
        res.status(200).json(directors);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return a list of ALL genres to the user

/**
 * @function GET/genres
 * @name GET/genres: All Genres
 * @summary Get all movie genres
 * @description Returns a list of all available movie genres and their descriptions
 * @route {GET} /genres
 * @authentication JWT required
 *
 * @returns {Object[]} 200 - An array of genre objects
 * @example Request URL
 * GET /genres
 *
 * @example Response - 200 - Success Response
 * [
 *   {
 *     "_id": "65ea58f9c4e85e82e09e8fa1",
 *     "Name": "Drama",
 *     "Description": "Movies intended to elicit emotional responses from the audience, often featuring intense character development and interpersonal conflicts."
 *   },
 *   {
 *     "_id": "65ea58f9c4e85e82e09e8fa2",
 *     "Name": "Science Fiction",
 *     "Description": "Speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science, technology, time travel, parallel universes, and extraterrestrial life."
 *   }
 * ]
 *
 * @throws {Error} 500 - Internal server error
 */

app.get(
  "/genres",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Genres.find()
      .then((genres) => {
        res.status(200).json(genres);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return genreID of genre by name
/**
 * @function GET/genres/:genreName/id
 * @name GET/genres: Genre ID by Name
 * @summary Get genre ID by name
 * @description Returns the ID of a specific genre when given its name
 * @route {GET} /genres/:genreName/id
 * @authentication JWT required
 *
 * @returns {String} 200 - The ID of the genre
 * @param {String} genreName.path.required - The name of the genre to look up
 *
 * @example Request URL
 * GET /genres/Drama/id
 *
 * @example Response - 200 - Success Response
 * "65ea58f9c4e85e82e09e8fa1"
 *
 * @throws {Error} 400 - Genre not found
 * @throws {Error} 500 - Internal server error
 */
app.get(
  "/genres/:genreName/id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Genres.findOne({ Name: req.params.genreName })
      .then((genre) => {
        if (genre) {
          res.status(200).json(genre._id);
        } else {
          res
            .status(400)
            .send("The genre " + req.params.genreName + " was not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return actorID of Actor by name
/**
 * @function GET/directors/:directorName/id
 * @name GET/directors: Director ID by Name
 * @summary Get director ID by name
 * @description Returns the ID of a specific director when given their name
 * @route {GET} /directors/:directorName/id
 * @authentication JWT required
 *
 * @returns {String} 200 - The ID of the director
 * @param {String} directorName.path.required - The name of the director to look up
 *
 * @example Request URL
 * GET /directors/Christopher%20Nolan/id
 *
 * @example Response - 200 - Success Response
 * "65ea58f9c4e85e82e09e8fa3"
 *
 * @throws {Error} 400 - Director not found
 * @throws {Error} 500 - Internal server error
 */
app.get(
  "/actors/:actorName/id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Actors.findOne({ Name: req.params.actorName })
      .then((actor) => {
        if (actor) {
          res.status(200).json(actor._id);
        } else {
          res
            .status(400)
            .send("The actor " + req.params.actorName + " was not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return directorID of Director by name
app.get(
  "/directors/:directorName/id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Directors.findOne({ Name: req.params.directorName })
      .then((director) => {
        if (director) {
          res.status(200).json(director._id);
        } else {
          res
            .status(400)
            .send("The director " + req.params.directorName + " was not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return userID of User by username
app.get(
  "/users/:username/id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.username })
      .then((user) => {
        if (user) {
          res.status(200).json(user._id);
        } else {
          res
            .status(400)
            .send("Username " + req.params.username + " was not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// READ - GET - Return movieID of Movie by title
app.get(
  "/movies/:title/id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        if (movie) {
          res.status(200).json(movie._id);
        } else {
          res
            .status(400)
            .send("The movie " + req.params.title + " was not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function GET/health
 * @name GET/health: API Health Check
 * @summary Check if the API is running
 * @description Public endpoint to verify the API is up and running
 * @route {GET} /health
 * @access Public - No authentication required
 * 
 * @returns {Object} 200 - Status information including API version, uptime, and database connection status
 * @example Response - 200 - Success Response
 * {
 *   "status": "ok",
 *   "message": "myFlix API is running",
 *   "version": "1.0.0",
 *   "timestamp": "2025-03-13T12:34:56.789Z",
 *   "uptime": "1d 2h 34m 56s",
 *   "database": {
 *     "connected": true
 *   }
 * }
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'myFlix API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: formatUptime(process.uptime()),
    database: {
      connected: mongoose.connection.readyState === 1
    }
  });
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Allow port to change if necessary
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
