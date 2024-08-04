require('dotenv').config()

const path=require("path")
const express=require("express")
const app=express()
const PORT=process.env.PORT ;
const mongoose=require("mongoose")
const bodyParser = require('body-parser');


const userRoute=require("./routes/user")
const blogRoute=require("./routes/blog")
const {Blog}=require("./models/blog")

var cookieParser = require('cookie-parser');
const { checkForAuthenticationUser } = require("./middleware/auth");

// 'mongodb+srv://saurabh2271be22:3GXTWJUgoP6PFPCv@cluster0.hs9twnu.mongodb.net/Blogging'
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to database");
}).
catch((err)=>{
    console.log("Error connecting to database",err);
})

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))


app.use(express.static(path.resolve("./public")))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(checkForAuthenticationUser("token"))



app.get("/",async(req,res)=>{
    const allblog=await Blog.find({})
    const user=req.user;
    // console.log(user);
    res.render("home",{
        user:req.user,
        blogs:allblog
    })
})
app.use("/user",userRoute);
app.use("/blog",blogRoute);





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})