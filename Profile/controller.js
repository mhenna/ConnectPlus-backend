const Service = require('./service');
const UserService = require('../User/service')
module.exports = {
    addProfile: async (req, res) => {
        try {
            if (!req.body.profile.name || !req.body.profile.address || !req.body.profile.phoneNumber || !req.body.userId)
                return res.status(400).send({ message: "Missing parameter!" })

            let profile = await Service.save(req.body.profile)
            let user = await UserService.addProfileToUser(req.body.userId, profile._id)

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
            return res.status(200).send({ profile: updatedProfile, message: "Profile updated" })
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
