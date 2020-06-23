var mongoose = require("mongoose")
var Campground = require("./models/campground.js")
var Comment = require("./models/comment.js")

var data = [
    {
        name: "Cloud's rest", 
        image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id cursus tortor. Nam elit ligula, auctor et turpis at, dapibus fringilla odio. In bibendum, libero convallis viverra aliquet, est metus consectetur justo, vitae efficitur ante enim sit amet augue. In felis dui, ultricies at mollis eget, vestibulum aliquet purus. Proin mattis nunc lorem, sed tincidunt tellus faucibus a. Pellentesque sed ex a velit dictum mattis ut quis nisi."
    },
    {
        name: "Granite Hill", 
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id cursus tortor. Nam elit ligula, auctor et turpis at, dapibus fringilla odio. In bibendum, libero convallis viverra aliquet, est metus consectetur justo, vitae efficitur ante enim sit amet augue. In felis dui, ultricies at mollis eget, vestibulum aliquet purus. Proin mattis nunc lorem, sed tincidunt tellus faucibus a. Pellentesque sed ex a velit dictum mattis ut quis nisi."
    },
    {
        name: "Mountain Goat's Rest", 
        image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424_1280.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id cursus tortor. Nam elit ligula, auctor et turpis at, dapibus fringilla odio. In bibendum, libero convallis viverra aliquet, est metus consectetur justo, vitae efficitur ante enim sit amet augue. In felis dui, ultricies at mollis eget, vestibulum aliquet purus. Proin mattis nunc lorem, sed tincidunt tellus faucibus a. Pellentesque sed ex a velit dictum mattis ut quis nisi."
    }
]

function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log("Error: " + err)
        }
        else{
            console.log("Removed Campgrounds!")

            // Add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log("Error: " + err)
                    }
                    else{
                        console.log("----------------Added a campground:")
                        // console.log(campground)
                        Comment.create({
                            text: "This place is great, but I wish there was Internet!",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log("Error: " + err)
                            }
                            else{
                                campground.comments.push(comment)
                                campground.save()
                                console.log("--------Created new comment!")
                                // console.log(comment)
                            }
                        })
                    }
                })
            })
        }
    })
}

module.exports = seedDB