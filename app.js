const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');



// port
const PORT = process.env.PORT || 3000; 


// middlewares
app.use(express.urlencoded({ extended: true }));    

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