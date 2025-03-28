const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const Middleware = require('../middlewares/middleware');
// Route render trang quản lý sản phẩm (nếu cần)
router.get('/page',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, userController.userPage);

// [GET] /api/users - Lấy danh sách tất cả người dùng
router.get('/', userController.getAllUsers);

// [GET] /api/users/:id - Lấy thông tin người dùng theo ID
router.get('/:id', userController.getUserByID);

// [POST] /api/users - Tạo người dùng mới
router.post('/',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, userController.createUser);

// [PUT] /api/users/:id - Cập nhật thông tin người dùng theo ID
router.put('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, userController.updateUser);

// [DELETE] /api/users/:id - Xóa người dùng theo ID
router.delete('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, userController.deleteUser);

module.exports = router;
