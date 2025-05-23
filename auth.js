const jwtSecret = "myFlixDB_462761_secret"; // Must match JWTStrategy secret

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
  /**
 * @function POST/login
 * @name POST/login: User Authentication
 * @summary Authenticate user and generate JWT token
 * @description Authenticates user credentials and returns a JWT token for subsequent API requests
 * @route {POST} /login
 * 
 * @param {Object} RequestBody (Required) - Login credentials
 * @param {String} Username (Required) - User's username
 * @param {String} Password (Required) - User's password
 * 
 * @example Request Body
 * {
 *   "Username": "johndoe",
 *   "Password": "password123"
 * }
 * 
 * @example Response - 200 - Success Response
 * {
 *   "user": {
 *     "_id": "60f5b1c8c45e4c1b8c6f5678",
 *     "Username": "johndoe",
 *     "Email": "john.doe@example.com",
 *     "Birthday": "1990-05-15T00:00:00.000Z",
 *     "FirstName": "John",
 *     "LastName": "Doe",
 *     "FavoriteMovies": [],
 *     "ToWatch": []
 *   },
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGY1YjFjOGM0NWU0YzFiOGM2ZjU2NzgiLCJVc2VybmFtZSI6ImpvaG5kb2UiLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTYzNTE3MjY5MH0.example-token"
 * }
 * 
 * @example Response - 401 - Authentication Failed
 * {
 *   "message": "Incorrect username or password"
 * }
 * 
 * @example Response - 500 - Authentication Error
 * {
 *   "message": "Authentication error",
 *   "error": "Detailed error message"
 * }
 * 
 * @example Response - 500 - Login Error
 * {
 *   "message": "Login error",
 *   "error": "Detailed error message"
 * }
 * 
 * @returns {Object} 200 - User object and JWT token
 * @throws {Error} 401 - Authentication failed - incorrect username or password
 * @throws {Error} 500 - Authentication error
 * @throws {Error} 500 - Login error
 * 
 * @security
 * - Uses Passport local strategy for authentication
 * - Returns JWT token for subsequent API authentication
 * - Token must be included in Authorization header for protected routes
 * - Passwords are hashed and never returned in responses
 * - Session-less authentication using JWT
 * 
 * @notes
 * - The returned JWT token should be included in subsequent requests as:
 *   Authorization: Bearer <token>
 * - Token expires after configurable time period
 * - Username is case-sensitive
 * - Failed login attempts should be rate-limited (implement rate limiting middleware)
 */
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        return res.status(500).json({
          message: "Authentication error",
          error: error.message,
        });
      }

      if (!user) {
        // Return the specific error message from passport strategy
        return res.status(401).json({
          message: info.message || "Authentication failed",
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.status(500).json({
            message: "Login error",
            error: error.message,
          });
        }
        let token = generateJWTToken(user.toJSON());
        return res.status(200).json({ user, token });
      });
    })(req, res);
  });
};
