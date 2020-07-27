const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: validator
    },
    password: {
        type: String,
        required: true
    },
    passwordResetToken: {
        type: String,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    code: {
        type: String,
    }
});


function validator(v) {
    return /^[^@\s]+@(dell.com)|(emc.com)$/.test(v);
};

UserSchema.plugin(beautifyUnique)
module.export = mongoose.model('User', UserSchema).init()