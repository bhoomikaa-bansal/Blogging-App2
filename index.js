const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const User = require("./models/user");  // Ensure User model is imported correctly
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");  // Ensure Blog model is imported correctly
const checkForAuthenticationCookie = require("./middlewares/authentication");

const app = express();
const PORT = 8001;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));  // Resolve views directory properly

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Used for form handling
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));  // Ensure authentication middleware is used
app.use(express.static(path.resolve("./public")));  // Serve static files from public folder

// MongoDB Connection with Error Handling
mongoose.connect("mongodb://localhost:27017/blogify")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);  // Exit process if DB connection fails
    });

// Home Route
app.get("/", async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        res.render("home", {
            user: req.user || null,  // Ensure req.user is set correctly
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
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
