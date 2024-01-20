const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "user",
  },

  shippingInfo: {
    address: {
      streetAddress: {
        type: String,
        required: [true, "Please Enter streetAddress"],
      },
      city: { type: String, required: [true, "Please Enter city"] },
      state: { type: String, required: [true, "Please Enter state"] },
      pinCode: { type: String, required: [true, "Please Enter pinCode"] },
      country: {
        type: String,
        required: [true, "Please Enter country"],
        default: "india",
      },
    },
    phone: {
      type: Number,
      required: [true, "Please Enter phone Number"],
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "product",
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paidAt: {
      type: Date,
      required: true,
    },
    itemPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    orederStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
    deliverdAt: Date,
    createAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
});
module.exports = mongoose.model("order", orderSchema);
