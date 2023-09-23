const express=require('express');
const { createProduct, updateProduct ,deleteProduct, singleProductDetails, authenticateuser, createProductRewies, getAllReviews, getAllProduct, deleteReviews} = require('../controller/proudct');
const {isAuthenticatedUser,authoriseUserRole} = require('../middleware/authication');
const passport = require('passport');

// using passport js authentication
// const { isathorise } = require('../controller/passport');

const router=express.Router();
router.route('/products').get(getAllProduct)
router.route('/product/new').post(isAuthenticatedUser,authoriseUserRole('admin'),createProduct)
router.route('/product/:id').patch(isAuthenticatedUser,authoriseUserRole('admin'),updateProduct).get(singleProductDetails)
router.route('/products/delete/product/:id').delete(isAuthenticatedUser,authoriseUserRole('admin'),deleteProduct)
router.route('/product/reviews/:id').put(isAuthenticatedUser,createProductRewies)
router.route('/reviews/:id').get(getAllReviews).delete(deleteReviews)

module.exports =router