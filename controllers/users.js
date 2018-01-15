'use strict';

// Normally we have to do const _ = require(lodash) but here since we used container, we cana directly pass it as below

module.exports = function(_){

    return {
        SetRouting: function(router){
            router.get('/',this.indexPage);
            router.get('/signup', this.getSignUp);
        },

        indexPage: function(req, res){
            // res.render aautomatically goes to views folder, and since index is mentioned, it searches for index file in it
            return res.render('index');
        },

        getSignUp: function(req, res){
            return res.render('signup');
        }
    }
}
