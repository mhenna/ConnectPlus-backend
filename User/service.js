const mongoose = require('mongoose');
require('./UserModel');
const User = mongoose.model('User');

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

module.exports = {
    findByEmailAndPassword
}