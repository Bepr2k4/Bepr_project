const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const path = require('path');

class UserController {

    userPage(req, res) {
        const filePath = path.join(__dirname, '../views/Users/user.html');
        res.sendFile(filePath, (err) => {
          if (err) {
            console.error("Lỗi khi tải trang user.html:", err);
            res.status(500).send('Lỗi khi tải trang');
          }
        });
      }

    async getUserByEmail(req, res) {
            try {
                const { email } = req.params;
                const user = await userModel.getUserByEmail(email);
                if (!user) {
                    return res.status(404).json({ message: 'user not found' });
                }
                res.status(200).json(user);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server error' });
            }
        }

  // Lấy danh sách tất cả người dùng
  async getAllUsers(req, res) {
    try {
      const users = await userModel.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Lấy thông tin người dùng theo ID
  async getUserByID(req, res) {
    try {
      const { id } = req.params;
      const user = await userModel.getUserByID(id);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Tạo người dùng mới
  async createUser(req, res) {
    try {
      const { email, password, full_name, phone, address } = req.body;
      if (!email || !password || !full_name || !phone) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
      }
      // Kiểm tra nếu người dùng đã tồn tại
      const existingUser = await userModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Người dùng với email này đã tồn tại' });
      }
      // Băm mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        password: hashedPassword,
        full_name,
        phone,
        address,
      };
      await userModel.createUser(newUser);
      res.status(201).json({ message: 'Người dùng được tạo thành công' });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Cập nhật thông tin người dùng theo ID
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { email, password, full_name, phone, address } = req.body;
      const existingUser = await userModel.getUserByID(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      // Nếu có password mới thì băm, nếu không thì giữ nguyên mật khẩu cũ
      const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;
      const updatedUser = {
        user_id: id,
        email: email || existingUser.email,
        password: hashedPassword,
        full_name: full_name || existingUser.full_name,
        phone: phone || existingUser.phone,
        address: address || existingUser.address,
      };
      await userModel.updateUser(updatedUser);
      res.status(200).json({ message: 'Cập nhật người dùng thành công' });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Xóa người dùng theo ID
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const existingUser = await userModel.getUserByID(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      await userModel.deleteUser(id);
      res.status(200).json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }
}

module.exports = new UserController();
