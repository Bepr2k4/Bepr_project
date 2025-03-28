const pool = require('../connection/connectDB');

// Lấy tất cả nhân viên
const findAllEmployees = async () => {
    const sql = 'SELECT * FROM users WHERE role = "employee"';
    const [rows] = await pool.execute(sql);
    return rows;
};

// Tạo nhân viên mới
const createSigEmployee = async (newEmployee) => {
    const { full_name, email, phone, password, address } = newEmployee;
    const sql = `
        INSERT INTO users (full_name, email, phone, password, address, role)
        VALUES (?, ?, ?, ?, ?, "employee")
    `;
    await pool.execute(sql, [full_name, email, phone, password, address]);
};

// Lấy thông tin nhân viên theo ID
const findEmployeeById = async (employee_id) => {
    const sql = 'SELECT * FROM users WHERE user_id = ? AND role = "employee"';
    const [rows] = await pool.execute(sql, [employee_id]);
    return rows[0] || null;
};

// Cập nhật thông tin nhân viên theo ID
const updateSigEmployee = async (employee) => {
    const { user_id, full_name, email, phone, password, address } = employee;
    const sql = `
        UPDATE users
        SET full_name = ?, email = ?, phone = ?, password = ?, address = ?
        WHERE user_id = ? AND role = "employee"
    `;
    await pool.execute(sql, [full_name, email, phone, password, address, user_id]);
};

// Xóa nhân viên theo ID
const deleteSigEmployee = async (employee_id) => {
    const sql = 'DELETE FROM users WHERE user_id = ? AND role = "employee"';
    await pool.execute(sql, [employee_id]);
};

module.exports = {
    findAllEmployees,
    createSigEmployee,
    findEmployeeById,
    updateSigEmployee,
    deleteSigEmployee
};
