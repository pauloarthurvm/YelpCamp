var express     = require("express")
var router      = express.Router({mergeParams: true})
var Campground  = require("../models/campground.js")
var Comment  = require("../models/comment.js")

// Comments new
router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("Error: " + err)
        }
        else{
            res.render("comments/new.ejs", {campground: campground})
        }
    })
})

// Comments Create
router.post("/", isLoggedIn, function(req, res){
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
                    // Add username and if
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // Save
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    console.log(comment)
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    else{
        res.redirect("/login")
    }
}

module.exports = router