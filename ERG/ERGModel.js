const mongoose = require('mongoose');

const ERGSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    color:{
        type: String,
        required: true
    }
});

module.export = mongoose.model('ERG', ERGSchema).init()