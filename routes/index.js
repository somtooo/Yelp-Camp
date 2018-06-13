var mongoose=require("mongoose");
var express=require("express");
var router=express.Router();
var passport=require("passport");
var User = require("../models/user");

//=====
//aUTH ROUTES

router.get("/register",function(req,res){
    res.render("register");
});
// hadnle sign up logic
router.post("/register",function(req,res){
   var newUser= new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login  form
router.get("/login", function(req,res){
    res.render("login");
});
// handling login lgic
// app.ost("/login",middleware,callback);
router.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",failureRedirect:"/login"}),
    function(req,res){

});
// logout route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;