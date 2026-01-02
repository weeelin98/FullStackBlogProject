const e = require('express');
const mongoose = require('mongoose');

//schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        

    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    // image:[{
    //    url:{
    //     type: String,
    //     required: true
    //    },
    //    Public_id: {
    //     type: String,
    //     required: true
    //    },    
    // }],
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
 
},{
       timestamps: true,
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;