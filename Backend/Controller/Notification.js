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

module.exports.postNotification = async (sender, receiver, type, postId) => {
    // idea to add this for the currentuser is the sender and the reciever is who's post or whom 
    try {
        const notify = await Notification.create({
            sender,
            receiver,
            type,
            postId: postId || null
        })

        return { notify, status: 200 };
    } catch (err) {
        console.error(err.message)
    }
}