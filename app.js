//jshint esversion:6
require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');
const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDb",{useNewUrlParser: true , useUnifiedTopology: true });
const userSchema=new mongoose.Schema({
  email: String,
  password: String
});
const User=new mongoose.model("user",userSchema);
app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/register",function(req,res){
  const userName=req.body.username;
  const password=md5(req.body.password);

  const newUser=new User({
    email: userName,
    password: password
  });
  newUser.save(function(err){
    if(err)
    res.send(err);
    else
    res.render("secrets");
  });
});

app.post("/login",function(req,res){
  const userName=req.body.username;
  const password=md5(req.body.password);

  User.findOne({email: userName},function(err, foundUser){
if(err)
res.send(err);
else
{
  if(foundUser)
  {
    if(foundUser.password===password)
    res.render("secrets");
    else
    res.send("Wrong password");
  }
  else
  res.send("No such user found");
}
});
});






app.listen(3000,function(){
  console.log("Server started on port 3000");
})
