var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    flash         = require("connect-flash"),
    sessionSecret = require('./sessionSecret'),
    moment        = require('moment');
    
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comments"),
    indexRoutes       = require("./routes/index");
    
// SETTINGS
// DATABASEURL was set as an environment variable to local mongdb using the export <varname>=value command
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, {useMongoClient: true });
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
// seedsDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This will be called before every route and is a middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.moment = moment;
    next();
});


app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT, function(){
    console.log("YelpCamp Server Started on Port " + process.env.PORT);
});