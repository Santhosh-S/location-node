const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    'user_name': String,
    'user_mobile': Number,
    'user_email':String,
    'password': String,
    'latitude':Number,
    'longitude':Number,
    'location_last_update': Date,
    'access_type': { type: String, enum: ['admin', 'normal_user'] },
    'created_date': {
        type: Date,
        default: Date.now()
    }
}, { collection: 'User' });


module.exports = mongoose.model('User', user);