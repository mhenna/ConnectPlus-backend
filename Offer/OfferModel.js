const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

module.export = mongoose.model('Offer', OfferSchema).init()