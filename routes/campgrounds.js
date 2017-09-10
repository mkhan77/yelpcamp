var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// RESTFUL routing
// INDEX show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

// CREATE save or post campground to the database
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name, 
        image = req.body.image, 
        desc = req.body.description,
        price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, price:price, author: author};
    Campground.create(newCampground, function(err, campground){
        if (err){
            req.flash("error", "The new campground could not be save.");
            res.redirect("back");
        } else{
            req.flash("success", "Campground Successfully created!");
            res.redirect("/campgrounds");
        }
    });
});

// NEW Show the form for creating a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW: which will the show a specific campground with all the details
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            req.flash("error", "The campground could not be found.");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: campground}); 
        }
    });
});

// EDIT campground or show form to edit the campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                req.flash("error", "The campground data could not be found.");
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: campground});
            }
        });
});

// UPDATE campground, this will be a put request to update the campground in the database
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "The Campground was successfully updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash("success", "The Campground was successfully removed!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;