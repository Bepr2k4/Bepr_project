const pool = require('../connection/connectDB');

const getUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
};

const createUser = async (user) => {
    const { email, password, full_name, phone, address } = user;
    const sql = 'INSERT INTO users (email, password, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, "customer")';
    await pool.execute(sql, [email, password, full_name, phone, address]);
};

const getAllUsers = async () => {
    const sql = 'SELECT * FROM users';
    const [rows] = await pool.execute(sql);
    return rows;
};

const getUserByID = async (id) => {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
};

const updateUser = async (user) => {
    const { user_id, email, password, full_name, phone, address } = user;
    const sql = 'UPDATE users SET email = ?, password = ?, full_name = ?, phone = ?, address = ? WHERE user_id = ?';
    await pool.execute(sql, [email, password, full_name, phone, address, user_id]);
};

const deleteUser = async (id) => {
    const sql = 'DELETE FROM users WHERE user_id = ?';
    await pool.execute(sql, [id]);
};

module.exports = {
    getUserByEmail,
    createUser,
    getAllUsers,
    getUserByID,
    updateUser,
    deleteUser
};
