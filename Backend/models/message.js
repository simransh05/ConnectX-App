const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sendBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sendTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        require: true
    },
    sendAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model('Message', messageSchema)