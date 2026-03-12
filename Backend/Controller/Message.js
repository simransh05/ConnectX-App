const Message = require("../models/message");
const { formatChat } = require("./Users/format");

module.exports.getMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        // console.log('userId', typeof userId)
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        }).populate('sender receiver', 'name _id profilePic')
            .sort({ sendAt: -1 });
        // console.log('messages 14', messages)
        // const formatted  = messages.map(formatChat);
        // console.log('formatted' , formatted)
        const usersMap = new Map();

        messages.forEach(m => {
            if (m.sender._id.toString() !== userId) {
                usersMap.set(m.sender._id.toString(), m.sender);
            }

            if (m.receiver._id.toString() !== userId) {
                usersMap.set(m.receiver._id.toString(), m.receiver);
            }
        });

        const users = Array.from(usersMap.values());
        if (!messages) {
            return res.status(200).json([])
        }
        return res.status(200).json(users.map(formatChat));
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.deleteChat = async (req, res) => {
    const { userId, other } = req.params;
    try {
        await Message.updateMany(
            {
                $or: [
                    { sender: userId, receiver: other },
                    { sender: other, receiver: userId }
                ]
            },
            {
                $addToSet: { deleteBy: userId }
            }
        )
        await Message.deleteMany(
            {
                deleteBy: [userId, other]
            },
        )
        return res.status(200).json({ message: 'Success' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.getIndividualMessage = async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        })
            .sort({ sendAt: 1 });
        // console.log('messages', messages)
        const filterMessage = messages.filter(m => !m.deleteBy.includes(user1));
        // console.log(filterMessage)
        if (!messages) {
            return res.status(200).json([])
        }
        return res.status(200).json(filterMessage);
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.postMessage = async (sender, receiver, msg) => {
    try {
        if (!sender || !receiver || !msg) {
            console.error('Field is required')
            return;
        }
        const message = await Message.create({
            sender,
            receiver,
            message: msg
        })
        return { message, status: 200 };
    }
    catch (err) {
        console.error(err.message)
    }
}