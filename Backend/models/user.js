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
        type: Buffer
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