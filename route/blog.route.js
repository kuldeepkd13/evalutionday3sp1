const express = require("express")
const {BlogModel} = require("../model/blog.model")
const {UserModel} = require("../model/user.model")


const blogRoute = express.Router()


blogRoute.post("/add",async(req,res)=>{
    const payload = req.body
    try {
        const newblog = new BlogModel(payload)
        await newblog.save()
        const user = await UserModel.findById(payload.userId)
        if(user){
            user.blogs.push(newblog._id)
            await user.save()
        }
        res.status(200).send({"msg":"blog added",newblog})
       } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

blogRoute.get("/getblog",async(req,res)=>{
    try {
        const user = await UserModel.findOne({_id:req.body.userId}).populate("blogs")
        res.status(200).send({"msg":"All the blogs" , data: user.blogs})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

blogRoute.patch("/update/:id",async(req,res)=>{
    const id = req.params.id;
    const payload = req.body;
    try {
        const blog = await BlogModel.findByIdAndUpdate({_id:id},payload)
        res.status(200).send({"msg":"updated"})
    } catch (error) {
        res.status(400).send({"msg":error.message}) 
    }
})

blogRoute.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id;
    try {
        const blog = await BlogModel.findByIdAndDelete({_id:id})
        res.status(200).send({"msg":"deleted"})
    } catch (error) {
        res.status(400).send({"msg":error.message}) 
    }
})

module.exports={blogRoute}
