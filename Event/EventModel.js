const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    ERG: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ERG",
        required:true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Scheduled'
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

module.export = mongoose.model('Event', EventSchema).init()