const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// port
const PORT = process.env.PORT || 3000; 

//start server
mongoose
.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(()=>{
    console.error("Failed to connect to MongoDB");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});