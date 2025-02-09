const review = require("../models/review");
const express = require("express");
const product = require("../models/product");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");

// rating
router.post("", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let reviewProduct = await product.findById(id).populate("reviews");
    let newReview = new review(req.body.review);
  
    reviewProduct.reviews.push(newReview);
  
    await reviewProduct.save();
    await newReview.save();
  
    res.redirect(`/products/${id}`);
  }));
  
  // review delete route
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let deleteReview = await review.findByIdAndDelete(reviewId);
    deleteObjId = await product.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    res.redirect(`/products/${id}`);
  }));

  module.exports = router;