const auth = require('../connection/auth');

const checkToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).sendFile('login.html', { root: 'app/views/Auth/'});
    }

    try {
        const user = auth.verifyToken(token);
        if (!user) {
            return res.status(403).sendFile('login.html', { root: 'app/views/Auth/' });
        } 

        res.locals.user = user;
        req.user = user; // Set the user in the request
        next();
    } catch (error) {
        console.error("Lỗi xác thực:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};

const checkRoleAdminAndEmployees = (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
        return res.status(404).sendFile('error.html', { root: 'app/views/Error/' });
    }
    if (user.role !== 'admin' && user.role !== 'employee') {
        return res.status(404).sendFile('error.html', { root: 'app/views/Error/' });
    }
    next();
};

module.exports = { checkToken, checkRoleAdminAndEmployees };

