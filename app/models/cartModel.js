const pool = require('../connection/connectDB');

const getCartItemsByUserId = async (user_id) => {
  try {
    const sql = `
      SELECT ci.*, f.name, f.price, fi.image_path 
      FROM cart_items ci
      LEFT JOIN foods f ON ci.food_id = f.food_id
      LEFT JOIN food_images fi ON f.food_id = fi.food_id
      WHERE ci.user_id = ?
    `;
    const [rows] = await pool.execute(sql, [user_id]);
    return rows;
  } catch (error) {
    console.error("Error in getCartItemsByUserId:", error);
    throw error;
  }
};

const addCartItem = async (cartItem) => {
  try {
    const { user_id, food_id, quantity } = cartItem;
    const sql = 'INSERT INTO cart_items (user_id, food_id, quantity) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [user_id, food_id, quantity]);
    return result.insertId;
  } catch (error) {
    console.error("Error in addCartItem:", error);
    throw error;
  }
};

const updateCartItem = async (cartItem) => {
  try {
    const { cart_item_id, quantity } = cartItem;
    const sql = 'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?';
    await pool.execute(sql, [quantity, cart_item_id]);
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    throw error;
  }
};

const deleteCartItem = async (cart_item_id) => {
  try {
    const sql = 'DELETE FROM cart_items WHERE cart_item_id = ?';
    await pool.execute(sql, [cart_item_id]);
  } catch (error) {
    console.error("Error in deleteCartItem:", error);
    throw error;
  }
};

module.exports = {
  getCartItemsByUserId,
  addCartItem,
  updateCartItem,
  deleteCartItem
};
