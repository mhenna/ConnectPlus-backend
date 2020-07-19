const Service = require('./service');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {

    login: async (req, res) => {
        try {
            const user = await Service.findByEmailAndPassword(req.body.email, req.body.password)
            delete user._doc.password;
            var token = jwt.sign({ user: user, role: 'user' }, config.secret, { expiresIn: '1h' })
            res.status(200).send({ "user": user, "token": token, "status": "OK" });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    register: async (req, res) => {
        try {
            let user = await Service.save(req.body);
            delete user._doc['password'];
            res.status(200).send({ user: user });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    }
}