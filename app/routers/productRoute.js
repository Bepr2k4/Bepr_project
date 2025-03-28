const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const Middleware = require('../middlewares/middleware');// Route render trang quản lý sản phẩm (nếu cần)
router.get('/page', Middleware.checkToken, Middleware.checkRoleAdminAndEmployees, productController.productPage);

router.get('/page/:id', productController.productDetailPage);

// API: Lấy danh sách tất cả sản phẩm
router.get('/', productController.getAllProducts);

// API: Lấy thông tin sản phẩm theo ID
router.get('/:id', productController.getProductById);

// API: Tạo sản phẩm mới (bao gồm cả ảnh)
router.post('/',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, productController.createProduct);

// API: Cập nhật sản phẩm theo ID
router.put('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, productController.updateProduct);

// API: Xóa sản phẩm theo ID
router.delete('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, productController.deleteProduct);

module.exports = router;
