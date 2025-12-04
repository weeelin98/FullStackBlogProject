const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passportConfig = require("./config/passport");
const User = require('./models/User');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require("connect-mongo");




// port
const PORT = process.env.PORT || 3000; 


// middlewares
app.use(express.urlencoded({ extended: true }));

//session middleware
app.use(
    session({
        secret:"Keyboard cat",
        resave: false,
        saveUninitialized: true,
        store:MongoStore.create({mongoUrl: process.env.MONGODB_URL}),
    })
);



//passport middleware
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

//EJS
app.set("view engine", "ejs");

//routes
app.use("/auth", authRoutes);

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