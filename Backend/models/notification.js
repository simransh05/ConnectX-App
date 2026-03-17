const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    receiver: { // is who will get 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender: { // who send
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    type: {
        type: String,
        enum: ["like", "comment", "follow", "message", "post"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7
    }
});

module.exports = new mongoose.model('Notification', notificationSchema);