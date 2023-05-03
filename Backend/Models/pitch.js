const mongoose = require("mongoose");

const pitchSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    enterpreneur: {
        type: String,
        required: true
    },
    pitchTitle: {
        type: String,
        required: true
    },
    pitchIdea: {
        type: String,
        required: true
    },
    askAmount: {
        type: Number,
        required: true
    },
    equity: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    ceatedAt: Date,
    offer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    }]
});

const Pitch = mongoose.model('Pitch', pitchSchema);
module.exports = {Pitch};