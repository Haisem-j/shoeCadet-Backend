const mongoose = require('mongoose');
const { connection } = require('../database');

const paymentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    unique_id: {
        type: String,
        required: true,
    }
})

module.exports = connection.model("Payment", paymentSchema);