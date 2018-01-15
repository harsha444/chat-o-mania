'use strict';

// Normally we have to do const _ = require(lodash) but here since we used container, we cana directly pass it as below

module.exports = function(_, passport, User){

    return {
        SetRouting: function(router){
            router.get('/',this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);


            router.post('/signup', User.SignUpValidation, this.postSignUp)
        },

        indexPage: function(req, res){
            // res.render aautomatically goes to views folder, and since index is mentioned, it searches for index file in it
            return res.render('index');
        },

        getSignUp: function(req, res){
            const errors = req.flash('error');
            return res.render('signup', {title:  'chat-o-mania | Login',messages: errors, hasErrors: errors.length > 0});
        },

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        homePage: function(req, res){
            return res.render('home');
        }
    }
}
