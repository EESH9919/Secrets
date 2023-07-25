import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import ejs from "ejs";
import encrypt from "mongoose-encryption";



const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;
app.use(express.static("public"));


mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})


app.post("/register",(req,res)=>{

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save().then(()=>{
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    });
})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password1 = req.body.password;
    User.findOne({email: username}).then((foundUser)=>{
        if(foundUser){
            if(foundUser.password === password1){
                res.render("secrets");
            }
            else{
                res.render("login");
            }
        }
            
       
    }).catch((err)=>{
        console.log(err);
    });
})

app.listen(port,()=>{
    console.log(`Server Started at ${port}`);
});
