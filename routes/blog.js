const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");
const router = Router();

function isAuthenticated(req, res, next) {
  if (!req.user) {
    return res.redirect("/login"); 
  }
  next();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()} - ${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Add a home route to render the homepage
router.get("/", async (req, res) => {
  try {
    // You might want to fetch recent blogs or other data for the homepage
    const blogs = await Blog.find({}).populate("createdBy");
    return res.render("homepage", { user: req.user, blogs });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/add-new", (req, res) => {
  return res.render("addblog", { user: req.user });
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) return res.status(404).send("Blog not found");

    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

    return res.render("blog", { user: req.user, blog, comments });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

// Fix: isAuthenticated function is now defined before this route
router.post("/comment/:blogId", isAuthenticated, async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/", isAuthenticated, upload.single("coverImage"), async (req, res) => { 
  try {
    const { title, body } = req.body;
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: req.file ? `/uploads/${req.file.filename}` : "/uploads/default.png",
    });

    return res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;