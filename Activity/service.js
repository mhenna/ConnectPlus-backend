const mongoose = require('mongoose');
require('./ActivityModel');
const Activity = mongoose.model('Activity');


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

async function getActivities() {
    let activities = await Activity.find();
    return activities;
}

module.exports = {
    save,
    getActivities
}