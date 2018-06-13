var mongoose = require("mongoose");
var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");
////=================
// COMENTS ROUTES
////==============
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("new_comment",{campground:campground});
        }
    });
    
});
router.post("/campgrounds/:id/comments", function(req,res){
//lookup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment 
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
});
// edit comments
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("edit_comments",{campground_id:req.params.id, comment:foundComment});
        }
    });
   
});

//comment update
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedComment){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/campgrounds/"+req.params.id);
       }
   });
});
//comment delete route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//middleware


module.exports=router;