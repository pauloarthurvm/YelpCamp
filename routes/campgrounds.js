var express     = require("express")
var router      = express.Router()
var Campground  = require("../models/campground.js")

// INDEX - Show all campgrounds
router.get("/", function (req, res) {
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
router.get("/new", function (req, res) {
    res.render("campgrounds/new.ejs")
})

// CREATE - Add new campground to database
router.post("/", function(req, res){
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
router.get("/:id", function(req, res){
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

module.exports = router