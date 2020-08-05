const Service = require('./service');

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
    }
}