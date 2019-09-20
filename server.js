if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('Check Sticky Notes/Trello For Todo');
}
//necessities
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

//functions
const formatDistanceToNow = require('date-fns/formatDistanceToNow')

//routes
const globalChecks = require('./routes/globalChecks')
const indexRouter = require('./routes/index');
const settingsRouter = require('./routes/settings');
const aboutRouter = require('./routes/about');
const newsRouter = require('./routes/news');
const contactRouter = require('./routes/contact');
const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');
const signoutRouter = require('./routes/signout');
const secretRouter = require('./routes/secret');
const userRouter = require('./routes/user');
const apiRouter = require('./routes/api');
const error404Router = require('./routes/error404');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.set("layout extractMetas", true);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.json());
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

app.use(globalChecks);
app.use('/', indexRouter);
app.use('/settings', settingsRouter);
app.use('/about', aboutRouter);
app.use('/news', newsRouter);
app.use('/contact', contactRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/signout', signoutRouter);
app.use('/secret', secretRouter);
app.use('/u', userRouter);
app.use('/api', apiRouter);

app.use(error404Router); //make sure to put this after all routes

//global views functions
app.locals.formatDistanceToNow = function(date, old) {
    const considerOnline = ["less than a minute ago", "1 minute ago", "2 minutes ago"];
    if(!date) {
        return 'never';
    }
    let lastSeen = `${formatDistanceToNow(date)} ago`;
    if(considerOnline.includes(lastSeen) && !old) lastSeen = "Online";
    return lastSeen;
}
app.locals.stringify = function(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            if(obj[p] != '')
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}
app.locals.isAdmin = function(username) {
    return username.toLowerCase() === process.env.ADMIN_NAME;
}
app.locals.extractAttribute = function (obj, attr){
    const out = [];
  
    for (const i in obj){
        out.push(obj[i][attr]);
    }
  
    return out;
}
app.listen(process.env.PORT || 3000);