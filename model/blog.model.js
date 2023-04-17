const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    name:String,
    title:String,
    desc:String,
    userId:{type : mongoose.Schema.Types.ObjectId , ref : "user"}
})

const BlogModel = mongoose.model("blog",blogSchema)

module.exports={BlogModel}