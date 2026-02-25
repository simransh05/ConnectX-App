const Notification = require("../models/notification");

module.exports.getNotification = async (req, res) => {
    const { userId } = req.params;
    try {
        const notification = await Notification.find({ reciver: userId }).populate('postId sender')
        if (!notification) {
            return res.status(200).json([])
        }
        return res.status(200).json(notification);
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}