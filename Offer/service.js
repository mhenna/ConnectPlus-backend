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

async function addLogoToOffer(id, logoId) {
    try {
        let offer = await Offer.findByIdAndUpdate(id, { $set: { logo: logoId } }, { new: true });
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

async function deleteLogo(id) {
    const { LogosBucket } = await require('../app');

    let x = new Promise((resolve, reject) => {
        return Utils.deleteFile(LogosBucket, id);
    })
    let y = await Promise.resolve(x);
    return y;
}

async function addAttachmentToOffer(id, attachmentId) {
    try {
        let offer = await Offer.findByIdAndUpdate(id, { $set: { attachment: attachmentId } }, { new: true });
        return offer;
    } catch (err) {
        throw (err);
    }
}

async function uploadAttachment(file, filename, extension) {
    const { AttachmentsBucket } = await require('../app');

    let x = new Promise((resolve, reject) => {
        Utils.uploadFile(AttachmentsBucket, file, filename, extension, function onFinish(f) {
            resolve(f);
        })
    });

    let attachmentData = await Promise.resolve(x);
    return attachmentData;
}

async function retrieveAttachment(id) {
    const { AttachmentsBucket } = await require('../app');

    let x = new Promise((resolve, reject) => {
        Utils.retrieveFile(AttachmentsBucket, id, function onFinish(f, metadata) {
            let file = { metadata: metadata, fileData: f };
            resolve(file);
        });
    })
    let attachment = await Promise.resolve(x);
    return attachment;
}

async function findAll() {
    let offers = await Offer.find({});
    return offers;
}

async function getOffersNames() {
    try {
        let offers = await Offer.find({}).select("name");
        return offers;
    } catch (err) {
        throw (err);
    }
}

async function getFourRecentOffers() {
    let offers = await Offer.find().limit(4).sort({createdAt: -1});
    let x = offers.map(async offer => {
        offer._doc.logo = await retrieveLogo(offer.logo);
        return offer;
    })

    await Promise.all(x);
    return offers;
}

module.exports = {
    save,
    findByName,
    uploadLogo,
    retrieveLogo,
    deleteLogo,
    addLogoToOffer,
    addAttachmentToOffer,
    uploadAttachment,
    retrieveAttachment,
    findAll,
    getOffersNames,
    getFourRecentOffers
}