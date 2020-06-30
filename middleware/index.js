//Exports middlware functions
var middlewareObj = {}
var Campground = require("../models/campground.js")
var Comment = require("../models/comment.js")

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found.")
                res.redirect("back")
            } else {
                // User own camp?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You do not own this campground.")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in.")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You do not have permission to do that.")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in.")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash("error", "You need to be logged in.")
        res.redirect("/login")
    }
}

module.exports = middlewareObj