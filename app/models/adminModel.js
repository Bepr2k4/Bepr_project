const pool = require('../connection/connectDB');

const getAdminByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ? AND role = "admin"';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
};

const createAdmin = async (admin) => {
    const { email, password, full_name, phone, address } = admin;
    const sqlUser = 'INSERT INTO users (email, password, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, "admin")';
    await pool.execute(sqlUser, [email, password, full_name, phone, address]);
};

const getAdminById = async (id) => {
    const sql = 'SELECT * FROM users WHERE user_id = ? AND role = "admin"';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
};

const updateAdmin = async (id, admin) => {
    const { email, password, full_name, phone, address } = admin;
    const sql = 'UPDATE users SET email = ?, password = ?, full_name = ?, phone = ?, address = ? WHERE user_id = ? AND role = "admin"';
    await pool.execute(sql, [email, password, full_name, phone, address, id]);
};

const deleteAdmin = async (id) => {
    const sql = 'DELETE FROM users WHERE user_id = ? AND role = "admin"';
    await pool.execute(sql, [id]);
};

const getAllAdmins = async () => {
    const sql = 'SELECT * FROM users WHERE role = "admin"';
    const [rows] = await pool.execute(sql);
    return rows;
};

module.exports = {
    getAllAdmins,
    getAdminByEmail,
    createAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
};