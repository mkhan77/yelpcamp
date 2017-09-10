var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                res.redirect("back");
            } else {
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "Permission Denied!");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to login to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated){
        Comment.findById(req.params.commentid, function(err, comment){
            if(err){
                res.redirect("back");
            } else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "Permission Denied!");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to login to do that!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

module.exports = middlewareObj;