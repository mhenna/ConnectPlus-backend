const Service = require('./service');
const jwt = require('jsonwebtoken');
const config = require('../config');
const Utils = require('../utils');
const OTP = require('otp-generator');

module.exports = {

    login: async (req, res) => {
        try {
            const user = await Service.findByEmailAndPassword(req.body.email, req.body.password)
            delete user._doc.password;
            delete user._doc.code;
            if (user.verified) {
                var token = jwt.sign({ user: user, role: 'user' }, config.secret, { expiresIn: '1h' })
                res.status(200).send({ "user": user, "token": token, "status": "OK" });
            } else
                throw ({ status: 409, message: 'Your email has not been verified yet. Please verify your email and retry logging in.' })
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
            delete user._doc.password;
            let otp = OTP.generate(6, { digits: true, alphabets: true, upperCase: true, specialChars: true });
            await user.updateOne({ code: otp });
            Utils.sendEmail(user.email, 'Verify Registration',
                `Hello ${user.name},\n
                Please click on the following link to verify your email.\n
                Here is your verification code: ${otp}
                ${process.env.verificationURL}/${user.email}/${otp}`);
            res.status(200).send({ user: user });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    verifyEmail: async (req, res) => {
        try {
            let user = await Service.findByEmail(req.params.email);
            await Service.verifyEmail(req.body.code);
            res.status(200).send({ message: 'Email verified' });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
}