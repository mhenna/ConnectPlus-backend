var express = require('express');
var app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();
const expressjwt = require('express-jwt');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const config = require('./config');
const port = process.env.PORT;
const userPath = require('./User/router');
const offerPath = require('./Offer/router');
const offerCategoryPath = require('./OfferCategory/router');
const eventPath = require("./Event/router");
const profilePath = require("./Profile/router")
const Utils = require('./utils');

app.use(bodyParser.json({ limit: '160mb', extended: true }));
app.use(fileUpload());
app.use(cors());
app.use(expressjwt({ secret: config.secret, algorithms: ['HS256'] }).unless({ path: config.publicRoutes }));
app.use('/user', userPath);
app.use('/offers', offerPath);
app.use('/offerCategories', offerCategoryPath)
app.use('/event', eventPath);
app.use('/profile', profilePath)

Utils.scheduleEventStatusUpdates(12, 09)

app.use(function (err, req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ message: 'Unauthorized' });
        return
    }
    next();
});

// Start running the server
app.listen(port, function () {
    console.log(`Server listening on 'http://localhost:${port}'.`);
});

Utils.sendScheduledOTP(19, 30);

process.once('SIGUSR2', function () {
    server.close(function () {
        process.kill(process.pid, 'SIGUSR2')
    })
})

module.exports = (async function () {
    let conn = await mongoose.connect(process.env.MONGO_URL,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
            if (err)
                console.log(err);
            else
                console.log('Connected to mongo database: Connect+');
        });

    let LogosBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, { bucketName: 'Logos' });
    let PostersBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, { bucketName: 'Posters' });
    let AttachmentsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, { bucketName: 'Attachments' });
    return { LogosBucket, PostersBucket, AttachmentsBucket };
})();
