const mongoose = require('mongoose');
require('./ProfileModel');
const Profile = mongoose.model('Profile');

async function save(p) {
    try {
        let profile = new Profile(p);
        await profile.save();
        return profile
    } catch (err) {
        throw (err);
    }
}

async function editProfile(phoneNumber, p) {
    try {
        let updateP = await Profile.replaceOne({ phoneNumber: phoneNumber }, p);
        if (!updateP)
            throw ({ status: 404, message: 'Profile not found' })
        return updateP;
    } catch (err) {
        throw (err);
    }
}

async function getProfile(phoneNumber) {
    try {
        let profile = await Profile.findOne({ phoneNumber: phoneNumber })
        if (!profile)
            throw ({ status: 404, message: 'Profile not found' })
        return profile;
    } catch (err) {
        throw (err);
    }
}

module.exports = {
    save,
    editProfile,
    getProfile
}