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
        required: true,
        unique: true
    },
    discount: {
        type: String,
        required: true,
    },
    logo: {
        type: mongoose.Schema.Types.ObjectId,
    },
    attachment: {
        type: mongoose.Schema.Types.ObjectId,
    },
},
    {
        timestamps: {
            createdAt: "createdAt"
        }
    });

module.export = mongoose.model('Offer', OfferSchema).init()
