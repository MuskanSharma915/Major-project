const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup , login , logout } = require("../controllers/users.js");

router.get("/signup" , ( req , res ) => {
       res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(signup));


     router.get("/login" , ( req , res ) => {
       res.render("users/login.ejs");
});

router.post(
       "/login", saveRedirectUrl , 
       passport.authenticate("local", {
         failureRedirect: "/login",
         failureFlash: true,
       }),
       login ,
     );

router.get("/logout" , logout);



module.exports = router;