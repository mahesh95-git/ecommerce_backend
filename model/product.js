const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Proudct Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Proudct description"],
  },
  price: {
    type: Number,
    required: [true, "please Enter Product Price"],
    maxlength: [10, "Price Cannot excced 10 character"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  category: {
    type: String,
    required: [true, "Please Select Category"],
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Review User Id is Required"],
      },

      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

exports.product = mongoose.model("product", productschema);
