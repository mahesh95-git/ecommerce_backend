const express=require("express")
const { createPaymentIntent, confirmPayment } = require("../controller/payment")
const router=express.Router()
router.route('/create-payment-intent').post(createPaymentIntent)
router.route('/confirm-payment').post(confirmPayment)
module.exports=router;