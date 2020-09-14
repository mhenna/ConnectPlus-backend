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

            var activityDates=Utils.getActivityDates(req.body.recurrence , sDay , sDate, eDate )
            
            let activity = await Service.save(req.body,activityDates)

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
}