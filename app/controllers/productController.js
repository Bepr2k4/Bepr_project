const productModel = require('../models/productModel');
const path = require('path');

class ProductController {
  // Render trang quản lý sản phẩm
  productPage(req, res) {
    const filePath = path.join(__dirname, '../views/Product/products.html');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi tải trang products.html:", err);
        res.status(500).send('Lỗi khi tải trang');
      }
    });
  }

  productDetailPage(req, res) {
    const filePath = path.join(__dirname, '../views/Product/productD.html');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi tải trang product-detail.html:", err);
        res.status(500).send('Lỗi khi tải trang chi tiết sản phẩm');
      }
    });
  };


  // Lấy danh sách tất cả sản phẩm
  async getAllProducts(req, res) {
    try {
      const products = await productModel.getAllFoods();
      res.status(200).json(products);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productModel.getFoodById(id);
      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Xóa sản phẩm theo ID
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const existingProduct = await productModel.getFoodById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }
      await productModel.deleteFood(id);
      res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Tạo sản phẩm mới (bao gồm cả ảnh)
  async createProduct(req, res) {
    try {
      const { name, description, price, stock, category_id, image } = req.body;

      // Kiểm tra thông tin đầu vào
      if (!name || !description || price === undefined || stock === undefined || !category_id || !image) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
      }
      // Kiểm tra price và stock phải là số hợp lệ
      if (isNaN(price) || isNaN(stock)) {
        return res.status(400).json({ message: 'Giá và số lượng phải là số hợp lệ' });
      }

      const newProduct = await productModel.createFood({ name, description, price, stock, category_id, image });
      res.status(201).json({ message: 'Sản phẩm đã được tạo', product: newProduct });
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Cập nhật sản phẩm theo ID
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, stock, image } = req.body;

      const existingProduct = await productModel.getFoodById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      // Nếu cung cấp giá trị price hoặc stock thì kiểm tra tính hợp lệ
      if ((price !== undefined && isNaN(price)) || (stock !== undefined && isNaN(stock))) {
        return res.status(400).json({ message: 'Giá và số lượng phải là số hợp lệ' });
      }

      await productModel.updateFood(id, { name, description, price, stock, image });
      res.status(200).json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }
}

module.exports = new ProductController();
