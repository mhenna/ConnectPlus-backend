const Service = require('./service');
const CategoryService = require('../OfferCategory/service');
const utils = require('../utils');
const service = require('../OfferCategory/service');

module.exports = {

    addOffer: async (req, res) => {
        try {
            if (!req.body.name || !req.body.expiration || !req.body.location || !req.body.contact || !req.body.details)
                res.status(400).send({ message: "Missing parameter!" })

            let extension = JSON.parse(JSON.stringify(req.body.extension));
            delete req.body.extension;
            let offer, logo;
            try {
                offer = await Service.save(req.body);
            } catch (err) {
                throw (err);
            }

            try {
                logo = await Service.uploadLogo(req.files.logo, req.body.name, extension);
            } catch (err) {
                throw (err);
            }

            offer = await Service.addLogoToOffer(offer._id, logo._id);
            await CategoryService.addOfferToCategory(req.body.category, offer._id);
            res.status(200).send({ offer: offer, status: "OK" });

        } catch (err) {
            console.log(err);
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    getOffer: async (req, res) => {
        try {
            if (!req.params.name)
                res.status(400).send({ message: "Missing parameter!" })

            let offer = await Service.findByName(req.params.name);
            let logo = await Service.retrieveLogo(offer.logo);
            res.status(200).send({ offer: offer, logo: logo });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    getOffersByCategory: async (req, res) => {
        try {
            let categoryOffers = await CategoryService.findByNamePopulated(req.params.name);
            let x = categoryOffers.offers.map(async offer => {
                let logo = await Service.retrieveLogo(offer.logo);
                return { offer, logo };
            })

            let offers = await Promise.all(x);
            res.status(200).send(offers);
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    getOffers: async (req, res) => {
        try {
            let cats = await CategoryService.findAll();
            let y = cats.map(async cat => {
                let x = cat.offers.map(async offer => {
                    let logo = await Service.retrieveLogo(offer.logo);
                    offer._doc.logo = logo;
                    return offer;
                })
                await Promise.all(x);
                return cats;
            })
            await Promise.all(y);
            res.status(200).send(cats);
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    testUpload: async (req, res) => {
        let logo = await Service.uploadLogo(req.files.file, req.body.title, 'txt')
        res.status(200).send(logo);
    },

    testRetrieve: async (req, res) => {
        try {
            let logo = await Service.retrieveLogo(req.query.id);
            res.status(200).send({ logo });
        } catch (err) {
            console.log(err);
        }
    },
    getOffersNames: async (req, res) => {
        try {
            let offers = await Service.getOffersNames()
            res.status(200).send(offers);
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    }
}