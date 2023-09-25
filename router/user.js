const express = require("express");
const {
  registerUser,
  loginuser,
  logout,
  forgotPassword,
  resetPassword,
  userDetail,
  updateUserDetail,
  updatePassword,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/user");
const {
  isAuthenticatedUser,
  authoriseUserRole,
} = require("../middleware/authication");
// const passport = require("passport");
// const { logoutuser } = require("../controller/passport");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginuser);
router.route("/logout").get(isAuthenticatedUser, logout);
router.route("/forgotPassword").post(isAuthenticatedUser, forgotPassword);
router.route("/password/reset/:token").put(isAuthenticatedUser, resetPassword);
router.route("/user").get(isAuthenticatedUser, userDetail);
router.route("/user/detailUpdate").put(isAuthenticatedUser, updateUserDetail);
router.route("/user/passwordUpdate").put(isAuthenticatedUser, updatePassword);
router
  .route("/user/admin/allUser")
  .get(isAuthenticatedUser, authoriseUserRole("admin"), getAllUser);
router
  .route("/user/admin/:id")
  .get(getSingleUser)
  .put(updateUserRole)
  .delete(deleteUser);
// using  passprot js authentication
// router.route("/loginpassport").post(passport.authenticate("local"));
// router.route("/logoutuser").get(logoutuser);

module.exports = router;
