const Message = require("../models/message");
const { formatChat } = require("./Users/format");
const Group = require('../models/group')

module.exports.getMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const groups = await Group.find({ "members.userId": userId })
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
                    path: 'members.userId',
                    select: '_id name'
                }
            })
            .sort({ sendAt: -1 });

        // console.log('chat', userId, messages);

        const usersMap = new Map();

        messages.forEach(m => {
            if (m.typeOfChat === 'individual') {
                // console.log('m', m);
                if (m.sender._id.toString() !== userId) {
                    usersMap.set(m.sender._id.toString(), m.sender);
                }

                else if (m.receiver._id.toString() !== userId) {
                    usersMap.set(m.receiver._id.toString(), m.receiver);
                }
            }
            else if (m.typeOfChat === 'group') {
                if (m.groupId) {
                    const present = m.groupId.members.some(m => m.userId._id.toString() === userId);
                    if (present) {
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
            }
        });

        const users = Array.from(usersMap.values());
        // console.log('users', users)

        return res.status(200).json(users.map(formatChat));

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.deleteChat = async (req, res) => {
    const { userId, other, type } = req.params;
    try {
        if (type === 'group') {
            const chats = await Message.updateMany(
                {
                    groupId: other,
                    defaultMessage: { $exists: false }
                },
                {
                    $addToSet: { deleteBy: userId }
                }
            )
            const group = await Group.findById(other);
            const totalMembers = group.members.length;
            await Message.deleteMany({
                groupId: other,
                $expr: {
                    $eq: [
                        { $size: "$deleteBy" },
                        totalMembers
                    ]
                }
            });
        } else if (type === 'individual') {
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
                    deleteBy: { $all: [userId, other] }
                },
            )
        }
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
            const group = await Group.findById(user2);
            const joined = group.members.find(m => m.userId.toString() === user1);
            messages = await Message.find({
                groupId: user2,
                $or: [
                    { sendAt: { $gte: joined.AddedOn } },
                    { defaultMessage: { $exists: true } }
                ]
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

module.exports.postMessage = async (sender, receiver, msg, type) => {
    try {
        // console.log('message', sender, receiver, msg, type)
        const data = {
            sender,
            message: msg,
            typeOfChat: type === 'group-chat' ? 'group' : type
        };

        if (type === 'group-chat') {
            data.groupId = receiver;
        } else {
            data.receiver = receiver;
        }
        const message = await Message.create(data);

        if (type === 'group-chat') {
            const group = await Group.findById(receiver)
            return { members: group.members, status: 200 };
        }

        return { message, status: 200 };

    } catch (err) {
        console.error(err.message);
    }
}

module.exports.postGroup = async (req, res) => {
    const { groupName, members, admin, defaultMessage } = req.body;
    // console.log('body', req.body)
    try {
        const format = members.map(m => ({
            userId: m
        }))
        if (!groupName || !members || !admin) {
            return res.status(404).json({ message: 'All Fields Required' })
        }
        const group = await Group.create({
            admin,
            members: format,
            groupName,
        })
        // console.log('group', group)
        await Message.create({
            sender: admin,
            defaultMessage,
            groupId: group._id,
            typeOfChat: 'group'
        })
        await group.populate('members.userId', '_id name')

        // console.log('group', group)
        return res.status(200).json(formatChat(group))
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
        group.members = group.members.filter(m => m.userId.toString() !== userId);
        if (group.admin.toString() === userId) {
            if (group.members.length > 0) {
                group.admin = group.members[0].userId;
            } else {
                await Group.findByIdAndDelete(groupId);
                return res.status(200).json({ message: 'Group deleted as no members left' });
            }
        }
        // console.log('group after leave', group);
        await group.save();
        return res.status(200).json({ message: 'Success', group });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.addMembers = async (req, res) => {
    const { groupId, members } = req.body;
    try {
        // console.log('members', members)
        const format = members.map(id => ({
            userId: id
        }))
        // console.log('format', format)
        const update = await Group.findByIdAndUpdate(
            groupId,
            {
                $addToSet: {
                    members: { $each: format }
                }
            },
            { returnDocument: 'after' }
        )
        await update.populate('members.userId', '_id name')
        // console.log(update)
        return res.status(200).json(formatChat(update));
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}