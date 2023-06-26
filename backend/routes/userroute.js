const {usermodel}=require("../models/usermodel")
const jwt=require("jsonwebtoken")
const express=require("express")
const bcrypt=require("bcrypt")
const userRoute=express.Router()
require("dotenv").config()
const {client}=require("../config/redis")
const {blackmodel}=require("../models/blaclkistmodel")

userRoute.post("/register",async(req,res)=>{
    try {
        const {name,email,password}=req.body
        const userfound=await usermodel.findone({email})
        if(userfound){
            res.send("User Already Present Please Login")
        }
const hashpassword=bcrypt.hashSync(password,5)
const newuser=new usermodel({name,email,password:hashpassword})
const saveuser=await newuser.save()
console.log(saveuser)
verificationmail(name,email,saveuser._id)
res.status(200).send({msg:"User registration Successfull,verify your mail"})

    } catch (error) {
        console.log(error)
        res.status(400).send({"msg":"Registration failed!!"})
    }
})

userRoute.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body
        let user=await usermodel.findOne({email})

        if(!user){
            return res.status(400).send({"msg":"User not found please register"})
        }

        if(user.emailverify==false){
            return res.status(400).send({"msg":"Please verify your mail"})
        }

        let decrypt=await bcrypt.compare(password,user.password)
        console.log(decrypt)
        
        if(!decrypt){
            return res.status(400).send({"msg":"Your password is incorrect"})
        }

        let token=jwt.sign({id:user._id,verified:user.emailverify},process.env.secretkey,{expiresIn:"6hr"})
        let refreshtoken=jwt.sign({id:user._id,verified:user.emailverify},process.env.refrshsecretkey,{expiresIn:"1d"})

        client.set('token', token, 'EX', 21600);
        client.set('refreshtoken', refreshtoken, 'EX', 86400);
    } catch (error) {
        console.log(error)
        res.status(400).send({"msg":"Login failed!!"})
    }
})

userRoute.get("/logout",async(req,res)=>{
    try {
        let usertoken = await client.get('token');

        let userrefreshtoken = await client.get('refreshtoken');

        let blacklisttoken= new blackmodel( { token : usertoken } );
        let blacklistrefreshtoken = new blackmodel( { refreshtoken : userrefreshtoken } );

        await blacklisttoken.save();
        await blacklistrefreshtoken.save();
        res.send({"msg":"Logout successfull!!"})
    } catch (error) {
        console.log(error)
        res.status(400).send({"msg":"Logout failed!!"})
    }
})

let verificationmail=async(name,email,userid)=>{
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'panigrahydeepakkumar27@gmail.com',
                pass: process.env.googlepassword
            }
        });

        let mailOptions = {
            from: 'panigrahydeepakkumar27@gmail.com',
            to: email,
            subject: 'For verification mail',
            html:`<p>Hi ${name} <br> please click here to <a href="http://localhost:3300/user/verify?id=${userid}">verify</a>  your mail. </p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                
            } else {
                console.log('Email sent: ' + info.response);
               
            }
        });
    } catch (error) {
        console.log(error)
    }

}
userRoute.get("/verify",async(req,res)=>{
    try {
        let {id}=req.query
        let userverify=await usermodel.findOne({_id:id})

        if(!userverify){
            return res.status(400).send({"msg":"Not a valid email"})
        }

        userverify.emailverify=true
        await userverify.save()
        res.status(200).send({"msg":"mail verification successfull"})

    } catch (error) {
        console.log(error)
    }
})











module.exports={userRoute}