const mongoose = require('mongoose');
const { connection } = require('../database');

const shoeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 4,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: [Number],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    }
})

module.exports = connection.model("Shoe", shoeSchema);