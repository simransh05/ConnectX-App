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
    message: {
        type: String,
        require: true
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

module.exports = new mongoose.model('Message', messageSchema)