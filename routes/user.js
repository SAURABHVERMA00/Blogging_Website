const {Router} = require('express');
const router=Router();
const {User}=require("../models/user")
const mongoose=require("mongoose")  




router.get("/signin",(req,res)=>{
    return res.render("signin")
})
router.get("/signup",(req,res)=>{
   
    return res.render("signup")
})

router.post("/signup",async (req,res)=>{
    
    const {fullName,email,password}=req.body;

    const user=await User.findOne({email});
    if(user){
        return res.redirect("User already exists")
    }

    const newUser=new User({
        fullName,
        email,
        password
    })
    await newUser.save();

    
    return res.redirect("/")
})



router.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    try{
        const token=await User.matchPasswordAndGenerateToken(email,password)  
        return res.cookie("token",token).redirect("/");
    }catch{
        res.render("signin",{error:"Invalid email or password"});
    }
    
})


router.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.redirect("/");
})

module.exports = router;