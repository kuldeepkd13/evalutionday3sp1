const express = require("express")
const {connection} = require("./db")
const {userRoute} = require("./route/user.route")
const {blogRoute} = require("./route/blog.route")
const cookieParser = require("cookie-parser")
const {auth} = require("./middleware/auth.middleware")
const app = express();
app.use(express.json())
app.use(cookieParser())
require("dotenv").config()

app.use("/user",userRoute)
app.use("/blog",blogRoute)
app.listen(process.env.Port,async()=>{
    try {
        await connection
        console.log("Connected to Mongoose")
    } catch (error) {
        console.log(error);
        console.log("Not Connected to Mongoose")
    }
    console.log(`server is running at ${process.env.Port}`);
})