const router = require('express').Router();
const stripe = require('stripe')('sk_test_51HKmaBD2ROsWPjNTOPO23YHUAC4PyXWhxr4kF9HKvkEjk5vPrMbGGjsZMWllmM1SzR1k5aIjew7ANwgcUaDzGLFf00yX8AJ23M');

router.post('/pay', async (req,res) =>{
    const { email, price } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: price * 100,
        currency: 'cad',
        metadata: {integration_check: 'accept_a_payment'},
        receipt_email: email
    });
    res.json({'client_secret': paymentIntent['client_secret']})

})

module.exports = router;
