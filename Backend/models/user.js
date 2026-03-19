const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    googleId: {
        type: String
    },
    profilePic: {
        type: Buffer,
        defualt: ""
    },
    fileType: {
        type: String,
        defualt: ""
    },
    profilePicType: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    bio: {
        type: String,
    },
    location: {
        type: String
    },
    password: {
        type: String
    },
    savedPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    socialLinks: [
        {
            platform: {
                type: String, // to lowercase check if avaiable then add else msg
                enum: ["linkedin", "instagram", "facebook", "twitter", "github", "leetcode", "codeforce"]
            },
            url: {
                type: String
            }
        }
    ],
    joinedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)