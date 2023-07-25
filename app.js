import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
// import md5 from "md5";
import bodyParser from "body-parser";
import ejs from "ejs";
// import bcrypt from "bcrypt";
// const saltRounds = 10;
// import encrypt from "mongoose-encryption";
import session from "express-session";
import passport from 'passport';
import passportLocalMongoose from "passport-local-mongoose";
import { log } from 'console';



const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;
app.use(express.static("public"));

app.use(session({
    secret: "Our Secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
//userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})


app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
});

app.get("/logout",(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

app.post("/register",(req,res)=>{

    User.register({username: req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })





////////////////////////////////////////////////////////////////////    
    // bcrypt.hash(req.body.password,saltRounds).then((hash)=>{
    //     const newUser = new User({
    //         email: req.body.username,
    //         password: hash
    //     })
    //     newUser.save().then(()=>{
    //         res.render("secrets");
    //     }).catch((err)=>{
    //         console.log(err);
    //     });
    // }).catch((err)=>{
    //     console.log(err);
    // });
    
    
})

app.post("/login",(req,res)=>{

    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(newUser,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })


  //////////////////////////////////////////////////////////////////////// 
    // const username = req.body.username;
    // const password1 =req.body.password;
    // User.findOne({email: username}).then((foundUser)=>{
    //     if(foundUser){
    //         bcrypt.compare(password1, foundUser.password).then((result)=> {
    //             if(result === true){
    //                 res.render("secrets");
    //             }
    //         }).catch((err)=>{
    //             console.log(err);
    //         });
    //     }              
       
    // }).catch((err)=>{
    //     console.log(err);
    // });
})

app.listen(port,()=>{
    console.log(`Server Started at ${port}`);
});
