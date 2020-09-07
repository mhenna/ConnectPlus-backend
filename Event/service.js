const mongoose = require('mongoose');
require('./EventModel');
const Event = mongoose.model('Event');


async function save(event) {
    try {
        let e = new Event(event);
        await e.save();
        return e;
    } catch (err) {
        throw (err);
    }
}

async function findByName(name) {
    try {
        let event = await Event.findOne({ name: name });
        if (!event)
            throw ({ status: 404, message: 'Event not found' })
        return event;
    } catch (err) {
        throw (err);
    }
}

async function findByERG(ERG) {
    try {
        let events = await Event.find({ ERG: ERG });
        
        if (!events)
        throw ({ status: 404, message: 'Event not found' })

        let x = events.map(async event => {
            event._doc.poster = await retrievePoster(event.poster);
            return event;
        })
    
        await Promise.all(x);
        return events;

    } catch (err) {
        throw (err);
    }
}

async function addPosterToEvent(id, posterId) {
    try {
        let event = await Event.findByIdAndUpdate(id, { $set: { poster: posterId } }, { new: true });
        return event;
    } catch (err) {
        throw (err);
    }
}

async function uploadPoster(file, filename, extension) {
    const { PostersBucket } = await require('../app');

    let x = new Promise((resolve, reject) => {
        Utils.uploadFile(PostersBucket, file, filename, extension, function onFinish(f) {
            resolve(f);
        })
    });

    let posterData = await Promise.resolve(x);
    return posterData;
}

async function retrievePoster(id) {
    const Utils = require('../utils');
    const { PostersBucket } = await require('../app');
    let x = new Promise((resolve, reject) => {
        Utils.retrieveFile(PostersBucket, id, function onFinish(f, metadata) {
            let file = { metadata: metadata, fileData: f };
            resolve(file);
        });
    })
    let poster = await Promise.resolve(x);
    return poster;
}

async function getEvents() {
    let events = await Event.find();
    let x = events.map(async event => {
        event._doc.poster = await retrievePoster(event.poster);
        return event;
    })

    await Promise.all(x);
    return events;
}

async function getFourRecentEvents() {
    let events = await Event.find().limit(4).sort({startDate: -1});
    let x = events.map(async event => {
        event._doc.poster = await retrievePoster(event.poster);
        return event;
    })

    await Promise.all(x);
    return events;
}

async function getEventsWithoutPosters() {
    let events = await Event.find();
    return events;
}

module.exports = {
    save,
    findByName,
    findByERG,
    addPosterToEvent,
    uploadPoster,
    retrievePoster,
    getEvents,
    getFourRecentEvents,
    getEventsWithoutPosters
}