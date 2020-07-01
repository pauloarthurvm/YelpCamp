var express = require("express")
var router = express.Router()
var Campground = require("../models/campground.js")
// const campground = require("../models/campground.js")
var middleware = require("../middleware")   //index.js is a special name file - always required when inside a folder if not explicity

// INDEX - Show all campgrounds
router.get("/", function (req, res) {
    // Get all Campgrounds from Database
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log("Error: " + err)
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            })
        }
    })
})

// NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs")
})

// CREATE - Add new campground to database
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name
    var price = req.body.price
    var image = req.body.image
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    }
    // Crate a new campground and save into DB
    Campground.create(newCamp, function (err, newlyCreatedCamp) {
        if (err) {
            console.log("Error: " + err)
        } else {
            res.redirect("/campgrounds")
        }
    })
})

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log("Error: " + err)
        } else {
            res.render("campgrounds/show", {
                campground: foundCampground
            })
        }
    })
})

// EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground
        })
    })
})

// UPDATE Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // Find and Update the correct Campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log("Error: " + err)
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
    // Redirect to show page
})

// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log("Error: " + err)
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router