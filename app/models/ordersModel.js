const pool = require('../connection/connectDB');

const getAllOrders = async () => {
    const sql = 'SELECT * FROM orders';
    const [rows] = await pool.execute(sql);
    return rows;
};

const getOrderById = async (order_id) => {
    const sql = 'SELECT * FROM orders WHERE order_id = ?';
    const [rows] = await pool.execute(sql, [order_id]);
    return rows[0] || null;
};

const createOrder = async (order) => {
    const { customer_id, total, status } = order;
    const sql = 'INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [customer_id, total, status]);
    return result.insertId;
};

const updateOrder = async (order) => {
    const { order_id, customer_id, total, status } = order;
    const sql = 'UPDATE orders SET customer_id = ?, total = ?, status = ? WHERE order_id = ?';
    await pool.execute(sql, [customer_id, total, status, order_id]);
};
const updateOrderStatus = async (order_id, status) => {
    const sql = 'UPDATE orders SET status = ? WHERE order_id = ?';
    await pool.execute(sql, [status, order_id]);
  };

const deleteOrder = async (order_id) => {
    const sql = 'DELETE FROM orders WHERE order_id = ?';
    await pool.execute(sql, [order_id]);
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus
};
