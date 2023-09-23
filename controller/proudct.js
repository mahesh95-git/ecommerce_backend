const { asyncErrorHandler } = require("../middleware/asyncErrorHandler");
const { product } = require("../model/product");
const apiFeatures = require("../util/apifeature");
const Errorhandler = require("../util/errorhandler");
//create new  product
const createProduct = asyncErrorHandler(async (req, res) => {
  req.body.user=req.User._id
  const Product = await product.create(req.body);
  
  Product.save();
  res.json({ success: true, Product });
});

// get all Product
const getAllProduct = asyncErrorHandler(async (req, res) => {
  const page = 10;
  const apifeatures = new apiFeatures(product.find(), req.query)
    .search()
    .pagination()
    .filter()
    .bypricesort();
  const Product = await apifeatures.query;
  if (!Product || !Product[0]) {
    return next(new Errorhandler("product not found", 401));
  }
  return res.status(200).json(Product);
});

//product details
const singleProductDetails = asyncErrorHandler(async (req, res, next) => {
  const productdetails = await product.findById(req.params["id"]);
  if (!productdetails) {
    return next(new Errorhandler("product not found", 401));
  }
  return res.status(200).json({ success: true, productdetails });
});

//update product

const updateProduct = asyncErrorHandler(async (req, res) => {
  let result = await product.findByIdAndUpdate(
    { _id: req.params["id"] },
    req.body,
    { new: true }
  );
  if (!result) {
    return next(new Errorhandler("product not found", 401));
  }

  return res
    .status(200)
    .json({ success: true, message: "product successfully updated" });
});

// delete product
const deleteProduct = asyncErrorHandler(async (req, res) => {
  let deleted = await product.deleteOne({ _id: req.params["id"] });
  if (deleted.deletedCount === 0) {
    return next(new Errorhandler("product not found", 401));
  }
  return res
    .status(200)
    .json({ success: true, message: "product successfully delete" });
});

const createProductRewies = asyncErrorHandler(async (req, res) => {
  console.log(req.params.id)
  const { comment, rating } = req.body;
  const review = {
    userId: req.User._id,
    name: req.User.name,
    rating: Number(rating),
    comment,
  };
  const Product = await product.findOne({ _id: req.params.id });
  const isrewies = Product.reviews.find((rev) => {
    return rev.userId.toString() === req.User.id;
  });

  if (isrewies) {
    Product.reviews.forEach((rev) => {
      if (rev.userId.toString() === req.User.id) {
        rev.comment = review.comment;
        rev.rating = review.rating;
      }
    });
  } else {
    Product.reviews.push(review);
    //add to the array of reviews for this particular product
  }
  Product.numOfReviews = Product.reviews.length;
  let avg = 0;
  Product.reviews.forEach((rev) => {
    return (avg += rev.rating);
  });

  Product.ratings = avg / Product.reviews.length;
  await Product.save();
  res.status(201).json({ success: true, message: "Review Added succefully" });
});

const getAllReviews = asyncErrorHandler(async (req, res, next) => {
  const Product = await product.findById(req.params.id);
  if (!Product) {
    return next(new Errorhandler("product not found", 401));
  }
  res.status(201).json({ success: true, data: Product.reviews });
});
const deleteReviews = asyncErrorHandler(async (req, res, next) => {
  
  const Product = await product.findById(req.params.id);
  if (!Product) {
    return next(new Errorhandler("product not found", 401));
  }

  const reviews = Product.reviews.filter((value) => {
    return value._id.toString() !== req.query.id;
  });
 
  Product.numOfReviews = Product.reviews.length;

  let avg = 0;
  Product.reviews.forEach((rev) => {
    return (avg += rev.rating);
  });

  Product.ratings = avg / Product.reviews.length;
  Product.reviews=reviews
  await Product.save()
  res.status(201).json({success:true,message:'Review succefylly deleted'})

});

module.exports = {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  singleProductDetails,
  createProductRewies,
  getAllReviews,
  deleteReviews
};
