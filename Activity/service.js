const mongoose = require('mongoose');
require('./ActivityModel');
const Activity = mongoose.model('Activity');
const Utils = require('../utils');


async function save(activity,activityDates) {
    try {
        let e = new Activity(activity);
        await e.save();
        await e.updateOne(
             {recurrenceDates : activityDates } 
         )
        return e;
    } catch (err) {
        throw (err);
    }
}
async function findByName(name) {
    try {
        let activity = await Activity.findOne({ name: name });
        if (!activity)
            throw ({ status: 404, message: 'Activity not found' })
        return activity;
    } catch (err) {
        throw (err);
    }
}

async function getActivities() {
    let activities = await (await Activity.find());
    let x = activities.map(async activity => {
        activity._doc.poster = await retrievePoster(activity.poster);
        return activity;
    })

    await Promise.all(x);
    return activities;
}

async function addPosterToActivity(id, posterId) {
    try {
        let activity = await Activity.findByIdAndUpdate(id, { $set: { poster: posterId } }, { new: true });
        return activity;
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
async function getFourRecentActivities() {
    let activities = await Activity.find().limit(4).sort({startDate: -1});
    let x = activities.map(async activity => {
        activity._doc.poster = await retrievePoster(activity.poster);
        return activity;
    })

    await Promise.all(x);
    return activities;
}
module.exports = {
    save,
    getActivities,
    findByName,
    addPosterToActivity,
    retrievePoster,
    uploadPoster,
    getFourRecentActivities

}