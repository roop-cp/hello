//jshint esversion:6
require('dotenv').config();
const express = require("express");

const app = express();

const ejs = require("ejs");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
const mongoose = require("mongoose")

app.set("view engine", "ejs");
const encrypt = require('mongoose-encryption');
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1/user-DB", {useNewUrlParser:true});

app.use(express.static("public"));
console.log(process.env.API_KEY);

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);

app.get("/", (req,res)=>{
    res.render("home");
});
app.get("/register", (req,res)=>{
    res.render("register");
});
app.get("/login", (req,res)=>{
    res.render("login");
});
app.get("/logout",(req,res)=>{
  res.render("home");
});
app.get("/submit",(req,res)=>{
  res.render("submit");
});
app.post("/register", (req,res)=>{
  const newUser = new User({
    email: req.body.username,
    password:req.body.password
  });
  newUser.save((err)=>{
    if(err){
      res.send(err);
    }else{
      res.redirect("/");
    }
  });
});

app.post("/login", (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, (err,foundUser)=>{
    if(err){
      res.send(err);
    }else{
      if(foundUser.password === password){
        if(!err){
          res.render("secrets");
        }else{
          res.send("Your password not matching");
        }
      }
    }
  });

});




app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});
