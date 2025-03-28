-- Tạo database mới
CREATE DATABASE food_ordering;
USE food_ordering;

----------------------------------------------------------
-- 1. Bảng người dùng (users) với cột role
----------------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    role ENUM('admin', 'employee', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
----------------------------------------------------------
-- 2. Bảng hình ảnh người dùng (user_images)
----------------------------------------------------------
CREATE TABLE user_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

----------------------------------------------------------
-- 3. Bảng danh mục món ăn (categories)
----------------------------------------------------------
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

----------------------------------------------------------
-- 4. Bảng món ăn (foods)
----------------------------------------------------------
CREATE TABLE foods (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

----------------------------------------------------------
-- 5. Bảng hình ảnh món ăn (food_images)
----------------------------------------------------------
CREATE TABLE food_images (
    food_image_id INT AUTO_INCREMENT PRIMARY KEY,
    food_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE
);

----------------------------------------------------------
-- 6. Bảng đơn hàng (orders)
----------------------------------------------------------
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

----------------------------------------------------------
-- 7. Bảng chi tiết đơn hàng (order_items)
----------------------------------------------------------
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE
);

----------------------------------------------------------
-- 8. Bảng thanh toán (payments)
----------------------------------------------------------
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('cash', 'credit_card', 'paypal') NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE
);

----------------------------------------------------------
-- 9. Bảng giao hàng (shippings)
----------------------------------------------------------
CREATE TABLE shippings (
    shipping_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    address TEXT NOT NULL,
    delivery_status ENUM('pending', 'in_transit', 'delivered') DEFAULT 'pending',
    estimated_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

----------------------------------------------------------
-- 10. Bảng phiên đăng nhập (sessions)
----------------------------------------------------------
CREATE TABLE sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

----------------------------------------------------------
-- INSERT DỮ LIỆU MẪU
----------------------------------------------------------

-- 1. Thêm dữ liệu mẫu cho bảng users
INSERT INTO users (full_name, email, phone, password, address, role)
VALUES
('Admin User', 'admin@example.com', '0123456789', 'hashed_admin_password', '123 Admin Street', 'admin'),
('Employee User', 'employee@example.com', '0987654321', 'hashed_employee_password', '456 Employee Road', 'employee'),
('Customer One', 'customer1@example.com', '0111222333', 'hashed_customer1_password', '789 Customer Ave', 'customer'),
('Customer Two', 'customer2@example.com', '0998877665', 'hashed_customer2_password', '101 Customer Lane', 'customer');

-- 2. Thêm dữ liệu mẫu cho bảng user_images
INSERT INTO user_images (user_id, image_path)
VALUES
(1, 'images/users/admin1.jpg'),
(3, 'images/users/customer1.jpg'),
(4, 'images/users/customer2.jpg');

-- 3. Thêm dữ liệu mẫu cho bảng categories
INSERT INTO categories (name, description)
VALUES
('Pizza', 'Pizza Ý với nhiều loại topping phong phú.'),
('Burger', 'Burger ngon với nguyên liệu tươi mới.'),
('Sushi', 'Món sushi truyền thống của Nhật Bản.');

-- 4. Thêm dữ liệu mẫu cho bảng foods
INSERT INTO foods (category_id, name, description, price, stock)
VALUES
(1, 'Margherita Pizza', 'Pizza truyền thống với cà chua, mozzarella và húng quế.', 8.99, 50),
(1, 'Pepperoni Pizza', 'Pizza cay với pepperoni và phô mai.', 10.99, 40),
(2, 'Cheese Burger', 'Burger kèm phô mai dày và nước sốt đặc trưng.', 5.99, 60),
(2, 'Bacon Burger', 'Burger với lớp thịt xông khói giòn.', 6.99, 45),
(3, 'Salmon Sushi', 'Sushi cá hồi tươi với cơm dẻo và giấm.', 12.99, 30),
(3, 'Tuna Sushi', 'Sushi cá ngừ thơm ngon, được cuốn cẩn thận.', 11.99, 35);

-- 5. Thêm dữ liệu mẫu cho bảng food_images
INSERT INTO food_images (food_id, image_path)
VALUES
(1, 'images/foods/margherita.jpg'),
(2, 'images/foods/pepperoni.jpg'),
(3, 'images/foods/cheeseburger.jpg'),
(4, 'images/foods/baconburger.jpg'),
(5, 'images/foods/salmon_sushi.jpg'),
(6, 'images/foods/tuna_sushi.jpg');

-- 6. Thêm dữ liệu mẫu cho bảng orders (giả sử Customer One có user_id = 3, Customer Two có user_id = 4)
INSERT INTO orders (customer_id, total, status)
VALUES
(3, 14.98, 'pending'),
(4, 11.99, 'processing');

-- 7. Thêm dữ liệu mẫu cho bảng order_items
INSERT INTO order_items (order_id, food_id, quantity, price)
VALUES
(1, 1, 1, 8.99),
(1, 3, 1, 5.99),
(2, 6, 1, 11.99);

-- 8. Thêm dữ liệu mẫu cho bảng payments
INSERT INTO payments (order_id, customer_id, amount, method, status)
VALUES
(1, 3, 14.98, 'credit_card', 'completed'),
(2, 4, 11.99, 'paypal', 'pending');

-- 9. Thêm dữ liệu mẫu cho bảng shippings
INSERT INTO shippings (order_id, address, delivery_status, estimated_delivery)
VALUES
(1, '789 Customer Ave', 'pending', '2025-03-20 12:00:00'),
(2, '101 Customer Lane', 'in_transit', '2025-03-19 15:00:00');
