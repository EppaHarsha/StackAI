const express = require("express");
const cors=require("cors");
const mongoose = require("mongoose")
const chatRoutes = require("./routes/chat.js")
require("dotenv").config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/api",chatRoutes)
app.get("/test",(req,res)=>{
    res.send("hello");
})
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database is connected");
    }catch(err){
        console.log(err);
    }
}
app.listen(port,()=>{
    console.log("server is running on port ",port);
    connectDB();
})
