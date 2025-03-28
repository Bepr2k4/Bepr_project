const pool = require('../connection/connectDB');

const getPaymentsByOrderId = async (order_id) => {
    const sql = 'SELECT * FROM payments WHERE order_id = ?';
    const [rows] = await pool.execute(sql, [order_id]);
    return rows;
};

const createPayment = async (payment) => {
    const { order_id, customer_id, amount, method, status } = payment;
    const sql = 'INSERT INTO payments (order_id, customer_id, amount, method, status) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [order_id, customer_id, amount, method, status]);
    return result.insertId;
};

const updatePayment = async (payment) => {
    const { payment_id, order_id, customer_id, amount, method, status } = payment;
    const sql = 'UPDATE payments SET order_id = ?, customer_id = ?, amount = ?, method = ?, status = ? WHERE payment_id = ?';
    await pool.execute(sql, [order_id, customer_id, amount, method, status, payment_id]);
};

// Hàm cập nhật trạng thái thanh toán (chỉ cập nhật status)
const updatePaymentStatus = async (payment_id, status) => {
    const sql = 'UPDATE payments SET status = ? WHERE payment_id = ?';
    await pool.execute(sql, [status, payment_id]);
  };

const deletePayment = async (payment_id) => {
    const sql = 'DELETE FROM payments WHERE payment_id = ?';
    await pool.execute(sql, [payment_id]);
};

module.exports = {
    getPaymentsByOrderId,
    createPayment,
    updatePayment,
    deletePayment,
    updatePaymentStatus
};
