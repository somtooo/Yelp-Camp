var mongoose=require("mongoose");
var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");

 // index route
 router.get("/campgrounds",function(req,res){
     //Get all campgrounds from the DB
     Campground.find({}, function(err,allCampgrounds){
         if(err){
             console.log(err);
         }else {
             res.render("campgrounds",{campgrounds:allCampgrounds});
         }
     });
     
        //res.render("campgrounds",{campgrounds:campgrounds});
 });
 // new route
 router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
     res.render("new.ejs");
 });
 // create-add new campground to DB ,route
 router.post("/campgrounds",function(req,res){
     //get data from form and add to campground array
     var name=req.body.name;
     var image=req.body.image ;
     var desc=req.body.description;
     var author={
         id: req.user._id,
         username: req.user.username
     }
     var newCampground={name:name,image:image,description:desc,author:author};
     // Create a new campground and save to DB
     Campground.create(newCampground,function(err,newlyCreated){
         if(err){
             console.log(err);
         }else
          // re direct bck to camp ground page
     res.redirect("/campgrounds");
     });
    
 });
 //SHOW.shows more info about one campground
 router.get("/campgrounds/:id", function(req,res){
     //find the campground with provided ID then render
     Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
         if(err){
             console.log(err);
         }else {
             console.log(foundCampground);
             //render show template with that campground
             res.render("show.ejs",{campground:foundCampground});
         } 
     });
 });
 //edit campground route
 router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("edit_campgrounds",{campground: foundCampground});
     });
 });
 //update campgroud route
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    });
    //redirect to the show page
});
//Destroy Campground Route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/campgrounds");
      }else{
          res.redirect("/campgrounds");
      }
  });
});
//middleware


 module.exports = router;