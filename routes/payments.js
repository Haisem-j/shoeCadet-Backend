const router = require('express').Router();
const stripe = require('stripe')('sk_test_51HKmaBD2ROsWPjNTOPO23YHUAC4PyXWhxr4kF9HKvkEjk5vPrMbGGjsZMWllmM1SzR1k5aIjew7ANwgcUaDzGLFf00yX8AJ23M');
const nodemailer = require('nodemailer');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

//Transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/pay', async (req, res) => {

    console.log(req.body.shoe);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.shoe.price * 100,
        currency: 'cad',
        metadata: { integration_check: 'accept_a_payment' },
        receipt_email: req.body.email
    });

    let unique_id = uuidv4();
    const new_payment = new Payment({
        email: req.body.email,
        unique_id: unique_id
    })

    await new_payment.save();

    transporter.sendMail({
        from: 'shoecadet.ca@gmail.com',
        to: req.body.email,
        subject: `Purchase of ${req.body.shoe.title}`,
        text: `Thank you for your purchase of ${req.body.shoe.title}. Your order number is ${unique_id}. Go to our discord server and open a ticket. Either type in your order number or screen shot this email and send it in the ticket.
        
        Once we verify your payment, you will recieve a google form. In it you must fill in all the details of the shoe you'd like as well as other things. Once submitted wait for a response from the staff.
        
        Please note that this DOES NOT mean you are guaranteed an item. This significantly increases your chances of copping, All information submitted is confidential and will only be seen by shoecadet owner/staff.`
    }, (err, data) => {
        if (err) {
            console.log('Error occured');
        } else {
            console.log('Email sent');
        }
    })

    res.json({ 'client_secret': paymentIntent['client_secret'] })

})


module.exports = router;
