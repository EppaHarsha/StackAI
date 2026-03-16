const express = require("express");
const Thread = require("../models/ThreadSchema");
const openAiResponse = require("../utils/openai");
const router = express.Router()

router.get("/thread",async(req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt:-1});
        res.json(threads)
   }catch(err){
        console.log(err)
        res.status(500).json({error:"Failed to fetch threads"});
    }
})

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error:"Thread not found"})
        }
        res.json(thread.messages)
   }catch(err){
        console.log(err)
        res.status(500).json({error:"Failed to fetch chat"});
    }
})
router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            res.status(404).json({error:"Thread  not  found"})
        }
        res.status(200).json({sucess:"thread deleted successfully"})
   }catch(err){
        console.log(err)
        res.status(500).json({error:"Failed to Delete thread"});
    }
})
router.post("/chat",async(req,res)=>{
    const {threadId,message} = req.body
    if(!threadId || !message){
        return res.status(404).json({error:"missing required fields"})
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
             thread = new Thread({
                threadId,
                title:message,
                messages:[{role:"user",content:message}]
            })
        }else{
            thread.messages.push({role:"user",content:message})
        }
        const assistant = await openAiResponse(message);
        thread.messages.push({role:"assistant",content:assistant})
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply:assistant});  
   }catch(err){
        console.log(err)
        res.status(500).json({error:"something went wrong"});
    }
})

module.exports = router