if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const newsRouter = require('./routes/news');
const contactRouter = require('./routes/contact');
const error404Router = require('./routes/error404');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public')); //where most server files will be
// app.use(express.urlencoded({limit: '10mb', extended: false}));

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/news', newsRouter);
app.use('/contact', contactRouter);

app.use(error404Router); //make sure to put this after all routes

app.listen(process.env.PORT || 3000);