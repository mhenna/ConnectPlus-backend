const mongoose = require('mongoose');
require('./OfferModel');
const Offer = mongoose.model('Offer');
const Utils = require('../utils');

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

async function uploadLogo(file, filename, extension) {
    const { LogosBucket } = await require('../app');

    let x = new Promise((resolve, reject) => {
        Utils.uploadFile(LogosBucket, file, filename, extension, function onFinish(f) {
            resolve(f);
        })
    });
    
    let logoData = await Promise.resolve(x);
    return logoData;
}


async function retrieveLogo(id) {
    const { LogosBucket } = await require('../app');

    let x = new Promise((resolve, reject) => {
        Utils.retrieveFile(LogosBucket, id, function onFinish(f, metadata) {
            let file = { metadata: metadata, fileData: f };
            resolve(file);
        });
    })
    let logo = await Promise.resolve(x);
    return logo;
}

module.exports = {
    save,
    findByName,
    uploadLogo,
    retrieveLogo,
}