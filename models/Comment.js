const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, { 
    timestamps: true // ✅ 正确：这是第二个参数，用于配置选项
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;