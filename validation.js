// Description: Validate provided password is correct;  (using username and password)
  const passport = require("passport"); // Local passport file



// READ - GET - Validate provided password is correct;  (using username and password)
module.exports = (router) => {
  router.post("/validation", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        return res.status(400).json({
          message: "Something is not right",
          user: false,
        });
      } else if (!user) {
        return res.status(400).json({
          message: info.message,
          user: false,
        })
      } else {
        return res.status(200).json({
          message: "Valid password",
          user: user,
        });
      }
    })(req, res);
  });
};

