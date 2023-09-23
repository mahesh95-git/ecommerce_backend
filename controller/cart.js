const { asyncErrorHandler } = require("../middleware/asyncErrorHandler");
const { cart } = require("../model/cart");
const Errorhandler = require("../util/errorhandler");
const addProductToCart = asyncErrorHandler(async (req, res, next) => {
  const product = {
    productId: req.body.productId,
    productQuantity: req.body.productQuantity,
  };
  const Cart = await cart.findOne({ userId: req.User._id });
  if (Cart) {
    Cart.cratItem.push(product);
    Cart.save();
  } else {
    await cart.create({
      userId: req.User._id,
      cratItem: product,
    });
  }

  res.status(201).json({
    success: true,
    message: "Added to the cart",
  });
});

const getAllcartItem = asyncErrorHandler(async (req, res, next) => {
  const Product = await cart
    .findOne({ userId: req.User._id }, { _id: 0, userId: 0 })
    .populate("cratItem.productId");
  if (!Product) {
    return next(new Errorhandler("your cart is empty", 201));
  }
  res.status(201).json({ success: true, data: Product });
});

const detletCartItem = asyncErrorHandler(async (req, res, next) => {
  await cart.updateOne(
    { userId: req.User._id },
    {
      $pull: {
        cratItem: {
          productId: req.params.id,
        },
      },
    }
  );

  res.status(201).json({
    success: true,
    message: "product succefully delete ",
  });
});
const updateProductQuantity = asyncErrorHandler(async (req, res, next) => {
  const product = await cart.findOne({ userId: req.User._id });
  for (let i = 0; i < req.body.length; i++) {
    for (let j = 0; j < product.cratItem.length; j++) {
      if (product.cratItem[j].productId == req.body[i].productId) {
        product.cratItem[j].productQuantity = req.body[i].productQuantity;
      }
    }
  }
  await product.save();

  res.status(201).json({
    success: true,
    message:"you've change product quantity succefully"
  });
});

module.exports = {
  addProductToCart,
  getAllcartItem,
  detletCartItem,
  updateProductQuantity,
};
