
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


//Render login page
exports.getLogin = (req, res) => {
    res.render("login.ejs",{
        title: "Login",
        error: "",
        user: req.user,
    }); 
};


//Render login page
exports.login = async (req, res, next) => {
    passport.authenticate("local",(err,user,info)=>{
        if(err){
            return next(err);
        }
        if(!user){
            return res.render("login",{
                title: "Login",
                user: req.user,
                error: info.message,
            });
        }
        req.logIn(user, (err)=>{
            if(err){
                return next(err);
            }
            return res.redirect("/");
        })
    })(req,res,next);
};



//Get register page
// 建议修改 getRegister
exports.getRegister = (req, res) => {
    res.render("register", {
        title: "Register", 
        error: null,
        user: req.user || null 
    });
};


//Register logic
exports.register = async(req, res) => {
    const { username, email, password } = req.body;
    console.log("Received data:", { username, email, password });
    try{
        
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return  res.render('register', {
            title: 'Register',
            user: req.user,
            error: "User already exists",

        });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //save user
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    res.redirect("/auth/login");

    }catch(error){
       res.render('register', {
            title: 'Register',
            user: req.user,
            error: error.message,
        });
    } 
}

//Logout logic
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/auth/login");
    });
}