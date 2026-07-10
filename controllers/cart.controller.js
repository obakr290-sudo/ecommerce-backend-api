const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const recalculateCart = (cart) => {
  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
};

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne().populate('items.product');
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }
  res.status(200).json({ status: 'success', data: { cart } });
});

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  
  if (!product) return next(new AppError('Product not found', 404));
  if (product.stock < quantity) return next(new AppError('Not enough stock available', 400));

  let cart = await Cart.findOne();
  if (!cart) cart = new Cart({ items: [], totalPrice: 0 });

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  recalculateCart(cart);
  await cart.save();
  res.status(200).json({ status: 'success', data: { cart } });
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  let cart = await Cart.findOne();
  if (!cart) return next(new AppError('Cart not found', 404));

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex === -1) return next(new AppError('Item not found in cart', 404));

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  recalculateCart(cart);
  await cart.save();
  res.status(200).json({ status: 'success', data: { cart } });
});

exports.clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne();
  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }
  res.status(200).json({ status: 'success', message: 'Cart cleared successfully', data: { cart } });
});