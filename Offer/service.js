const mongoose = require('mongoose');
require('./OfferModel');
const Offer = mongoose.model('Offer');

async function save(offer) {
    try {
        let o = new Offer(offer);
        await o.save();
        return o;
    } catch (err) {
        throw (err);
    }
}

async function findByName(name) {
    try {
        let offer = await Offer.findOne({ name: name });
        if (!offer)
            throw ({ status: 404, message: 'Offer not found' })
        return offer;
    } catch (err) {
        throw (err);
    }
}

module.exports = {
    save,
    findByName
}