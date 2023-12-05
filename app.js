if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
const express = require('express')
const app = express();
const path = require("path");
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./Schemas.js');
const Campground  = require('./models/campground');
const {transcode}  = require('buffer');
const joi = require('joi');
const Review = require('./models/review.js')
const session = require('express-session')
const methodOverride = require('method-override')
const campground = require('./models/campground');
const campgroundsroutes = require('./routes/campgrounds')
const reviewsroutes = require('./routes/review')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userroutes = require('./routes/user')
const dbUrl = process.env.DB_URL
const MongoDBStore = require("connect-mongo")(session)

//for mongoose connection 
mongoose.connect("mongodb://127.0.0.1:27017/app")

.then(()=>{
    console.log('mongoose connected!!')
})
.catch(err =>{
    console.log('mongoose shown error')
    console.log(err)
});

//opening and sending data in mongoose
const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once("open", ()=>{
    console.log("Database connected ")
})

app.engine('ejs',ejsMate );
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname,'public')))

const store = new MongoDBStore({
    url: 'mongodb://127.0.0.1:27017/app',
    secret: 'dfdjnsd',
    touchAfter: 24*60 * 60
})

store.on("error", function(e){
    Console.log("session store error",e)
})

const sessionConfig  = {
       store,
       secret: 'himommissyou',
       resave: false,
       saveUninitialized: true,
       cookie: {
        httpOnly: true,
         date: Date.now() + 1000 * 60 *60 *24 *7 ,
         maxAge: 1000 * 60 *60 *24 *7
       }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate( )))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('error')
    res.locals.success = req.flash('success');
    next();   
})

app.use('/',userroutes)
app.use('/campgrounds', campgroundsroutes)
app.use('/campgrounds/:id/reviews', reviewsroutes)
//basic home page
app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, ()=>{
    console.log('app is listening to me on port 3000 !!!!!')
})