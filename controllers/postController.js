const Post =require("../models/Post");
const File = require("../models/File");

//Rendering post form
exports.getPostForm = (req, res) => {
    res.render("newPost", {
        title: "Create Post",
        error: "",
        success: "",
        user: req.user,
    });
};

//creating new post logic
// [controllers/postController.js]

exports.createPost = async (req, res) => {
    // try {
        // console.log("--- 开始处理上传 ---");
        
        // // 💡 修改第 16 行：使用 JSON.stringify 强制展开对象
        // // 如果 req.files 是 [object Object]，这行能把它变成可读的 JSON 文字
        // console.log("终端查看上传的文件信息:", JSON.stringify(req.files, null, 2)); 

        const { title, content } = req.body;
        if(!req.files || req.files.length === 0){
            return res.render("newPost", {
                title: "Create Post",
                error: "Please upload at least one image.",
                user: req.user
            });
        }
        const images = await Promise.all(req.files.map(async (file) => {
           const newFile = new File({
                url: file.path,
                public_id: file.filename,
                uploaded_by: req.user._id,
           });
            await newFile.save();
            console.log(newFile);
           return {
            url: newFile.url,
            public_id: newFile.public_id,
           };
        }));
        //create post
        const newPost = new Post({
            title: title,
            content: content,
            author: req.user._id,
            image: images,
        });
        await newPost.save();
        console.log("New Post Created:", newPost);
        res.render("newPost", {
            title: "Create Post",
            user: req.user,
            success: "Post created successfully!",
            error: ""
        });

        
    //     let images = [];
    //     if (req.files && req.files.length > 0) {
    //         images = req.files.map(file => ({
    //             url: file.path,        // Cloudinary 的远程 URL
    //             public_id: file.filename // Cloudinary 的文件唯一 ID
    //         }));
    //         // 💡 这一行打印数组中的具体 URL
    //         console.log("成功解析 Cloudinary 返回的 URL:", images.map(img => img.url));
    //     } else {
    //         console.log("⚠️ 未检测到任何上传文件，请检查表单 input 名字是否正确。");
    //     }

    //     const savedPost = await Post.create({
    //         title: title,
    //         content: content,
    //         author: req.user._id,
    //         image: images
    //     });

    //     // 💡 修改第 34 行：打印整个 savedPost 对象而不仅仅是 ID
    //     // 这样你可以确认 image 数组是否真的成功存入数据库了
    //     console.log("✅ 数据库存入成功，完整内容:", JSON.stringify(savedPost, null, 2));

    //     res.redirect("/"); 
    // } catch (error) {
    //     console.error(" 流程中断，报错原因:", error.message);
    //     res.render("newPost", {
    //         title: "Create Post",
    //         error: "Could not save your post: " + error.message,
    //         user: req.user
    //     });
    // }
};