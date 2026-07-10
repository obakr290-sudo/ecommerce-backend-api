const Product = require('../models/product.model');
const Category = require('../models/category.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getProducts = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludeFields.forEach(el => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  let filter = JSON.parse(queryStr);

  if (req.query.category) filter.category = req.query.category;
  if (req.query.inStock) filter.inStock = req.query.inStock === 'true';
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  const products = await Product.find(filter);
  res.status(200).json({ status: 'success', results: products.length, data: { products } });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name description');
  if (!product) return next(new AppError('Product not found', 404));
  res.status(200).json({ status: 'success', data: { product } });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const categoryExists = await Category.findById(req.body.category);
  if (!categoryExists) return next(new AppError('Invalid Category ID. Category does not exist.', 404));

  const newProduct = await Product.create(req.body);
  res.status(201).json({ status: 'success', data: { product: newProduct } });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return next(new AppError('Product not found', 404));
  res.status(200).json({ status: 'success', data: { product } });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError('Product not found', 404));
  res.status(204).json({ status: 'success', data: null });
});