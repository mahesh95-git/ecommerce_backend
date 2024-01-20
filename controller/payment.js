
const stripe=require("stripe")("sk_test_51OVWObSDiFyOgTd92mGXZJxD3WOLR0TPMmFagDTv4aISKBbkzXIfdoOVZUQb5DnVJEmWShhf5djCXOBXSIg3qbGD008uQETdmS")
exports.createPaymentIntent=async(req,res,next)=>{
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: '{{PRICE_ID}}',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:8080/api/movies`,
        cancel_url: `http://localhost:8080/api/`,
      });
    
      res.redirect(303, session.url);
}
exports.confirmPayment = async (req, res, next) => {
    const {paymentIntentId,paymentMethodId}=req.body
    const paymentIntent=await stripe.paymentIntent.confirm(paymentIntentId,{
        payment_method:paymentMethodId
    })
    res.send({
        paymentIntent
    })
}
