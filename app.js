var express=require("express"),
 app=express(),
 flash=require("connect-flash"),
 bodyParser=require("body-parser"),
 mongoose = require("mongoose"),
 Campground=require("./models/campground"),
  Comment=require("./models/comment"),
//   seedDB= require("./seeds"),
  passport=require("passport"),
  LocalStrategy=require("passport-local"),
  User = require("./models/user"),
  methodOverride= require("method-override"),
  passportLocalMongoose=require("passport-local")

  var commentRoutes = require("./routes/comments"),
      campgroundRoutes= require("./routes/campgrounds"),
      indexRoutes    = require("./routes/index")


mongoose.connect("mongodb://localhost/yelp_camp_Final");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());

 //seedDB();
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Once again fuck rusty!!",
    resave:false,
    saveUninitialized:false
}));
// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// to show and hide current user 
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
//==
// routes
//==
app.get("/",function(req,res){
    res.render("landing"); 
 });

app.listen(3000,function(){
    console.log("The YelpCamp Server Has Started!");
});
