var express = require("express")
var router = express.Router({
    mergeParams: true
})
var Campground = require("../models/campground.js")
var Comment = require("../models/comment.js")
var middleware = require("../middleware")   //index.js is a special name file - always required when inside a folder if not explicity

// Comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("Error: " + err)
        } else {
            res.render("comments/new.ejs", {
                campground: campground
            })
        }
    })
})

// Comments Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("Error: " + err)
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong.")
                    console.log("Error: " + err)
                } else {
                    // Add username and if
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // Save
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// Comments Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log("Error: " + err)
            res.redirect("back")
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment
            })
        }
    })
})

// Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log("Error: " + err)
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// Comment DESTROY Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            console.log("Error: " + err)
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted.")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

module.exports = router