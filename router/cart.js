const express = require("express");
const {
  addProductToCart,
  getAllcartItem,
  detletCartItem,
  updateProductQuantity,
} = require("../controller/cart");
const { isAuthenticatedUser } = require("../middleware/authication");
const router = express.Router();
router.route("/cart/addProudct").put(isAuthenticatedUser, addProductToCart);
router.route("/cart/allItmes").get(isAuthenticatedUser, getAllcartItem);
router
  .route("/cart/deleteItme/:id")
  .delete(isAuthenticatedUser, detletCartItem);
router.route("/cat/update").put(isAuthenticatedUser, updateProductQuantity);

module.exports = router;
