var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var Campground = require("./models/campground.js")
var Comment = require("./models/comment.js")
var User = require("./models/user.js")
var seedDB = require("./seeds.js")
var app = express()

// mongoose.connect("mongodb://localhost/yelp_camp")    -- Deprecated
mongoose.set("useUnifiedTopology", true)
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

seedDB()

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

app.get("/", function (req, res) {
    res.render("landing")
})

// INDEX - Show all campgrounds
app.get("/campgrounds", function (req, res) {
    // Get all Campgrounds from Database
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Error: " + err)
        }
        else{
            console.log(allCampgrounds)
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
        }
    })
})

// NEW - Show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new.ejs")
})

// CREATE - Add new campground to database
app.post("/campgrounds", function(req, res){
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCamp = {
        name: name,
        image: image,
        description: desc
    }
    // Crate a new campground and save into DB
    Campground.create(newCamp, function(err, newlyCreatedCamp){
        if(err){
            console.log("Error: " + err)
        }
        else{
            res.redirect("/campgrounds")
        }
    })
})

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Error: " + err)
        }
        else{
            console.log(foundCampground)
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})


// ===================
//     COMMENTS ROUTES
// ===================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("Error: " + err)
        }
        else{
            res.render("comments/new.ejs", {campground: campground})
        }
    })
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("Error: " + err)
            res.redirect("/campgrounds")
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log("Error: " + err)
                }
                else{
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// =================
//      AUTH ROUTES
// =================

// Show register form
app.get("/register", function(req, res){
    res.render("register")
})

// Handle Sign up Logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("Error: " + err)
            return res.render("register")
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds")
            })
        }
    })
})

// Show Login Form
app.get("/login", function(req, res){
    res.render("login")
})

// Handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    res.send("Logic login goes here")
})

// Logout Route
app.get("/logout", function(req, res){
    req.logout()
    res.redirect("/campgrounds")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    else{
        res.redirect("/login")
    }
}

app.listen(3000, function () {
    console.log("YelpCamp Server is up!")
    console.log("")
})