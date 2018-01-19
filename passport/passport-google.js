'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretFile');
// We have to do 2 things passport.serialize user amd deserialize user.sreialize user tells which info of user must be stored in session(basically id)

// User contains all info regarding usr like id, name, etc..
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        // If there is an error, user is set to null and returns error else error is set to null and return id
        done(err, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:3001/auth/google/callback',
    passReqToCallback: true

}, (req, acccesstoken, refreshToken, profile, done) => {
    User.findOne({google:profile.id}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.image.url;

            newUser.save((err) => {
                if(err){
                    return done(err)
                }
                return done(null, newUser);
            });
        }

    });
}));
