const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const product = require("../models/product");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// routes/order.js
router.post("/buy/:productId", isLoggedIn, wrapAsync(async (req, res) => {
  const { productId } = req.params;
  const Product = await product.findById(productId);
  const quantity = parseInt(req.body.quantity || 1);
  const totalPrice = Product.price * quantity;

  const newOrder = new Order({
    buyer: req.user._id,
    products: [{ product: productId, quantity }],
    totalPrice,
  });

  await newOrder.save();
  req.flash("success", "Order placed successfully!");
  res.render("order/order");
}));

router.get("/myorders", isLoggedIn, wrapAsync(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).populate("products.product");
  res.render("order/order", { orders });
}));

module.exports = router;