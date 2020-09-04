const mongoose = require('mongoose');
const { connection } = require('../database')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        max: 15

    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    }
})





module.exports = connection.model("User", userSchema);
