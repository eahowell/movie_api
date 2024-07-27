// Description: Validate provided password is correct;  (using username and password)
  const Models = require("./models.js");  
  const Users = Models.User;

// CREATE - POST - Validate provided password is correct;  (using username and password)
module.exports = (router) => {
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