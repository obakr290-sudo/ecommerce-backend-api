const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.checkout = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;
  const cart = await Cart.findOne().populate('items.product');

  if (!cart || cart.items.length === 0) return next(new AppError('Your cart is empty', 400));

  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;
    if (product.stock < item.quantity) {
      return next(new AppError(`Not enough stock for product: ${product.name}`, 400));
    }
    
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
  }

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }
    });
  }

  const orderNumber = `ORD-${Date.now()}`;
  const order = await Order.create({
    orderNumber,
    items: orderItems,
    totalPrice: cart.totalPrice,
    shippingAddress
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({ status: 'success', data: { order } });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});

exports.updateStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));

  order.status = status;
  await order.save();
  
  res.status(200).json({ status: 'success', data: { order } });
});