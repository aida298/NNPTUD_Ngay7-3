const express = require('express');
let router = express.Router();
let slugify = require('slugify');
// Import model đã tạo ở bước trước
let ProductModel = require('../schemas/products');

// 1. GET ALL: Lấy danh sách sản phẩm chưa bị xóa
router.get('/', async (req, res) => {
    try {
        let result = await ProductModel.find({ isDeleted: false }).populate('category');
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// 2. GET BY ID: Lấy chi tiết 1 sản phẩm
router.get('/:id', async (req, res) => {
    try {
        let result = await ProductModel.findOne({ 
            _id: req.params.id, 
            isDeleted: false 
        }).populate('category');
        
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send("Sản phẩm không tồn tại hoặc đã bị xóa");
        }
    } catch (err) {
        res.status(400).send("ID không đúng định dạng");
    }
});

// 3. POST: Tạo sản phẩm mới vào MongoDB
router.post('/', async (req, res) => {
    try {
        // Kiểm tra xem req.body có tồn tại không để tránh lỗi 'reading title'
        if (!req.body || !req.body.title) {
            return res.status(400).send({ message: "Lỗi: Dữ liệu gửi lên thiếu trường 'title'" });
        }

        let newProductData = {
            title: req.body.title,
            // Sử dụng slugify để tạo slug tự động từ title
            slug: slugify(req.body.title, {
                replacement: '-',
                lower: true, 
                strict: true
            }),
            price: req.body.price || 0,
            description: req.body.description || "",
            category: req.body.category, 
            images: req.body.images || ["https://i.imgur.com/cHddUCu.jpeg"]
        };

        let product = new ProductModel(newProductData);
        let result = await product.save();
        res.status(201).send(result);
    } catch (err) {
        res.status(400).send({ message: "Lỗi tạo sản phẩm: " + err.message });
    }
});

// 4. PUT: Cập nhật thông tin sản phẩm
router.put('/:id', async (req, res) => {
    try {
        // Nếu người dùng đổi title, cập nhật lại cả slug
        if (req.body && req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true, strict: true });
        }

        let result = await ProductModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } 
        );

        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send("Không tìm thấy ID để cập nhật");
        }
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// 5. DELETE: Xóa mềm (đánh dấu isDeleted = true)
router.delete('/:id', async (req, res) => {
    try {
        let result = await ProductModel.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (result) {
            res.status(200).send({ message: "Xóa thành công", data: result });
        } else {
            res.status(404).send("Không tìm thấy ID để xóa");
        }
    } catch (err) {
        res.status(400).send("Lỗi khi xóa");
    }
});

module.exports = router;