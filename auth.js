const jwtSecret = "myFlixDB_462761_secret"; // Must match JWTStrategy sectret

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, //Encoded username for JWT
    expiresIn: "7d", // JWT Expiration
    algorithm: "HS256", // Algorithm used to encode JWT
  });
};


module.exports = (router) => {
  const cors = require("cors");
  let allowedOrigins = ["http://localhost:8080", "http://testsite.com", "http://localhost:1234", "https://wtp8hh.csb.app", "https://myflix-eahowell-7d843bf0554c.herokuapp.com"];
  
  router.use(
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
  
// CREATE - POST - Allow users to login;  (using username and password)
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.status(500).send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.status(200).json({ user, token });
      });
    })(req, res);
  });
};