var express         = require("express")
var bodyParser      = require("body-parser")
var mongoose        = require("mongoose")
var passport        = require("passport")
var LocalStrategy   = require("passport-local")
var Campground      = require("./models/campground.js")
var Comment         = require("./models/comment.js")
var User            = require("./models/user.js")
var seedDB          = require("./seeds.js")
var app             = express()

// Requiring Routes
var commentRoutes   = require("./routes/comments.js")
var campgroundRoutes = require("./routes/campgrounds.js")
var indexRoutes     = require("./routes/index.js")

// mongoose.connect("mongodb://localhost/yelp_camp")    -- Deprecated
mongoose.set("useUnifiedTopology", true)
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})

app.use(indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(3000, function () {
    console.log("YelpCamp Server is up!")
    console.log("")
})