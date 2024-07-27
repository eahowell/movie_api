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
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
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
let allowedOrigins = ["http://localhost:8080", "http://testsite.com", "http://localhost:1234", "https://wtp8hh.csb.app", "https://myflix-eahowell-7d843bf0554c.herokuapp.com"];

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

// READ - GET - Return data about a genre (description) by name (e.g., “Thriller”)
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

// READ - GET - Return a list of ALL users to the user
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
    // First & Last Name, Email, and Birtday must be present
    check("FirstName", "First Name is required").not().isEmpty(),
    check("LastName", "Last Name is required").not().isEmpty(),
    check("Birthday", "Birthday is required").not().isEmpty(),
    check("Email", "Email is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    // Check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
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
app.put(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  [
    // Password must be between 8 and 25 characters if provided
    check("Password")
      .optional()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 and 25 characters long.")
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
     let hashPassword = Users.hashPassword(req.body.Password);
     if (req.body.Password) updateFields.Password = hashPassword;

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

//   Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Allow port to change if necessary
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
