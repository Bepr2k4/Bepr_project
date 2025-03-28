const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const Middleware = require('../middlewares/middleware');
// [GET] /admin/email/:email - Get admin by email
router.get('/email/:email',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, adminController.getAdminByEmail);

// [GET] /admin - Get all admins
router.get('/',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, adminController.getAllAdmins);

router.get('/adminPage',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, adminController.adminPage);

// [POST] /admin - Create a new admin
router.post('/',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, adminController.createAdmin);

// [GET] /admin/:id - Get admin by ID
router.get('/:id', Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, adminController.getAdminById);

// [PUT] /admin/:id - Update admin by ID
router.put('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, adminController.updateAdmin);

// [DELETE] /admin/:id - Delete admin by ID
router.delete('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, adminController.deleteAdmin);

module.exports = router;