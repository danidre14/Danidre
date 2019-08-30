if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const newsRouter = require('./routes/news');
const contactRouter = require('./routes/contact');
const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');
const signoutRouter = require('./routes/signout');
const userRouter = require('./routes/user');
const error404Router = require('./routes/error404');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public')); //where most server files will be
app.use(express.urlencoded({limit: '10mb', extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //dont save variables if nothing has changed
    saveUninitialized: false //dont save empty value in session if there is no value
    //, cookie: {secure: true} //for https sites
}));
app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

if(process.env.NODE_ENV !== 'production') {
    app.use(function forceLiveDomain(req, res, next) {
        // Don't allow user to hit Heroku now that we have a domain
        var host = req.get('Host');
        if (host === 'danidre.herokuapp.com') {
        return res.redirect(301, 'http://danidre.com/' + req.originalUrl);
        }
        return next();
    });
}
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/news', newsRouter);
app.use('/contact', contactRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/signout', signoutRouter);
app.use('/u', userRouter);

app.use(error404Router); //make sure to put this after all routes

app.listen(process.env.PORT || 3000);