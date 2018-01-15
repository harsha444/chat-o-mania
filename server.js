const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const container = require('./container');

container.resolve(function(users, _){

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/chat-o-mania', {useMongoClient: true});

    const app = SetupExpress();

    function SetupExpress(){
        const app = express();
        const server = http.createServer(app);
        server.listen(3001, function(){
            console.log('listening on port 3001');
        });
        ConfigureExpress(app);

        // Setup Router
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);
    }


    function ConfigureExpress(app){
        require('./passport/passport-local');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(validator());
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveInitialized: true,
            // MongoStore is important because it stores the data when user refreshes the page, if it is not there, data won't be stored
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));

        // for displaying flash messages
        app.use(flash());
        // we ahould use the passport.initialze after the above session for correct working
        app.use(passport.initialize());
        app.use(passport.session());
        // For setting lodash as global variable to use it in ejs fiels ass well
        app.locals._ = _;
    }
});
