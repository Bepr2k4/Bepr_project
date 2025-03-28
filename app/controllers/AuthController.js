const auth = require('../connection/auth');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

class AuthController {
    renderLoginPage(req, res) {
        res.sendFile(path.join(__dirname, '../views/Auth/login.html'));
    }

    renderRegisterPage(req, res) {
        res.sendFile(path.join(__dirname, '../views/Auth/register.html'));
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.getUserByEmail(email);
            if (!user) {
                return res.redirect('/auth/login');
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.redirect('/auth/login');
            }
            const currentUser = {
                user_id: user.user_id,
                full_name: user.full_name,
                phone: user.phone,
                address: user.address,
                email: user.email,
                role: user.role
            };

            const token = auth.generateAccessToken(currentUser);
            res.cookie('token', token);
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async register(req, res) {
        try {
            const { email, password, full_name, phone, address } = req.body;
            const existingUser = await User.getUserByEmail(email);

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.createUser({ email, password: hashedPassword, full_name, phone, address});

            res.redirect('/auth/login');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }

    async getCurrentUser(req, res) {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.getUserByEmail(decoded.email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                user_id: user.user_id,
                full_name: user.full_name,
                phone: user.phone,
                address: user.address,
                email: user.email,
                role: user.role
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new AuthController();