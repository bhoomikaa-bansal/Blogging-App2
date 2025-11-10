const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");
const checkForAuthenticationCookie = require("./middlewares/authentication");
require("dotenv").config(); 

const app = express();
const PORT = 8001;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

mongoose
  .connect(process.env.ATLAS_URL)
  .then(() => console.log(" Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

// Home Route
app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user || null,
      blogs: allBlogs,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Start Server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);