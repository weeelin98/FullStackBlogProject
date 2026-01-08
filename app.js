require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // 导入 connect-mongo
const passportConfig = require("./config/passport");
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const errorHandler = require("./middlewares/errorHandler");
// const e = require('express');

// 端口设置
const PORT = process.env.PORT || 3000; 

// 中间件：解析表单数据
app.use(express.urlencoded({ extended: true }));

// Session 中间件
// 修复点：使用防御性写法，确保无论 connect-mongo 如何导出都能找到 create 方法
app.use(
    session({
        secret: "Keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: (MongoStore.create ? MongoStore : MongoStore.default).create({
            mongoUrl: process.env.MONGODB_URL
        }),
    })
);

// Passport 初始化
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// 设置 EJS 模板引擎
app.set("view engine", "ejs");

// --- 路由设置 ---

// 1. 根路径重定向：不需要 home.ejs，直接重定向到登录页
app.get("/", (req, res) => {
    res.render("home", {
        user: req.user,
        error: "",
        title:"home"
    });
});

// 2. 挂载认证路由
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);


//error handler
app.use(errorHandler);


//testing 
app.use((err, req, res, next) => {
    console.log("====================================");
    console.log(" 捕获到中间件报错 (Middleware Error):");
    // 使用 JSON.stringify 展开错误对象
    console.log(JSON.stringify(err, null, 2)); 
    
    // 如果错误是 Multer 抛出的，可能包含 code 字段
    if (err.message) console.log("报错信息:", err.message);
    console.log("====================================");

    // 防止页面一直转圈，给前端返回一个错误页
    res.render("newPost", {
        title: "Create Post",
        error: "Upload Failed: " + (err.message || "Unknown Error"),
        user: req.user || null
    });
});

// --- 数据库连接与服务器启动 ---

mongoose
.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Connected to MongoDB successfully!");
    console.log("Database name:", mongoose.connection.db.databaseName); 
    
    // 只在这里启动一次服务器监听，防止端口冲突错误
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("Database connection failed:", err.message);
});

// ❌ 已经删除了原本代码最后一行多余且会导致报错的 app.listen(PORT)
