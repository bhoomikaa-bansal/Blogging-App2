const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/home", (req, res) => {
    return res.render("home", { blogs });
});



router.post("/signin" , async(req, res) => {
    const { email , password} = req.body;
    //and signin k liye hum email and password check krege hmaare database m
    //if that particular email and password exists , then we are giving him excess to the application
    //As , we are hashing the password , so , phle hme user ko uss particular email se find krna hoga .. then uss particular email k particular salt se User ka daala hua password dubara hash krna pdega
    //then we are going to compare the new hashed password and the old one stored hashed password
    //And , this can be achieved by making Mongoose Virtual Functions ..
    //and we can make a function for a particular Schema ..
    try{
        const token = await User.matchPasswordAndGenerateToken(email,password);

        return res.cookie("token" , token).redirect("/");
    } catch(error){
        return res.render("signin" , { error : "Incorrect Email or Password" });
    }
})

router.post("/signup" , async (req,res) => {
    const { fullName , email , password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    })
    return res.redirect("/");
});

router.get("/logout" , (req,res) => {
    res.clearCookie("token");
    return res.redirect("/");
})

module.exports = router;