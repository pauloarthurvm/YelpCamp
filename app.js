var express = require("express")
var bodyParser = require("body-parser")
var app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

var campgrounds = [
    {name: "Salmon Creek", img: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
    {name: "Granite Hill", img: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
    {name: "Mountain Goat's Rest", img: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424_1280.jpg"},
    {name: "Salmon Creek", img: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
    {name: "Granite Hill", img: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
    {name: "Mountain Goat's Rest", img: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424_1280.jpg"},
    {name: "Salmon Creek", img: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
    {name: "Granite Hill", img: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
    {name: "Mountain Goat's Rest", img: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424_1280.jpg"},
    {name: "Salmon Creek", img: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg"},
    {name: "Granite Hill", img: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
    {name: "Mountain Goat's Rest", img: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424_1280.jpg"}
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