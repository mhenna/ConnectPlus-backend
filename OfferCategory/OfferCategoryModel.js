const mongoose = require('mongoose');

const OfferCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    }]
});

module.export = mongoose.model('OfferCategory', OfferCategorySchema).init()