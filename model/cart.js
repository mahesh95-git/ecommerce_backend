const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  cratItem: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true,
      },
      productQuantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
exports.cart=mongoose.model('cart',cartSchema)

