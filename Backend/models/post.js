const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    photoVideo: {
        type: Buffer // less than 16mb 
    },
    fileType: {
        type: String
    },
    caption: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        defualt: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model('Post', postSchema);