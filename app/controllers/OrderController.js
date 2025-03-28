// controllers/orderController.js
const ordersModel = require('../models/ordersModel');
const orderItemModel = require('../models/orderItemModel')
const shippingModel = require('../models/shippingModel');
const paymentModel = require('../models/paymentModel');
const path = require('path');

class OrderController {
  // Hiển thị trang order.html (nếu cần)
  orderPage(req, res) {
    const filePath = path.join(__dirname, '../views/Order/order.html');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi tải trang order.html:", err);
        res.status(500).send('Lỗi khi tải trang');
      }
    });
  }

  QlorderPage(req, res) {
    const filePath = path.join(__dirname, '../views/Order/QlOrder.html');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi tải trang quản lý order:", err);
        res.status(500).send('Lỗi khi tải trang');
      }
    });
  }


  DetailorderPage(req, res) {
    const filePath = path.join(__dirname, '../views/Order/orderDetail.html');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi tải trang chi tiết order:", err);
        res.status(500).send('Lỗi khi tải trang');
      }
    });
  }

  // Lấy danh sách đơn hàng kèm chi tiết
  async getAllOrders(req, res) {
    try {
      const orders = await ordersModel.getAllOrders();
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const orderItems = await orderItemModel.getOrderItemsByOrderId(order.order_id);
          const shipping = await shippingModel.getShippingByOrderId(order.order_id);
          const payments = await paymentModel.getPaymentsByOrderId(order.order_id);
          return { ...order, orderItems, shipping, payments };
        })
      );
      res.json(ordersWithDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lấy đơn hàng theo ID
  async getOrderById(req, res) {
    try {
      const order = await ordersModel.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
      
      const orderItems = await orderItemModel.getOrderItemsByOrderId(order.order_id);
      const shipping = await shippingModel.getShippingByOrderId(order.order_id);
      const payments = await paymentModel.getPaymentsByOrderId(order.order_id);
      res.json({ ...order, orderItems, shipping, payments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Tạo đơn hàng mới (có thể dùng cho admin)
  async createOrder(req, res) {
    try {
      const { customer_id, total, status, orderItems, shipping, payment } = req.body;
      const order_id = await ordersModel.createOrder({ customer_id, total, status });
      
      if (orderItems && orderItems.length) {
        for (const item of orderItems) {
          await orderItemModel.createOrderItem({
            order_id,
            food_id: item.food_id,
            quantity: item.quantity,
            price: item.price
          });
        }
      }
      
      if (shipping) {
        await shippingModel.createShipping({
          order_id,
          address: shipping.address,
          delivery_status: shipping.delivery_status,
          estimated_delivery: shipping.estimated_delivery
        });
      }
      
      if (payment) {
        await paymentModel.createPayment({
          order_id,
          customer_id,
          amount: payment.amount,
          method: payment.method,
          status: payment.status
        });
      }
      
      res.status(201).json({ message: 'Tạo đơn hàng thành công', order_id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Thanh toán (checkout): Tạo đơn hàng chính và các chi tiết liên quan
  async checkoutOrder(req, res) {
    try {
      const { customer_id, total, status, orderItems, shipping, payment } = req.body;
      
      // Tạo đơn hàng chính
      const order_id = await ordersModel.createOrder({ customer_id, total, status });
      
      // Tạo chi tiết đơn hàng
      if (orderItems && orderItems.length) {
        for (const item of orderItems) {
          await orderItemModel.createOrderItem({
            order_id,
            food_id: item.food_id,
            quantity: item.quantity,
            price: item.price
          });
        }
      }
      
      if (shipping) {
        await shippingModel.createShipping({
          order_id,
          address: shipping.address,
          delivery_status: shipping.delivery_status,
          estimated_delivery: shipping.estimated_delivery
        });
      }
      
      if (payment) {
        await paymentModel.createPayment({
          order_id,
          customer_id,
          amount: payment.amount,
          method: payment.method,
          status: payment.status
        });
      }
      
      res.status(201).json({ message: 'Thanh toán thành công', order_id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật đơn hàng
  async updateOrder(req, res) {
    try {
      const { order_id, customer_id, total, status } = req.body;
      const order = await ordersModel.getOrderById(order_id);
      if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
      
      await ordersModel.updateOrder({ order_id, customer_id, total, status });
      res.json({ message: 'Cập nhật đơn hàng thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      // Lấy dữ liệu từ body request: type có thể là 'payment', 'order', 'shipping'
      const { type, id, status } = req.body;
  
      if (!type || !id || !status) {
        return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
      }
  
      switch (type) {
        case 'payment':
          await paymentModel.updatePaymentStatus(id, status);
          break;
        case 'order':
          await ordersModel.updateOrderStatus(id, status);
          break;
        case 'shipping':
          await shippingModel.updateShippingStatus(id, status);
          break;
        default:
          return res.status(400).json({ message: "Loại cập nhật không hợp lệ" });
      }
  
      res.status(200).json({ message: "Cập nhật trạng thái thành công" });
    } catch (error) {
      console.error('Lỗi update status:', error);
      res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
    }
  }

  // Xóa đơn hàng
  async deleteOrder(req, res) {
    try {
      const order = await ordersModel.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
      
      await ordersModel.deleteOrder(req.params.id);
      res.json({ message: 'Xóa đơn hàng thành công' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
