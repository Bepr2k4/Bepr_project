// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const Middleware = require('../middlewares/middleware')

router.get('/page',Middleware.checkToken, orderController.orderPage)

router.get('/pageDetail',Middleware.checkToken, orderController.DetailorderPage)

router.get('/QLpage',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees ,orderController.QlorderPage)

// Lấy danh sách đơn hàng
router.get('/',Middleware.checkToken, orderController.getAllOrders);

// Lấy đơn hàng theo ID
router.get('/:id',Middleware.checkToken, orderController.getOrderById);

// Tạo đơn hàng mới
router.post('/',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, orderController.createOrder);

// Thanh toán (checkout)
router.post('/checkout', Middleware.checkToken, orderController.checkoutOrder);

// Cập nhật đơn hàng
router.put('/',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, orderController.updateOrder);

// Xóa đơn hàng
router.delete('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, orderController.deleteOrder);

// Endpoint cập nhật trạng thái đơn hàng (chỉ cập nhật status)
router.put('/status',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, orderController.updateOrderStatus);


module.exports = router;
