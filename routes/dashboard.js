const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const product = require("../models/product");
const wishlist = require("../models/wishlist");
const { isLoggedIn } = require("../middleware");

router.get("/user/dashboard", isLoggedIn, async(req, res) => {
    const username  = req.user.username;
    const email = req.user.email;

    const productCount = await product.countDocuments({sellerId: req.user._id});
    //   const orderCount = await Order.countDocuments({ buyer: req.user._id });
    //  const User = await user.findById(req.user._id).populate("wishlist");
    //  const wishlistCount = User.wishlist.length;
     const wishlistCount = await wishlist.countDocuments({ user: req.user._id });
    const userProducts = await product.find({ sellerId: req.user._id });
     res.render("dashboard/userDashBoard", {username, email, wishlistCount, productCount, userProducts});
});

module.exports = router;



