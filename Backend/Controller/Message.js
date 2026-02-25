const Message = require("../models/message");

module.exports.getMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await Message.find({
            $or: {
                sendBy: userId,
                sendTo: userId
            }
        }).populate('sendBy sendTo');
        if (!messages) {
            return res.status(200).json([])
        }
        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.getIndividualMessage = async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const messages = await Message.find({
            $or: {
                sendBy: [user1, user2],
                sendTo: [user1, user2],
            }
        }).populate('sendBy sendTo')
        if (!messages) {
            return res.status(200).json([])
        }
        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}