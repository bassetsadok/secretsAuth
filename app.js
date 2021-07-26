require('dotenv').config()
const express = require('express')
const bodyparser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')
const md5=require('md5')
const app= express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.static('public'));
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true})
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})


const User=new mongoose.model('User',userSchema);

app.get('/',(req,res)=>{
    res.render("home");
})
app.get('/login',(req,res)=>{
    res.render("login");
})
app.post('/login',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err)
        }else{
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result){
                    res.render("secrets");
                }
            });
            
                
            
        }
    })
})
app.get('/register',(req,res)=>{
    res.render("register");
})
app.post('/register',(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new User({
            email:req.body.username,
            password:hash
        })
        newUser.save((err)=>{
            if(!err){
                res.render('secrets')
            }else{
                res.render(err);    
            }
        })
    });
    
})

app.listen(3000,()=>{
    console.log('port running on 3000')
})