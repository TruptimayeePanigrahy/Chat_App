const {usermodel}=require("../models/usermodel")
const jwt=require("jsonwebtoken")
const express=require("express")
const bcrypt=require("bcrypt")
const userRoute=express.Router()


userRoute.post("/register",async(req,res)=>{
    try {
        const {name,email,password}=req.body
        const userfound=await usermodel.findone({email})
        if(userfound){
            res.send("User Already Present Please Login")
        }
const hashpassword=bcrypt.hashsync(password,5)


    } catch (error) {
        console.log(error)
    }
})

userRoute.post("/login",async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error)
    }
})

userRoute.get("/logout",async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error)
    }
})













module.exports={userRoute}