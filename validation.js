// Description: Validate provided password is correct;  (using username and password)
  const Models = require("./models.js");  
  const Users = Models.User;

// CREATE - POST - Validate provided password is correct;  (using username and password)
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
  router.post("/validation", (req, res) => {
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        if (user.validatePassword(req.body.Password)) {
          res.status(200).send(true);
        } else {
          res.status(401).send("Password was not correct.");
        }        
      } else {
        res
          .status(404)
          .send("Username " + req.body.username + " was not found.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
})};