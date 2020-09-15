const nodemailer = require('nodemailer');
const mime = require('mime-types');
const mongoose = require('mongoose');
const cron = require('node-cron');
const OTP = require('otp-generator');
const UserService = require('./User/service');
const RRule= require('rrule').RRule

function getActivityDates(recurrence, day ,startDate, endDate) {
    var rule;
    if(recurrence == 'daily')
      {
         rule = new RRule({
            freq: RRule.DAILY,
            dtstart: new Date(startDate),
            until: new Date(endDate)
        }).all()

      }else if(recurrence == 'weekly' || recurrence=='biweekly')
       {
         rule = new RRule({
            freq: RRule.WEEKLY,
            interval: recurrence == 'biweekly'? 2 : 1,
            byweekday: day,
            dtstart: new Date(startDate),
            until: new Date(endDate)
        }).all()

    }else if(recurrence =='monthly')
    {
         rule = new RRule({
            freq: RRule.MONTHLY,
            interval: 1,
            bymonthday: day,
            dtstart: new Date(startDate),
            until: new Date(endDate)
        }).all()
    }else{
        throw ('Recurrence Mismatch');
    }
       
        rule.forEach(function(item, index, array){
            array[index] = item.toISOString();
       });

        return rule;
    }

function sendEmail(to, subject, body) {
    /*Body format
            {
            "To": "",
            "subject": "",
            "message": ""
        }*/
    let transport = nodemailer.createTransport({
        host: 'smtp.googlemail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.smtpUser,
            pass: process.env.smtpPass
        }
    });

    const message = {
        from: 'Connect+', // Sender address
        to: to,         // List of recipients
        subject: subject, // Subject line
        text: body // Plain text body
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            throw (err);
        } else {
            console.log(info);
        }
    });
}

function uploadFile(bucket, file, filename, extension, onFinish) {
    const writestream = bucket.openUploadStream(filename, {
        mode: 'w',
        contentType: mime.lookup(extension)
    });

    writestream
        .on('finish', (f) => { onFinish(f) })
        .on('error', (err) => { throw ({ status: 500, message: "Error uploading files " + err }) });

    writestream.write(file.data);
    writestream.end();
}

function retrieveFile(bucket, id, onFinish) {
    try {
        const readstream = bucket.openDownloadStream(new mongoose.mongo.ObjectID(id));
        readstream.on('error', (err) => { throw ({ status: 500, message: "Error uploading files " + err }) });

        const buffer = [];
        readstream
            .on('data', (chunk) => {
                buffer.push(chunk)
            });

        readstream
            .on('end', async () => {
                let metadata = await getFileMetadata(bucket, id);
                const fullBuffer = Buffer.concat(buffer);
                const base64 = fullBuffer.toString('base64');
                onFinish(base64, metadata);
            });
    } catch (err) {
        console.log(err)
        throw ({ status: 500, message: err });
    }
}

function deleteFile(bucket, id) {
    try {
        bucket.delete(new mongoose.mongo.ObjectID(id));
        return true;
    } catch (err) {
        return false;
    }
}

async function getFileMetadata(bucket, id) {
    let files = await bucket.find({ _id: new mongoose.mongo.ObjectID(id) }).toArray();
    return files[0];
}

function scheduleEventStatusUpdates(hour, minute) {
    const EventService = require('./Event/service');
    cron.schedule(`00 ${minute} ${hour} * * 0-6`, async () => {
        let events = await EventService.getEventsWithoutPosters();
        let date = new Date().toISOString();
        events.forEach(async event => {
            let start = event.startDate.toISOString();
            let end = event.endDate.toISOString();
            if (date >= start && date <= end)
                await event.updateOne({ status: 'Active' })
            else if (date > end)
                await event.updateOne({ status: 'Ended' })
            else
                await event.updateOne({ status: 'Scheduled' })
        })
    }, { timezone: 'Africa/Cairo' });
}

function sendScheduledOTP(hour, minute) {
    //cronjob exp to send OTP at 00:00 on day-of-month 1 in every 3rd month."
    cron.schedule(`${minute} ${hour} 1 */3 *`, async () => {
        let users = await UserService.getAllUsers();
        users.forEach(async user => {
            await user.updateOne({ verified: false });
            let otp = OTP.generate(6, { digits: true, alphabets: true, upperCase: true, specialChars: true });
            await user.updateOne({ code: otp });
            sendEmail(user.email, 'Verify Registration',
                `Hello ${user.name},\n
                Please click on the following link to verify your email.\n
                Here is your verification code: ${otp}
                ${process.env.verificationURL}/${user.email}/${otp}`);
        })
    }, { timezone: 'Africa/Cairo' });
}

module.exports = {
    sendEmail,
    uploadFile,
    retrieveFile,
    deleteFile,
    scheduleEventStatusUpdates,
    sendScheduledOTP,
    getActivityDates
}