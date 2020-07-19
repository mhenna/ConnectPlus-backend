const nodemailer = require('nodemailer');

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

module.exports = {
    sendEmail
}