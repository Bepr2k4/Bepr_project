const cartModel = require('../models/cartModel');
const path = require('path');

class CartController {

    cartPage(req, res) {
        const filePath = path.join(__dirname, '../views/Cart/cart.html');
        res.sendFile(filePath, (err) => {
          if (err) {
            console.error("Lỗi khi tải trang cart.html:", err);
            res.status(500).send('Lỗi khi tải trang cart.html');
          }
        });
      }

  // Lấy giỏ hàng của người dùng
    async getCart(req, res) {
        try {
        const user_id = req.user.user_id; // Get the user_id from the token
        const cartItems = await cartModel.getCartItemsByUserId(user_id);
        res.status(200).json(cartItems);
        } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
        }
    }

  // Thêm sản phẩm vào giỏ
  async addCartItem(req, res) {
    try {
        const { food_id, quantity } = req.body;
        const user_id = req.user.user_id; // Get the user_id from the token
        const cartItemId = await cartModel.addCartItem({ user_id, food_id, quantity });
        res.status(201).json({ message: 'Sản phẩm đã được thêm vào giỏ', cartItemId });
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ:", error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
        }
    }

  // Cập nhật số lượng sản phẩm trong giỏ
  async updateCartItem(req, res) {
    try {
      const { cart_item_id } = req.params;
      const { quantity } = req.body;
      await cartModel.updateCartItem({ cart_item_id, quantity });
      res.status(200).json({ message: 'Giỏ hàng được cập nhật' });
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }

  // Xóa sản phẩm khỏi giỏ
  async deleteCartItem(req, res) {
    try {
      const { cart_item_id } = req.params;
      await cartModel.deleteCartItem(cart_item_id);
      res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ' });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ:", error);
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  }
}

module.exports = new CartController();
