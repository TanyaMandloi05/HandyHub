const express = require("express");
const router = express.Router();
const product = require("../models/product");
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const { isLoggedIn } = require("../middleware");
const { storage } = require("../cloudConfig")
const upload = multer({storage});

router.get("" , isLoggedIn, wrapAsync(async(req, res) => {
    res.render("product/sell");
}));

router.post(
  "/products/add",
  isLoggedIn, // optional: protect route
  upload.single("ProductImage"),
  wrapAsync(async (req, res) => {
    const { title, actualPrice, category, mfg, description } = req.body;

    const oldPrice = parseFloat(actualPrice);
    const price = parseFloat((oldPrice * 1.2).toFixed(2));

    const newProduct = new product({
      title,
      image: req.file?.path || "", // fallback if no image
      oldPrice,
      price,
      sellerId: req.user._id, // assuming logged-in user
      category,
      mfg,
      description,
    });

    await newProduct.save();
    req.flash("success", "Product added successfully!");
    res.redirect("/products");
  })
);

module.exports = router;