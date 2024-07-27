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

// CREATE - POST - Allow users to login;  (using username and password)
module.exports = (router) => {
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