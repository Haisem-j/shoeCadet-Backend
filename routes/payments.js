const router = require('express').Router();
const stripe = require('stripe')('sk_test_51HKmaBD2ROsWPjNTOPO23YHUAC4PyXWhxr4kF9HKvkEjk5vPrMbGGjsZMWllmM1SzR1k5aIjew7ANwgcUaDzGLFf00yX8AJ23M');
const dotenv = require('dotenv');

dotenv.config();

router.post('/pay', async (req,res) =>{
   
    console.log(req.body.shoe);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.shoe.price * 100,
        currency: 'cad',
        metadata: {integration_check: 'accept_a_payment'},
        receipt_email: req.body.email
    });
    res.json({'client_secret': paymentIntent['client_secret']})

})

module.exports = router;
