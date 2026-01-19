// [routes/postRoutes.js]
const express = require("express");
const { 
    getPostForm, 
    createPost, 
    getPosts, 
    getPostById, 
    getEditPostForm, 
    updatePost, 
    deletePost 
} = require("../controllers/postController");

const { ensureAuthenticated } = require("../middlewares/auth");

// 💡 修复点：路径必须指向 config 文件夹
const upload = require("../config/multer"); 

const postRoutes = express.Router();

postRoutes.get("/add", getPostForm);

// 使用中间件处理上传
postRoutes.post("/add", ensureAuthenticated, upload.array("images", 5), createPost); 

// get all posts
postRoutes.get("/", getPosts);

module.exports = postRoutes;