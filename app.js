var express = require("express")
var bodyParser = require("body-parser")
var app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

var campgrounds = [
    {name: "Salmon Creek", img: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507440742f7fdc9645c1_340.jpg"},
    {name: "Granite Hill", img: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507440742f7fdc9645c1_340.jpg"},
    {name: "Mountain Goat's Rest", img: "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e507440742f7fdc9645c1_340.jpg"}
]

app.get("/", function (req, res) {
    res.render("landing")
})

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", {campgrounds: campgrounds})
})

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs")
})

app.post("/campgrounds", function(req, res){
    var name = req.body.name
    var image = req.body.image
    var newCamp = {
        name: name,
        img: image
    }
    campgrounds.push(newCamp)
    res.redirect("/campgrounds")
})

app.listen(3000, function () {
    console.log("YelpCamp Server is up!")
})