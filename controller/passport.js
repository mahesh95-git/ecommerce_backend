const Errorhandler = require("../util/errorhandler");
exports.isathorise = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: "please login " });
};
exports.logoutuser = (req, res, next) => {
  req.logout((err) => {
    if (!err) {
      return res
        .status(201)
        .json({ success: true, message: "success full logout" });
    }
    return next(new Errorhandler("interanl server errror", 501));
  });
};
