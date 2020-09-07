const Service = require('./service');

module.exports = {
    addEvent: async (req, res) => {
        try {
            let extension = JSON.parse(JSON.stringify(req.body.extension));
            delete req.body.extension;
            let event, poster;
            try {
                event = await Service.save(req.body);
            } catch (err) {
                throw (err);
            }

            try {
                poster = await Service.uploadPoster(req.files.poster, req.body.name, extension);
            } catch (err) {
                throw (err);
            }

            event = await Service.addPosterToEvent(event._id, poster._id);

            res.status(200).send({ event: event, status: "OK" });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    getEvents: async (req, res) => {
        try {
            let events = await Service.getEvents();
            res.status(200).send(events);
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    getEventsByERG: async (req, res) => {
        try {
            let events = await Service.findByERG(req.params.erg);
            res.status(200).send(events);
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },
    
    getRecentEvents: async (req, res) => {
        try {
            let events = await Service.getFourRecentEvents();
            res.status(200).send(events);
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

    getEvent: async (req, res) => {
        try {
            if (!req.params.name)
                res.status(400).send({ message: "Missing parameter!" })

            let event = await Service.findByName(req.params.name);
            console.log(event);
            let poster = await Service.retrievePoster(event.poster);
            res.status(200).send({ event: event, poster: poster });
        } catch (err) {
            if (err.status)
                res.status(err.status).send(err.message);
            else
                res.status(500).send(`Unexpected error occured: ${err}`);
        }
    },

}