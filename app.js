const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// port
const PORT = process.env.PORT || 3000; 

// middlewares
app.use(express.urlencoded({ extended: true }));    

//EJS
app.set("view engine", "ejs");

//routes
//Render login page
app.get("/auth/login", (req, res) => {
    res.render("login.ejs");
});
//Render register page
app.get("/auth/register", (req, res) => {
    res.render("register.ejs");
});


//Main logic for user registration
app.post("/auth/register", async(req, res) => {
const { username, email, password } = req.body;
console.log("Received data:", { username, email, password });
try{
    //check if user already exists
    const user = await User.findOne({email});
    console.log("Checking if user exists:", user);
    if(user){
       res.send("User already exists");
    }else{
        //create new user
        const newUser = new User({
            username,
            email,
            password
        });
        await newUser.save();
        console.log("User saved successfully:", newUser);
        //redirect to login page
        res.redirect("/auth/login");
    }
    // res.send("registering user");
    }catch(error){
        res.send(error);
        console.error("Registration error:", error);
    } 
});

// 添加在注册路由之后（第52行之后）
// 临时测试路由 - 查看所有用户
app.get("/test/users", async (req, res) => {
    try {
        const users = await User.find({});
        console.log("All users in database:", users);
        res.json({ count: users.length, users: users });
    } catch (error) {
        res.json({ error: error.message });
    }
});
//start server

mongoose
.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Connected to MongoDB");
    console.log("Database name:", mongoose.connection.db.databaseName); // Log the database name
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(()=>{
    console.error("Failed to connect to MongoDB");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});