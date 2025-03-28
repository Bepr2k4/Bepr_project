const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Tạo Access Token với thời gian hết hạn lấy từ .env
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });
};

// Xác thực Token, trả về payload nếu thành công, hoặc null nếu lỗi
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Lỗi khi xác thực token:', error);
    if (error.name === 'TokenExpiredError') {
      console.error('Token đã hết hạn!');
    }
    return null;
  }
};

module.exports = {
  generateAccessToken,
  verifyToken
};
