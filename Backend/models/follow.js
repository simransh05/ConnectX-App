const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    follower: { // the person who follow you
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    following: { // the person you follow
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model('Follow', followSchema)