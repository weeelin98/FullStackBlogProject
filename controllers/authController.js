
const User = require("../models/User");
const bcrypt = require("bcryptjs");


//Render login page
exports.getLogin = (req, res) => {
    res.render("login.ejs"); 
}


//Render login page
exports.login = async (req, res) => {
    const { email, password } = req.body; 
    try {
        //find user 
        const user = await User.findOne({email});
        const isMatch = await User.findOne({password});

        if(user && isMatch){
            res.send("Login successful");
        }else{
            res.send("Invalid credentials");
        }   
    } catch (error) {
        res.send(error);
    }

}



//Get register page
exports.getRegister = (req, res) => {
    res.render("register",{error: null});
   
}


//Register logic
exports.register = async(req, res) => {
    const { username, email, password } = req.body;
    console.log("Received data:", { username, email, password });
    try{
        
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return  res.render('register', {
            title: 'Register',
            user: req.username,
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
            user: req.username,
            error: error.message,
        });
    } 
}