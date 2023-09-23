const express = require("express");
const router = express.Router();
const {
  isAuthenticatedUser,
  authoriseUserRole,
} = require("../middleware/authication");
const {
  newOrder,
  getSingleOrder,
  getMayOrder,
  getAllOrder,
  deleteOrder,
  updateOrder,
} = require("../controller/order");
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/me").get(isAuthenticatedUser, getMayOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router
  .route("/order/admin/allOrders")
  .get(isAuthenticatedUser, authoriseUserRole("admin"), getAllOrder);
router
  .route("/order/admin/:id")
  .put(isAuthenticatedUser, authoriseUserRole("admin"), updateOrder)
  .delete(isAuthenticatedUser, authoriseUserRole("admin"), deleteOrder);

module.exports = router;
