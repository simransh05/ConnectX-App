const Follow = require('../models/follow');

module.exports.getFollow = async (req, res) => {
    const { userId } = req.params;

    try {
        const following = await Follow.find({ follower: userId })
            .populate('following', 'name profilePic');

        const follower = await Follow.find({ following: userId })
            .populate('follower', 'name profilePic');

        console.log("follow", following, follower)

        return res.status(200).json({
            follower,
            following
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