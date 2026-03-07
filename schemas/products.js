let mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true // Tự động xóa khoảng trắng thừa ở 2 đầu
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true // Luôn lưu dạng chữ thường để làm URL cho đẹp
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        default: "",
    },
    images: {
        type: [String],
        // Sửa lại default cho mảng để tránh lỗi nếu không truyền gì
        default: ["https://i.imgur.com/cHddUCu.jpeg"] 
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }
}, {
    timestamps: true // Tự động tạo createdAt và updatedAt
});

// Xuất model (Bỏ chữ new để tránh lỗi khởi tạo lại)
module.exports = mongoose.model('product', productSchema);