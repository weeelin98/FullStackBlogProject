require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
// [app.js] 第 6 行修改为：
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const session = require("express-session");
const User = require("./models/User");
const passportConfig = require("./config/passport");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errorHandler");
const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

//port
const PORT = process.env.PORT || 3000;
//middlewares: passing form data
app.use(express.urlencoded({ extended: true }));

//session middleware
// [app.js]
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // 💡 修改这里：增加一个逻辑判断，确保能抓到 .create 函数
    store: (MongoStore.create 
      ? MongoStore.create({ mongoUrl: process.env.MONGODB_URL }) 
      : MongoStore.default.create({ mongoUrl: process.env.MONGODB_URL })),
  })
);
// Method override middleware
app.use(methodOverride("_method"));
//passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
//EJS
app.set("view engine", "ejs");
//Home route
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
    error: "",
    title: "Home",
  });
});
//routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/user", userRoutes);

//error handler
app.use(errorHandler);
//start server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Database connection failed");
  });
