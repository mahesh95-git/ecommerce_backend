const Order = require("../model/order");
const { asyncErrorHandler } = require("../middleware/asyncErrorHandler");
const { product } = require("../model/product");
const Errorhandler = require("../util/errorhandler");
const order = require("../model/order");

const newOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo } = req.body;
  const a = { ...paymentInfo, paidAt: Date.now() };
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo: a,
    user: req.User.id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//user
const getSingleOrder = asyncErrorHandler(async (req, res, next) => {
  console.log(req.params.id);
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("No such order found", 404));
  }
  res.status(201).json({ success: true, data: order });
});

//user
const getMayOrder = asyncErrorHandler(async (req, res, next) => {
  console.log("hello");
  const order = await Order.find({ user: req.User._id });
  res.status(201).json({ success: true, data: order });
});

//admin get all order
const getAllOrder = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.paymentInfo.totalPrice;
  });

  res
    .status(201)
    .json({ success: true, data: orders, totalPrice: totalAmount });
});

//update order status admin
const updateOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.paymentInfo.orederStatus === "Delivered") {
    return next(new Errorhandler("You have already deliverd this order"));
  }
  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  order.paymentInfo.orederStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.paymentInfo.delivereAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(201).json({ success: true, data: order });
});
//delete order
const deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findOneAndRemove(req.params.id);
  if (!order) {
    return next(new Errorhandler("No such order found", 404));
  }
  res.status(201).json({ success: true, message: "order succefully deleted" });
});

async function updateStock(id, quantity) {
  const Product = await product.findById(id);
  Product.stock -= quantity;
  await Product.save({ validateBeforeSave: false });
}
module.exports = {
  getMayOrder,
  newOrder,
  getSingleOrder,
  getAllOrder,
  deleteOrder,
  updateOrder,
};
