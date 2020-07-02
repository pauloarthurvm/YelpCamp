var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var flash = require("connect-flash")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var methodOverride = require("method-override")
var Campground = require("./models/campground.js")
var Comment = require("./models/comment.js")
var User = require("./models/user.js")
var seedDB = require("./seeds.js")
var app = express()

// Requiring Routes
var commentRoutes = require("./routes/comments.js")
var campgroundRoutes = require("./routes/campgrounds.js")
var indexRoutes = require("./routes/index.js")

// Exports a variable used as Environment Variable => DATABASE_URL that is set locally as "mongodb://localhost/yelp_camp"
// console.log(process.env.DATABASE_URL)
// mongoose.connect("mongodb://localhost/yelp_camp")    -- Deprecated
// mongodb+srv://yelpcampdb:<password>@cluster0.xfdzv.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.set("useUnifiedTopology", true)
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useFindAndModify: false
})
// var mongodb = "mongodb+srv://yelpcampdb:yelpcampdb@cluster0.xfdzv.mongodb.net/<dbname>?retryWrites=true&w=majority"
// mongoose.connect(mongodb, {
//     useNewUrlParser: true,
//     useFindAndModify: false
// }).then(() => {
//     console.log("Connected to Mongo Atlas!")
// }).catch(err =>{
//     console.log("Error: " + err.message)
// })

app.use(bodyParser.urlencoded({
    extended: true
}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

// seedDB()

// Passport Config
app.use(require("express-session")({
    secret: "Basic secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use(indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

// app.listen(3000, function () {
//     console.log("YelpCamp Server is up!")
//     console.log("")
// })
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("YelpCamp Server is up!")
    console.log("")
})