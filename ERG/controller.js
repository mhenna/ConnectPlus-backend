const Service = require('./service');

module.exports = {
    addERG: async (req, res) => {
        try {
            erg = await Service.save(req.body)
            res.status(200).send({ ERG: erg, status: "OK" });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
    getERG: async (req, res) => {
        try {
            erg = await Service.findByName(req.params.name)
            res.status(200).send({ ERG: erg, status: "OK" });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
    getERGs: async (req, res) => {
        try {
            erg = await Service.findAll()
            res.status(200).send({ ERG: erg, status: "OK" });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    }
}