const nodemailer = require('nodemailer');
const mime = require('mime-types');
const mongoose = require('mongoose');

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

module.exports = {
    sendEmail,
    uploadFile,
    retrieveFile,
    deleteFile
}