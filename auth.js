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
// CREATE - POST - Allow users to login;  (using username and password)
router.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) {
      return res.status(500).json({
        message: "Authentication error",
        error: error.message
      });
    }
    
    if (!user) {
      // Return the specific error message from passport strategy
      return res.status(401).json({
        message: info.message || "Authentication failed"
      });
    }

    req.login(user, { session: false }, (error) => {
      if (error) {
        return res.status(500).json({
          message: "Login error",
          error: error.message
        });
      }
      let token = generateJWTToken(user.toJSON());
      return res.status(200).json({ user, token });
    });
  })(req, res);
});
};