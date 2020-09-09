const mongoose = require('mongoose');
require('./ERGModel');
const ERG = mongoose.model('ERG');
const Utils = require('../utils');

async function save(erg) {
    try {
        let e = new ERG(erg);
        await e.save();
        return e;
    } catch (err) {
        throw (err);
    }
}

async function findByName(name) {
    try {
        let erg = await ERG.findOne({ name: name });
        if (!erg)
            throw ({ status: 404, message: 'ERG not found' })
        return erg;
    } catch (err) {
        throw (err);
    }
}

async function findAll() {
    try {
        let erg = await ERG.find({});
        if (!erg)
            throw ({ status: 404, message: 'ERG not found' })
        return erg;
    } catch (err) {
        throw (err);
    }
}
module.exports = {
    save,
    findByName,
    findAll
}
