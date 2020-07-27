const mongoose = require('mongoose');
require('./UserModel');
const User = mongoose.model('User');

async function save(user) {
    try {
        let u = new User(user);
        await u.save();
        return u;
    } catch (err) {
        throw (err);
    }
}

async function findByEmailAndPassword(email, password) {
    try {
        let user = await User.findOne({ email: email, password: password });
        if (!user)
            throw ({ status: 404, message: 'User not found' })
        return user;
    } catch (err) {
        throw (err);
    }
}

async function findByEmail(email) {
    try {
        let user = await User.findOne({ email: email });
        if (!user)
            throw ({ status: 404, message: 'User not found' })
        return user;
    } catch (err) {
        throw (err);
    }
}

async function verifyEmail(code) {
    try {
        let user = await User.updateOne({ code: code }, { $set: { verified: true } }, { new: true });
        if (!user)
            throw ({ status: 404, message: 'User with this email does not exist' });
        return user;
    } catch (err) {
        throw (err);
    }
}

module.exports = {
    save,
    findByEmailAndPassword,
    findByEmail,
    verifyEmail
}