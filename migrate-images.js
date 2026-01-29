require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("./models/Post");

async function migrateImages() {
  try {
    // 1. 连接数据库
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected for migration...");

    // 2. 查找所有帖子
    // 注意：因为我们在 Post.js 里可能已经把 image 删掉了，
    // 为了确保能读到 image 字段，我们在这里直接操作数据库层面的数据，或者临时相信 Mongoose 能读到（如果 strict: false）
    // 但最稳妥的方法是，如果 Post.js 只有 images，旧数据的 image 字段可能被 Mongoose 忽略。
    // 所以我们需要用 lean() 或者 updateMany 的方式。
    
    // 查找所有也就是存在 image 字段且数组长度大于 0 的帖子
    // 这里我们用原生的 update 语法，这样不需要依赖 Model 的严格定义
    const result = await Post.collection.updateMany(
      { 
        image: { $exists: true, $ne: [] }, // 找到有 image 字段的
        $or: [
            { images: { $exists: false } }, 
            { images: { $size: 0 } }
        ] // 且 images 还没数据的
      },
      [
        {
          $set: {
            images: "$image", // 把 image 的值赋给 images
            image: null       // 把 image 设为 null (或者之后用 $unset 删除)
          }
        }
      ]
    );

    console.log(`Migration completed. Matched and updated ${result.modifiedCount} posts.`);

    // 3. 彻底删除 image 字段 (可选，保持数据整洁)
    const unsetResult = await Post.collection.updateMany(
        { image: { $exists: true } },
        { $unset: { image: "" } }
    );
    console.log(`Cleanup completed. Removed 'image' field from ${unsetResult.modifiedCount} posts.`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateImages();
