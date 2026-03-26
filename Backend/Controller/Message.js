const Message = require("../models/message");
const { formatChat } = require("./Users/format");
const Group = require('../models/group')

module.exports.getMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        // console.log('userId', typeof userId)
        const groups = await Group.find({
            members: userId
        }).select("_id")

        const groupIds = groups.map(g => g._id)
        console.log('groupid' , groupIds)
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId },
                { groupId: { $in: groupIds } }
            ]
        }).populate('sender receiver groupId', 'name _id profilePic fileType')
            .sort({ sendAt: -1 });
        const usersMap = new Map();

        messages.forEach(m => {
            if (m.typeOfChat === 'individual') {
                if (m.sender._id.toString() !== userId) {
                    usersMap.set(m.sender._id.toString(), m.sender);
                }

                if (m.receiver._id.toString() !== userId) {
                    usersMap.set(m.receiver._id.toString(), m.receiver);
                }
            } if (m.typeOfChat === 'group') {
                if (m.groupId) {
                    usersMap.set(
                        m.groupId._id.toString(),
                        m.groupId
                    );
                }
            }
        })

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

module.exports.postMessage = async (sender, receiver, msg, groupId) => {
    try {

        const data = {
            sender,
            message: msg
        };

        if (groupId) {
            data.groupId = groupId;
        } else {
            data.receiver = receiver;
        }

        const message = await Message.create(data);

        return { message, status: 200 };

    } catch (err) {
        console.error(err.message);
    }
}

module.exports.postGroup = async (req, res) => {
    const { groupName, members, admin } = req.body;
    console.log('body', req.body)
    try {
        if (!groupName || !members || !admin) {
            return res.status(404).json({ message: 'All Fields Required' })
        }
        const group = await Group.create({
            admin,
            members,
            groupName
        })

        console.log('group', group)
        return res.status(200).json(group)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

}