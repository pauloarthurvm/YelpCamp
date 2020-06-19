var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground = require("./models/campground.js")
var Comment = require("./models/comment.js")
var User = require("./models/user.js")
var app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

// mongoose.connect("mongodb://localhost/yelp_camp")    -- Deprecated
mongoose.set("useUnifiedTopology", true)
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true})

// Campground.create({
//     name: "Granite Hill",
//     image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg",
//     description: "This is a huge Granite Hill, no baths, no water. Bealtiful granite!"
// }, function(err, campground){
//     if(err){
//         console.log("Error: " + err)
//     }
//     else{
//         console.log("New campground:")
//         console.log(campground)
//     }
// })

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
//     {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424_1280.jpg"}
// ]

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
            res.render("index", {campgrounds: allCampgrounds})
        }
    })
})

// NEW - Show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs")
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
    var campgroundId = req.params.id
    Campground.findById(campgroundId, function(err, foundCampground){
        if(err){
            console.log("Error: " + err)
        }
        else{
            res.render("show", {campground: foundCampground})
        }
    })
})

app.listen(3000, function () {
    console.log("YelpCamp Server is up!")
})