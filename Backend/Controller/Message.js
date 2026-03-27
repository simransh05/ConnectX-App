const Message = require("../models/message");
const { formatChat } = require("./Users/format");
const Group = require('../models/group')

module.exports.getMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const groups = await Group.find({ members: userId })
            .select("_id");
        const groupIds = groups.map(g => g._id);
        // console.log('groups', groups);

        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId },
                { groupId: { $in: groupIds } }
            ]
        })
            .populate('sender receiver', 'name _id profilePic fileType')
            .populate({
                path: 'groupId',
                select: '_id groupName members',
                populate: {
                    path: 'members',
                    select: '_id name'
                }
            })
            .sort({ sendAt: -1 });

        // console.log('chat', userId, messages);

        const usersMap = new Map();

        messages.forEach(m => {
            if (m.typeOfChat === 'individual') {
                console.log('m', m);
                if (m.sender._id.toString() !== userId) {
                    usersMap.set(m.sender._id.toString(), m.sender);
                }

                else if (m.receiver._id.toString() !== userId) {
                    usersMap.set(m.receiver._id.toString(), m.receiver);
                }
            }
            else if (m.typeOfChat === 'group') {
                if (m.groupId) {
                    usersMap.set(
                        m.groupId._id.toString(),
                        {
                            _id: m.groupId._id,
                            groupName: m.groupId.groupName,
                            members: m.groupId.members
                        }
                    );
                }
            }
        });

        const users = Array.from(usersMap.values());
        console.log('users', users)

        if (!messages) {
            return res.status(200).json([]);
        }

        return res.status(200).json(users.map(formatChat));

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
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
    const { user1, user2, type } = req.params;
    try {
        let messages;
        if (type === 'group') {
            messages = await Message.find({
                groupId: user2
            }).sort({ sendAt: 1 })
        } else {
            messages = await Message.find({
                $or: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 }
                ]
            })
                .sort({ sendAt: 1 });
        }
        console.log('messages', messages)
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

module.exports.postMessage = async (sender, receiver, msg, type) => {
    try {
        const data = {
            sender,
            message: msg,
            typeOfChat: type
        };

        if (type === 'group') {
            data.groupId = receiver;
        } else {
            data.receiver = receiver;
        }
        const message = await Message.create(data);

        if (type === 'group') {
            const group = await Group.findById(receiver)
            return { members: group.members };
        }

        return { message, status: 200 };

    } catch (err) {
        console.error(err.message);
    }
}

module.exports.postGroup = async (req, res) => {
    const { groupName, members, admin, defaultMessage } = req.body;
    console.log('body', req.body)
    try {
        if (!groupName || !members || !admin) {
            return res.status(404).json({ message: 'All Fields Required' })
        }
        const group = await Group.create({
            admin,
            members,
            groupName,
        })
        console.log('group', group)
        await Message.create({
            sender: admin,
            defaultMessage,
            groupId: group._id,
            typeOfChat: 'group'
        })

        console.log('group', group)
        return res.status(200).json(group)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }

}

module.exports.leaveGroup = async (req, res) => {
    const { userId, groupId } = req.body;

    try {
        if (!userId || !groupId) {
            return res.status(404).json({ message: 'fields required' });
        }
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        group.members = group.members.filter(m => m.toString() !== userId);
        if (group.admin.toString() === userId) {
            if (group.members.length > 0) {
                group.admin = group.members[0];
            } else {
                await Group.findByIdAndDelete(groupId);
                return res.status(200).json({ message: 'Group deleted as no members left' });
            }
        }
        await group.save();
        return res.status(200).json({ message: 'Success', group });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}