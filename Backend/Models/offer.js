const mongoose = require("mongoose");

const offerShmema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    investor: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    equity: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    comment: {
        type: String,
        required: true
    }
});

const Offer = mongoose.model('Offer', offerShmema);
module.exports = {Offer};