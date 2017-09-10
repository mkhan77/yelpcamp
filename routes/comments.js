var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
});


router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           console.log(err);
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if (err){
                   console.log(err);
               } else {
                //   add username and id to comment and save comment before pushin the comment object in campground
                // req.user.username
                   comment.author.id = req.user.id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success", "Comment successfully created!");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       } 
    });
});

// comment update form route
router.get("/:commentid/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentid, function(err, comment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id:req.params.id, comment:comment});
        }
    });
});

// comment update method route
router.put("/:commentid", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }        
    });
    
});

// DELETE ROUTE
router.delete("/:commentid", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentid, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("Comment Deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
});


module.exports = router;