const pool = require('../connection/connectDB');

const getOrderItemsByOrderId = async (order_id) => {
    const sql = 'SELECT * FROM order_items WHERE order_id = ?';
    const [rows] = await pool.execute(sql, [order_id]);
    return rows;
};

const createOrderItem = async (orderItem) => {
    const { order_id, food_id, quantity, price } = orderItem;
    const sql = 'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [order_id, food_id, quantity, price]);
    return result.insertId;
};

const updateOrderItem = async (orderItem) => {
    const { order_item_id, order_id, food_id, quantity, price } = orderItem;
    const sql = 'UPDATE order_items SET order_id = ?, food_id = ?, quantity = ?, price = ? WHERE order_item_id = ?';
    await pool.execute(sql, [order_id, food_id, quantity, price, order_item_id]);
};

const deleteOrderItem = async (order_item_id) => {
    const sql = 'DELETE FROM order_items WHERE order_item_id = ?';
    await pool.execute(sql, [order_item_id]);
};

module.exports = {
    getOrderItemsByOrderId,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem
};
