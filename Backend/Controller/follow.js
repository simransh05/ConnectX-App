const Follow = require('../models/follow')

module.exports.getFollow = async () => { // A -> B [ A following b add and B followers Add A]
    const { userId } = req.params;
    try {
        const following = await Follow.find({ follower: userId }).populate('follower');
        const follower = await Follow.find({ following: userId }).populate('follwing')
        if (!follower && !following) {
            return res.status(200).json({ follower: [], following: [] })
        } else if (!follower) {
            return res.status(200).json({ follower: [], following })
        } else if (!following) {
            return res.status(200).json({ follower, following: [] })
        }
        return res.status(200).json({ follower, following })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}