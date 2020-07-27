const Service = require('./service');
module.exports = {

    addOfferCategory: async (req, res) => {
        try {
            if (!req.body.name)
                res.status(400).send({ message: "Missing parameter!" })

            let offerCat = await Service.save(req.body)
            res.status(200).send({ offerCategory: offerCat, status: "OK" });

        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
    getAllCategories: async (req, res) => {
        try {
            let categories = await Service.findAll()
            res.status(200).send({ offerCategories: categories, status: "OK" });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
    getOfferCategory: async (req, res) => {
        try {
            if (!req.params.name)
                res.status(400).send({ message: "Missing parameter!" })

            let offerCat = await Service.findByName(req.params.name)
            res.status(200).send({ offerCategory: offerCat });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    }
}