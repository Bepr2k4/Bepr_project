const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routers
const authRouter = require('./app/routers/authRoute');
app.use('/auth', authRouter);

const employeeRouter = require('./app/routers/employeeRoute');
app.use('/api/employees', employeeRouter);

const productRouter = require('./app/routers/productRoute');
app.use('/api/products', productRouter);

const categoriesRouter = require('./app/routers/categoryRouter');
app.use('/api/categories', categoriesRouter);

const adminRouter = require('./app/routers/adminRouter');
app.use('/api/admin', adminRouter);

const userRouter = require('./app/routers/userRouter');
app.use('/api/users', userRouter);

const orderRouter = require('./app/routers/orderRouter');
app.use('/api/orders', orderRouter);

const cartRouter = require('./app/routers/cartRouter');
app.use('/api/cart', cartRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './app/views/Home/home.html'));
});

// Middleware to handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, './app/views/Error/error.html'));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
