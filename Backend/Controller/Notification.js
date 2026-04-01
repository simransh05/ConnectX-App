const Notification = require("../models/notification");
const { formatNotify } = require("./Users/format");

module.exports.getNotification = async (req, res) => {
    const { userId } = req.params;
    try {
        const notification = await Notification.find({ receiver: userId }).populate('sender').sort({ _id: -1 })
        // console.log('notify' , notification)
        if (!notification) {
            return res.status(200).json([])
        }
        return res.status(200).json(notification.map(formatNotify));
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.postNotification = async (sender, receiver, type, postId, groupId) => {
    try {
        let notify;

        if (type === 'post') {
            notify = await Notification.create({
                sender,
                receiver,
                type,
                postId
            });

        } else if (type === 'group') {
            const check = await Notification.findOne({
                groupId,
                sender,
                type: 'group'
            });

            if (!check) {
                notify = await Notification.create({
                    sender,
                    receiver,
                    type: 'group',
                    groupId
                });
            } else {
                notify = check;
            }

        } else {
            notify = await Notification.findOneAndUpdate(
                {
                    sender,
                    receiver,
                    type,
                    postId
                },
                {
                    $set: { createdAt: Date.now() }
                },
                { upsert: true, returnDocument: 'after' }
            );
        }
        // console.log('notify', notify)

        return { notify, status: 200 };

    } catch (err) {
        console.error(err.message);
        return { status: 500 };
    }
};

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

module.exports.deleteSocketNotify = async (sender, receiver, type, postId) => {
    // console.log('post', sender, receiver, type)
    try {
        // console.log('post', sender, receiver, type)

        await Notification.deleteOne({
            sender,
            receiver,
            type,
            postId: postId || null
        })
        return { status: 200 };
    } catch (err) {
        console.error(err.message)
    }
}