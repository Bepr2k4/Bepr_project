const employeesModel = require('../models/employeeModel');
const bcrypt = require('bcrypt');
const path = require('path');

class EmployeeController {
  // Hiển thị trang quản lý nhân viên (HTML tĩnh)
  empPage(req, res) {
    const filePath = path.join(__dirname, '../views/Employees/employees.html');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi tải trang employees.html:", err);
        res.status(500).send('Lỗi khi tải trang employees.html');
      }
    });
  }

  // Lấy danh sách tất cả nhân viên (JSON)
  async getAllEmployees(req, res) {
    try {
      const employees = await employeesModel.findAllEmployees();
      res.status(200).json(employees);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Lấy thông tin nhân viên theo ID (JSON)
  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const employee = await employeesModel.findEmployeeById(id);
      if (!employee) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
      res.status(200).json(employee);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhân viên:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Tạo nhân viên mới
  async createEmployee(req, res) {
    try {
      const { full_name, email, phone, password, address } = req.body;
      if (!full_name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newEmployeeData = {
        full_name,
        email,
        phone,
        password: hashedPassword,
        address: address || null
      };
      await employeesModel.createSigEmployee(newEmployeeData);
      res.status(201).json({ message: 'Nhân viên được tạo thành công' });
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Cập nhật thông tin nhân viên theo ID
  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const { full_name, email, phone, password, address } = req.body;
      const existingEmployee = await employeesModel.findEmployeeById(id);
      if (!existingEmployee) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
      // Nếu có mật khẩu mới, băm mật khẩu; nếu không, dùng mật khẩu cũ
      const hashedPassword = password ? await bcrypt.hash(password, 10) : existingEmployee.password;
      const updatedEmployee = {
        user_id: id,
        full_name: full_name || existingEmployee.full_name,
        email: email || existingEmployee.email,
        phone: phone || existingEmployee.phone,
        password: hashedPassword,
        address: address || existingEmployee.address
      };
      await employeesModel.updateSigEmployee(updatedEmployee);
      res.status(200).json({ message: 'Cập nhật thông tin nhân viên thành công' });
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Xóa nhân viên theo ID
  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const existingEmployee = await employeesModel.findEmployeeById(id);
      if (!existingEmployee) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
      await employeesModel.deleteSigEmployee(id);
      res.status(200).json({ message: 'Xóa nhân viên thành công' });
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }
}

module.exports = new EmployeeController();
