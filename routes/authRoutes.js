
const express = require("express");
const User = require("../models/User");
// const{getLogin} = require("../controllers/authController");
const{
    getLogin,
    login,
    getRegister,
    register
} = require("../controllers/authController");
const userRoutes = express.Router();





//Render login page
userRoutes.get("/login", getLogin);

// Main logic for user login
userRoutes.post("/login", login);


//Render register page
userRoutes.get("/register", getRegister)


//Main logic for user registration
userRoutes.post("/register", register);

// 添加在注册路由之后（第52行之后）
// 临时测试路由 - 查看所有用户
userRoutes.get("/test/users", async (req, res) => {
    try {
        const users = await User.find({});
        console.log("All users in database:", users);
        res.json({ count: users.length, users: users });
    } catch (error) {
        res.json({ error: error.message });
    }
});


module.exports = userRoutes;