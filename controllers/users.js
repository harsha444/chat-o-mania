'use strict';

// Normally we have to do const _ = require(lodash) but here since we used container, we can directly pass it as below

module.exports = function(_, passport, User){

    return {
        SetRouting: function(router){
            router.get('/',this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            router.post('/', User.LoginValidation, this.postLogin);
            router.post('/signup', User.SignUpValidation, this.postSignUp)
        },

        indexPage: function(req, res){
            // res.render aautomatically goes to views folder, and since index is mentioned, it searches for index file in it
            const errors = req.flash('error');
            return res.render('index', {title:  'chat-o-mania | Login',messages: errors, hasErrors: errors.length > 0});
        },

        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getSignUp: function(req, res){
            const errors = req.flash('error');
            return res.render('signup', {title:  'chat-o-mania | Signup',messages: errors, hasErrors: errors.length > 0});
        },

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),

        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read']
        }),

        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),


        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        homePage: function(req, res){
            return res.render('home');
        }
    }
}
