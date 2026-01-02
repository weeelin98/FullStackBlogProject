const Post =require("../models/Post");

//Rendering post form
exports.getPostForm = (req, res) => {
    res.render("newPost", {
        title: "Create Post",
        error: "",
        user: req.user,
    });
};

//creating new post logic
exports.createPost = async (req, res) => {

    try {
        // 解构变量名需与 EJS 中的 name="title" 和 name="content" 一致 
        const { title, content } = req.body;

        // 💡 修复：使用 Post.create 会自动执行 .save() 并返回 Promise
        const savedPost = await Post.create({
            title: title,
            content: content,
            author: req.user._id // 确保已登录并拿到 user
        });

        console.log("数据入库成功:", savedPost);
        res.redirect("/"); // 保存成功后跳转
    } catch (error) {
        console.error("保存失败:", error.message);
        res.render("newPost", {
            title: "Create Post",
            error: "Could not save your post.",
            user: req.user
        });
    }
    // const { title, content } = req.body;
    // const newPost = await new Post({
    //         title,
    //         content,
    //         author:req.user._id,
    //     });
    //     console.log(newPost);
    //     res.redirect("/posts");
    };