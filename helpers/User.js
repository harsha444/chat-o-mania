// contains user validations
'use strict';

module.exports = function(){
    return {
        SignUpValidation: (req, res, next) => {
            req.checkBody('username', 'Username is Required').notEmpty();
            req.checkBody('username', 'Username must not be less than 5').isLength({min: 5});
            req.checkBody('email', 'Email is Required').notEmpty();
            req.checkBody('email', 'Email is invalid').isEmail();
            req.checkBody('password', 'Password is Required').isLength({min: 5});

            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });

                    req.flash('error', messages);
                    res.redirect('/signup');
                })
                .catch((err) => {
                    return next();
                })
        }
    }
}