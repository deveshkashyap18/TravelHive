const express = require("express");
const router = express.Router();

//Index 
router.get("/",(req,res)=>{
    res.send("GET for post")
})

//Show 
router.get("/:id",(req,res)=>{
    res.send("GET for post id")
})

//POST 
router.post("/:id",(req,res)=>{
    res.send("POST for posts")
})

//DELETE
router.delete("/:id",(req,res)=>{
    res.send("Delete for posts id")
})

module.exports = router;