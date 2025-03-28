const pool = require('../connection/connectDB');

// Lấy tất cả thực phẩm (bao gồm cả ảnh)
const getAllFoods = async () => {
    const sql = `
      SELECT 
        f.*,
        fi.image_path
      FROM 
        foods f
      LEFT JOIN 
        food_images fi ON f.food_id = fi.food_id
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  };  

// Tạo thực phẩm mới (bao gồm cả ảnh) với transaction
const createFood = async (food) => {
    const { name, description, price, stock, category_id, image } = food;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const sqlFood = `
        INSERT INTO foods (name, description, price, stock, category_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [resultFood] = await connection.execute(sqlFood, [name, description, price, stock, category_id]);
      const food_id = resultFood.insertId;
  
      // Nếu có image, thêm vào bảng food_images (theo cấu trúc: food_image_id, food_id, image_path, uploaded_at)
      if (image) {
        const sqlImage = `
          INSERT INTO food_images (food_id, image_path)
          VALUES (?, ?)
        `;
        await connection.execute(sqlImage, [food_id, image]);
      }
  
      await connection.commit();
      return { food_id, name, description, price, stock, category_id, image };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
};
  
  // Cập nhật thực phẩm theo food_id (bao gồm cả ảnh)
  const updateFood = async (food_id, food) => {
    const { name, description, price, stock, image } = food;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // Cập nhật bảng foods
      const sqlFood = `
        UPDATE foods
        SET name = ?, description = ?, price = ?, stock = ?
        WHERE food_id = ?
      `;
      await connection.execute(sqlFood, [name, description, price, stock, food_id]);
  
      // Nếu truyền image (bao gồm cả trường hợp image rỗng nếu muốn cập nhật thành rỗng)
      if (typeof image !== 'undefined') {
        const sqlImage = `
          UPDATE food_images
          SET image_path = ?
          WHERE food_id = ?
        `;
        await connection.execute(sqlImage, [image, food_id]);
      }
  
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
};
  
  // Lấy thông tin thực phẩm theo food_id (bao gồm cả ảnh)
  const getFoodById = async (food_id) => {
    const sql = `
      SELECT 
        f.*, 
        fi.image_path 
      FROM 
        foods f
      LEFT JOIN 
        food_images fi ON f.food_id = fi.food_id
      WHERE 
        f.food_id = ?
    `;
    const [rows] = await pool.execute(sql, [food_id]);
    return rows[0] || null;
};  

// Xóa thực phẩm theo food_id
const deleteFood = async (food_id) => {
    const sql = 'DELETE FROM foods WHERE food_id = ?';
    const [result] = await pool.execute(sql, [food_id]);
    return result;
};

module.exports = {
    getAllFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
};
