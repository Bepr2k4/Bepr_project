const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');
const Middleware = require('../middlewares/middleware');

// Trang giỏ hàng (yêu cầu đăng nhập)
router.get('/page', Middleware.checkToken, cartController.cartPage);

// 🛒 Lấy giỏ hàng của người dùng (chỉ lấy giỏ hàng của chính mình)
router.get('/', Middleware.checkToken, cartController.getCart);

// 🛍️ Thêm sản phẩm vào giỏ hàng
router.post('/', Middleware.checkToken, cartController.addCartItem);

// ✏️ Cập nhật số lượng sản phẩm trong giỏ
router.put('/:cart_item_id', Middleware.checkToken, cartController.updateCartItem);

// ❌ Xóa sản phẩm khỏi giỏ hàng
router.delete('/:cart_item_id', Middleware.checkToken, cartController.deleteCartItem);

module.exports = router;
