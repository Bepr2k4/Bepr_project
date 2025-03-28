const pool = require('../connection/connectDB');

const getShippingByOrderId = async (order_id) => {
    const sql = 'SELECT * FROM shippings WHERE order_id = ?';
    const [rows] = await pool.execute(sql, [order_id]);
    return rows[0] || null;
};

const createShipping = async (shipping) => {
    const { order_id, address, delivery_status, estimated_delivery } = shipping;
    const sql = 'INSERT INTO shippings (order_id, address, delivery_status, estimated_delivery) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [order_id, address, delivery_status, estimated_delivery]);
    return result.insertId;
};

const updateShipping = async (shipping) => {
    const { shipping_id, order_id, address, delivery_status, estimated_delivery } = shipping;
    const sql = 'UPDATE shippings SET order_id = ?, address = ?, delivery_status = ?, estimated_delivery = ? WHERE shipping_id = ?';
    await pool.execute(sql, [order_id, address, delivery_status, estimated_delivery, shipping_id]);
};

// Hàm cập nhật trạng thái giao hàng (chỉ cập nhật delivery_status)
const updateShippingStatus = async (shipping_id, delivery_status) => {
    const sql = 'UPDATE shippings SET delivery_status = ? WHERE shipping_id = ?';
    await pool.execute(sql, [delivery_status, shipping_id]);
  };

const deleteShipping = async (shipping_id) => {
    const sql = 'DELETE FROM shippings WHERE shipping_id = ?';
    await pool.execute(sql, [shipping_id]);
};

module.exports = {
    getShippingByOrderId,
    createShipping,
    updateShipping,
    deleteShipping,
    updateShippingStatus
};
