require('dotenv').config();
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./db/connection');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const categoryRouter = require('./routes/category.routes');
const productRouter = require('./routes/product.routes');
const cartRouter = require('./routes/cart.routes');
const orderRouter = require('./routes/order.routes');

const app = express();

app.use(express.json());
app.use(mongoSanitize()); 


app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
  });
}).catch(err => {
  console.log('Failed to start server due to DB connection:', err.message);
  
  app.listen(PORT, () => {
    console.log(`Server forced to start on port ${PORT} for deployment tracking.`);
  });
});