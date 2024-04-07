const 
    passport = require("passport"),
    LocalStrategy  = require("passport-local").Strategy,
    Models = require("./models.js"),
    passportJWT =  require("passport-jwt");

let
    Users = Models.User,
    JWTStrategy = passportJWT.Strategy
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: "Username",
            passwordField: "Password",
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await Users.findOne({Username: username})
            .then((user)=> {
                if (!user) {
                    console.log("Incorrect username.");
                    return callback (null, false, {
                        message: "Incorrect username and password."
                    });
                }
                if (!user.validatePassword(password)) {
                    console.log("Incorrect password.");
                    return callback(null, false, {message: "Incorrect password."})
                }
                console.log("Finished");
                return callback(null,user);
            })
            .catch((error) => {
                if (error) {
                console.log(error);
                return callback(error);
                }
            })
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: "myFlixDB_462761_secret"
        },
        async (jwtPayload, callback) => {
            try {
                const user = await Users.findById(jwtPayload._id);
                if (!user) {
                    return callback(null, false);
                }
                return callback(null, user);
            } catch (error) {
                return callback(error);
            }
        })
);