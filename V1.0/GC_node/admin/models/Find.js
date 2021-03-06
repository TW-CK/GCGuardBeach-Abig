const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const FindSchema = new Schema({
    nickName: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    place: {
        type: String,
        required: true
    },
    openId: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = Find = mongoose.model('finds', FindSchema);