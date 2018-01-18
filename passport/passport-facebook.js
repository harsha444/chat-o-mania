'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
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


passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3001/auth/facebook/callback',
    passReqToCallback: true

}, (req, token, refreshToken, profile, done) => {
    User.findOne({facebook:profile.id}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.email = profile._json.email
            newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/profile?type=large';
            newUser.fbTokens.push({token:token});

            newUser.save((err) => {
                return done(null, user);
            });
        }

    });
}));
