const express = require("express")
const {UserModel} = require("../model/user.model")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const {BlacklistModel} = require("../model/blacklist.model")
const {auth} = require("../middleware/auth.middleware")
require("dotenv").config()

const userRoute = express.Router()

userRoute.post("/signup",async(req,res)=>{
    
    const {name,email,password} = req.body;

    try {
        const user = await UserModel.findOne({email})
        if(user) return res.status(400).send({"msg":"email is already there"})

        bcrypt.hash(password, 5,  async (err, hash) =>{
            const newuser = new UserModel({name,email,password:hash})
            await newuser.save()
            res.status(200).send({"msg":"register Success",newuser})
        });
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }

})

userRoute.post("/login",async(req,res)=>{
    const {email,password}= req.body
    try {
        const user = await UserModel.findOne({email})
         if(user){
            bcrypt.compare(password, user.password, (err, result)=> {
                if(result){
                    const accessToken = jwt.sign({userId:`${user._id}`,role:user.role},"name",{expiresIn:"600s"})
                    const refreshToken = jwt.sign({userId:`${user._id}`,role:user.role},"rename",{expiresIn:"1800s"})

                    res.cookie("accessToken", accessToken,{httpOnly:true});
                    res.cookie("refreshToken", refreshToken,{httpOnly:true})

                    res.status(200).send({"msg":"login Success" , accessToken,refreshToken})
                }
            });
         }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

userRoute.get("/logout",auth,async(req,res)=>{
  const {accessToken,refreshToken} = req.cookies

  try {
    const newaccestoken = new BlacklistModel({token:accessToken})
    const newrefreshtoken = new BlacklistModel({token:refreshToken})

    await newaccestoken.save()
    await newrefreshtoken.save()
  
     res.status(200).send({"msg":"logout Sucess", newaccestoken,newrefreshtoken})
  } catch (error) {
    res.status(400).send({"msg":error.message})
  }
})

module.exports={userRoute}