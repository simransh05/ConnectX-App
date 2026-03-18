const Notification = require("../models/notification");
const { formatNotify } = require("./Users/format");

module.exports.getNotification = async (req, res) => {
    const { userId } = req.params;
    try {
        const notification = await Notification.find({ receiver: userId }).populate('sender').sort({ createdAt: -1 })
        // console.log('notify' , notification)
        if (!notification) {
            return res.status(200).json([])
        }
        return res.status(200).json(notification.map(formatNotify));
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.postNotification = async (sender, receiver, type, postId) => {
    // idea to add this for the currentuser is the sender and the reciever is who's post or whom 
    try {
        let notify;
        if (type === 'post') {
            notify = await Notification.create(
                sender,
                receiver,
                type,
            )
        } else {
            notify = await Notification.updateOne(
                {
                    sender,
                    receiver,
                    type,
                    postId: postId || null
                },
                {
                    createdAt: Date.now()
                },
                { upsert: true, new: true }
            )
        }

        return { notify, status: 200 };
    } catch (err) {
        console.error(err.message)
    }
}

module.exports.deleteNotify = async (req, res) => {
    const { userId } = req.params;
    // console.log(userId);
    try {
        await Notification.deleteMany({
            receiver: userId
        })
        // console.log('here 41')
        return res.status(200).json({ message: 'Success' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.deleteMessage = async (sender, receiver, type) => {
    console.log('post', sender, receiver, type)
    try {
        // console.log('post', sender, receiver, type)
        if (type != "message") {
            return;
        }
        await Notification.deleteOne({
            sender,
            receiver,
            type
        })
        return { status: 200 };
    } catch (err) {
        console.error(err.message)
    }
}