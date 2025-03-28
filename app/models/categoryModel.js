const pool = require('../connection/connectDB');

const getAllCategories = async () => {
    const [rows] = await pool.execute('SELECT * FROM categories');
    return rows;
};

const getCategoryById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE category_id = ?', [id]);
    return rows[0] || null;
};

// Tìm món ăn theo category_id
const getFoodsByCategoryId = async (category_id) => {
    const sql = 'SELECT * FROM foods WHERE category_id = ?';
    const [rows] = await pool.execute(sql, [category_id]);
    return rows;
};

// Tìm danh mục theo food_id
const getCategoryByFoodId = async (food_id) => {
    const sql = `
        SELECT c.* FROM categories c
        JOIN foods f ON c.category_id = f.category_id
        WHERE f.food_id = ?
    `;
    const [rows] = await pool.execute(sql, [food_id]);
    return rows[0] || null;
};

const createCategory = async (category) => {
    const { name, description } = category;
    const sql = 'INSERT INTO categories (name, description) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [name, description]);
    return { category_id: result.insertId, ...category };
};

const updateCategory = async (id, category) => {
    const { name, description } = category;
    const sql = 'UPDATE categories SET name = ?, description = ? WHERE category_id = ?';
    await pool.execute(sql, [name, description, id]);
    return { category_id: id, ...category };
};

const deleteCategory = async (id) => {
    const sql = 'DELETE FROM categories WHERE category_id = ?';
    await pool.execute(sql, [id]);
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getFoodsByCategoryId,
    getCategoryByFoodId,
    createCategory,
    updateCategory,
    deleteCategory
};
