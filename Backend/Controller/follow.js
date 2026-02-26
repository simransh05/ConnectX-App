const Follow = require('../models/follow');

module.exports.getFollow = async (req, res) => {
    const { userId } = req.params;

    try {
        const following = await Follow.find({ follower: userId })
            .populate('following', 'name profilePic');

        const follower = await Follow.find({ following: userId })
            .populate('follower', 'name profilePic');

        return res.status(200).json({
            follower,
            following
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.postFollow = async (req, res) => { // one doc like add follower me and following them
    const { userId, other } = req.params;
    try {
        const alreadyFollow = await Follow.findOne({ follower: userId, following: other })
        if (alreadyFollow) {
            return res.status(404).json({ message: 'already follow' })
        }
        await Follow.create({
            follower: userId,
            following: other
        })

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}