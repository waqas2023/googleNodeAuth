const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


app.use(passport.initialize());

// app.get("/auth/google",
//     passport.authenticate("google", { scope: ["profile", "email"] })
// );
app.get("/auth/google",
    passport.authenticate("google", { 
        scope: ["profile", "email"],
        accessType: "offline",
        prompt: "consent"
    })
);


app.get("/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const token = jwt.sign({ email: req.user.emails[0].value }, "SECRET_KEY");
        res.redirect("http://localhost:4200/login/success?token=" + token);
    }
);

app.listen(3000, () => console.log("Server running: 3000"));
