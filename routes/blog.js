const {Router} = require('express');
const router=Router();
const multer  = require('multer')
const path=require("path")
const mongoose=require("mongoose")
const {Blog}=require("../models/blog")
const {Comment}=require("../models/comment")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const filename=`${Date.now()}-${file.originalname}`
      cb(null, filename)
    }
  })
  
const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user:req.user, 
    });
})

router.post("/",upload.single('imageCover'),async (req,res)=>{
    const {title,body}=req.body;
    const blog=new Blog({
        title:title,
        description:body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,

    });

    await blog.save();
    return res.redirect(`/blog/${blog._id}`);   
})


router.get("/:id",async(req,res)=>{
  const blog =await Blog.findById(req.params.id).populate("createdBy");
  const comment=await Comment.find({blogId:req.params.id}).populate("createdBy")

  // console.log(comment)
  return res.render("blog",{
    user:req.user,
    blog:blog,
    comments:comment
  })
})


// commnet 

router.post("/comment/:blogId",async(req,res)=>{
  console.log(req.body.content)
  try {
    const comment = new Comment({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    await comment.save(); // Save the comment

    // console.log('Comment created:', comment); // Log the created comment

    return res.redirect(`/blog/${req.params.blogId}`);
} catch (error) {
    // console.error('Error creating comment:', error);
    return res.status(500).send('Internal Server Error');
}
})
module.exports = router;