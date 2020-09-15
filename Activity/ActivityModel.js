const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    recurrence: {
        type: String,
        required: true
    },
    recurrenceDates:[{
        type: Date,
        required: true
    }],
    venue: {
        type: String,
        required: true
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

module.export = mongoose.model('Activity', ActivitySchema).init()