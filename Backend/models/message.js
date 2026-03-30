const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    defaultMessage: {
        type: String
    },
    typeOfChat: {
        type: String,
        enum: ['group', 'individual'],
        default: 'individual'
    },
    message: {
        type: String
    },
    deleteBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    sendAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', messageSchema)