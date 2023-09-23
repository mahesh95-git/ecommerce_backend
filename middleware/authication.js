const jwt = require("jsonwebtoken");
const { user } = require("../model/user");
const Errorhandler = require("../util/errorhandler");
const { asyncErrorHandler } = require("../middleware/asyncErrorHandler");
exports.isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new Errorhandler("Please Login"));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.User = await user.findById(decodedData.id);
  next();
});
exports.authoriseUserRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.User.role)) {
      return next(
        new Errorhandler(
          "You are not authorised user  to perform this action",
          402
        )
      );
    }
    next();
  };
};
