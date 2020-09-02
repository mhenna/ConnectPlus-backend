const Service = require('./service');
module.exports = {
    addProfile: async (req, res) => {
        try {
            if (!req.body.name || !req.body.address || !req.body.phoneNumber)
                return res.status(400).send({ message: "Missing parameter!" })

            let profile = await Service.save(req.body)

            return res.status(200).send({ Profile: profile })

        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
    editProfile: async (req, res) => {
        try {
            if (!req.body.phoneNumber || !req.body.profile)
                return res.status(400).send({ message: "Missing parameter!" })

            let updatedProfile = await Service.editProfile(req.body.phoneNumber, req.body.profile)
            return res.status(200).send({ message: "Profile updated" })
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
    getProfile: async (req, res) => {
        try {
            if (!req.params.phoneNumber)
                return res.status(400).send({ message: "Missing parameter!" })

            let profile = await Service.getProfile(req.params.phoneNumber)
            return res.status(200).send({ Profile: profile })

        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    }
}
