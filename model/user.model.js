const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    role:{type:String , default:"user"},
    password:String,
    blogs:[{type:mongoose.Schema.Types.ObjectId  , ref:"blog"}]
})

const UserModel = mongoose.model("user",userSchema)

module.exports={UserModel}