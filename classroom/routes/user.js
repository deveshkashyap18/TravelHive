const express = require("express");
const router = express.Router(); // Here, router is an object

//Index - Users
router.get("/",(req,res)=>{
    res.send("GET for users")
})

//Show - Users
router.get("/:id",(req,res)=>{
    res.send("GET for user id")
})

//POST - Users
router.post("/:id",(req,res)=>{
    res.send("POST for usres")
})

//DELETE - Users
router.delete("/:id",(req,res)=>{
    res.send("Delete for usres id")
})

module.exports = router;
