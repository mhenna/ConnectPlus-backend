const Service = require('./service');
const Utils=require('../utils');


module.exports = {
    addActivity: async (req, res) => {
        try {
            if (!req.body.name || !req.body.startDate || !req.body.endDate || !req.body.recurrence || !req.body.venue)
                   res.status(400).send({ message: "Missing parameter!" })

            var sDate=new Date(req.body.startDate)
            var eDate=new Date(req.body.endDate)
            var sDay=sDate.getDay()
            let extension = JSON.parse(JSON.stringify(req.body.extension));
            delete req.body.extension;

            var activityDates=Utils.getActivityDates(req.body.recurrence , sDay , sDate, eDate )
            
            let activity = await Service.save(req.body,activityDates)

            let poster;

            try {
                poster = await Service.uploadPoster(req.files.poster, req.body.name, extension);
            } catch (err) {
                throw (err);
            }

            activity = await Service.addPosterToActivity(activity._id, poster._id);

            return res.status(200).send({ activity: activity })
    
            } catch (err) {
                if (err.status)
                    res.status(err.status).send(err.message);
                else
                    res.status(500).send(`Unexpected error occured: ${err}`);
            }  
    },

    getActivities: async (req, res) => {
        try {
            let activities = await Service.getActivities();
            res.status(200).send(activities);
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
    getActivity: async (req, res) => {
        try {
            if (!req.params.name)
                res.status(400).send({ message: "Missing parameter!" })

            let activity = await Service.findByName(req.params.name);
            let poster = await Service.retrievePoster(activity.poster);
            res.status(200).send({ activity: activity, poster: poster  });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    getRecentActivities: async (req, res) => {
        try {
            let activities = await Service.getFourRecentActivities();
            res.status(200).send(activities);
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
}