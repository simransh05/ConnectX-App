const Follow = require('../models/follow');
const { formatFollow } = require('./Users/format');

module.exports.getFollow = async (req, res) => {
    const { userId } = req.params;

    try {
        const following = await Follow.find({ follower: userId })
            .populate('following', 'name profilePic _id');

        const follower = await Follow.find({ following: userId })
            .populate('follower', 'name profilePic _id');

        // console.log("follow", follower)

        return res.status(200).json({
            follower: follower.map(formatFollow),
            following: following.map(formatFollow)
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.postFollow = async (sender, receiver) => { // one doc like add follower me and following them
    try {
        const alreadyFollow = await Follow.findOne({ follower: sender, following: receiver })
        if (alreadyFollow) {
            return 'already follow'
        }
        const follow = await Follow.create({
            follower: sender,
            following: receiver
        })
        return { status: 200, follow }

    } catch (err) {
        console.error(err.message)
    }
}

module.exports.getFollower = async (userId) => {
    try {
        let follower = await Follow.find({ following: userId });

        follower = follower.map(f => {
            return f.follower
        })
        console.log('get follower', follower);
        return follower
    } catch (err) {
        console.error(err.message)
    }
}