// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    // 如果你的 Schema 里还有 uploaded_by 字段，保留它；如果没有，请删除下面这段
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const File = mongoose.model('File', fileSchema);

//关键是这一行！必须导出这个模型，Controller 才能用
module.exports = File;