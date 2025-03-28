const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/EmployeeController');
const Middleware = require('../middlewares/middleware');

// Route render trang quản lý nhân viên (nếu cần))

router.get('/Page', Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, employeesController.empPage);

// [GET] localhost:3000/employees - Get all employees
router.get('/',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, employeesController.getAllEmployees);

// [GET] localhost:3000/employees/:id - Get employee by ID
router.get('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, employeesController.getEmployeeById);

// [POST] localhost:3000/employees - Create a new employee
router.post('/',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, employeesController.createEmployee);

// [PUT] localhost:3000/employees/:id - Update an employee by ID
router.put('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, employeesController.updateEmployee);

// [DELETE] localhost:3000/employees/:id - Delete an employee by ID
router.delete('/:id',Middleware.checkToken,Middleware.checkRoleAdminAndEmployees, employeesController.deleteEmployee);

module.exports = router;