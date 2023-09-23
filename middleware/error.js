const Errorhandler = require("../util/errorhandler");
const errorhandl = (err, rep, res, next) => {
  err.message = err.message || "internale server error";
  err.statusCode = err.statusCode || 500;
  if (err.name === "CastError") {
    const message = `Resource not found Invalid:${err.path}`;
    err = new Errorhandler(message, 400);
  }

  if (err.code === 11000) {
    const message = "email allready used this website";
    err = new Errorhandler(message, 400);
  }
  if (err.name === "jsonWebTokenError") {
    const message = "Json web Token is invalid ,try again";
    err = new Errorhandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = "json web token is Expired ,try again";
    err = new Errorhandler(message, 400);
  }
  res.status(err.statusCode).json({ success: false, message: err.message });
};

module.exports = errorhandl;
