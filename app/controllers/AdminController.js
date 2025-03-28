const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const path = require('path');

class AdminController {
    adminPage(req, res) {
        res.sendFile(path.join(__dirname, '../views/Admin/admin.html'));
    }

    async getAdminByEmail(req, res) {
        try {
            const { email } = req.params;
            const admin = await adminModel.getAdminByEmail(email);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.status(200).json(admin);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Tạo admin mới
    async createAdmin(req, res) {
        try {
            const { email, password, full_name, phone, address } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            await adminModel.createAdmin({ email, password: hashedPassword, full_name, phone, address });
            res.status(201).json({ message: 'Admin created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Lấy thông tin admin theo ID
    async getAdminById(req, res) {
        try {
            const { id } = req.params;
            const admin = await adminModel.getAdminById(id);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.status(200).json(admin);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Cập nhật thông tin admin
    async updateAdmin(req, res) {
        try {
            const { id } = req.params;
            const { email, password, full_name, phone, address } = req.body;
            const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
            await adminModel.updateAdmin(id, { email, password: hashedPassword, full_name, phone, address });
            res.status(200).json({ message: 'Admin updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Xóa admin
    async deleteAdmin(req, res) {
        try {
            const { id } = req.params;
            await adminModel.deleteAdmin(id);
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getAllAdmins(req, res) {
        try {
            const admins = await adminModel.getAllAdmins();
            res.status(200).json(admins);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new AdminController();