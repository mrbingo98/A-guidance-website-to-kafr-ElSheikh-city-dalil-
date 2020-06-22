const e = require('express');
const { use } = require('passport');

require('dotenv').config()
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    path = require('path'),
    //--------------requireng Routes--------------//
    trainRoute = require('./routes/trains'),
    restaurantRoute = require('./routes/restaurants'),
    restComments = require('./routes/restComments'),
    restPosts = require('./routes/restaurantPosts'),
    userRoute = require('./routes/user'),
    collegeRoute = require('./routes/colleges'),
    colPostRoute = require('./routes/collegePosts'),
    colDepartments = require('./routes/colDepartments'),
    colSchedule = require('./routes/colSchedule'),
    bodyParser = require('body-parser'),
    mo = require('method-override'),
    multer = require('multer'),
    bcrypt = require('bcrypt'),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    user = require('./models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    MongoStore = require('connect-mongo')(session),
    //-------------------multer storage and upload-------------//

    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function(req, file, cb) {
            cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname)
        }
    })
upload = multer({ storage: storage }),
    mongoConnectURL = process.env.mongoConnectURL;
//------------------- Mongo Connection-------------//
mongoose.connect(process.env.mongoConnectURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log("mongodb is connected");
}).catch((error) => {
    console.log("mondb not connected");
    console.log(error);
});
app.set('view engine', 'ejs')
    //-------------------app.use statements-----------------------//

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
    //------------------Using body-parser--------------------------//
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
    //---------------------Using method-override-----------------//
app.use(mo('_m'))

//-----------------session-------------------------//
app.use(cookieParser())
app.use(flash())
app.use(session({
    secret: 'French Fries',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 10 * 24 * 60 * 60,
        autoRemove: 'native'
    })
}));

//-------------------------Pasport Configration---------------------//
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ passReqToCallback: true }, async function(req, username, password, done) {
    user.findOne({ username: username } || { email: username }, async function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            console.log("user not found")
            return done(null, false, req.flash("error", "Incorrect username."));

        }
        if (await bcrypt.compare(password, user.password)) {
            if (!user.isVerified) return done(null, false, req.flash('error', 'Your account has not been verified. Check your email for our confirmation mail or click <form action="/resend/' + user._id + '" method="POST"><button type="submit" class="btn btn-outline-primary"> Resend</button></form> to resend it.'));
            else {
                console.log("login success")
                return done(null, user._id);
            }
        }
        console.log("login fail")
        return done(null, false, req.flash('error', 'Incorrect password.'));
    });
}))
passport.serializeUser(function(userID, done) {
    done(null, userID);
});

passport.deserializeUser(function(userID, done) {
    user.findById(userID, function(err, user) {
        done(err, user);
    });
});
//--------------------localaize variables--------------------//

app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.currentUser = req.user;
        next();
    } else {
        res.locals.currentUser = null
        next();
    }

})
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.error = req.flash('error') || null;
    res.locals.success = req.flash('success') || null;
    next();
})

//---------------------routes-------------------------//
app.get('/', (req, res) => {
    res.render('landingPage')
})
app.get('/contact', (req, res) => {
    res.render('contactUs')
})
app.get('/about', (req, res) => {
        res.render('about')
    })
    //------------------Using Routes---------------------------//
app.use('/trains', trainRoute)
app.use('/restaurants', restaurantRoute)
app.use('/restaurants', restComments)
app.use('/restaursnts', restPosts)
app.use('/colleges', colDepartments)
app.use('/colleges', colPostRoute)
app.use('/colleges', colSchedule)
app.use('/colleges', collegeRoute)
app.use(userRoute)
    //------------------port listening------------------------//
app.listen(process.env.PORT || 3000, () => {
    console.log('server started')
})