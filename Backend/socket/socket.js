let userMap = new Map();
const Follow = require('../Controller/follow');
const Message = require('../Controller/Message');
const Notification = require('../Controller/Notification');
const Post = require('../Controller/Post');
module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('register', (userId) => {
            socket.userId = userId;
            userMap.set(userId, socket.id)
            console.log('user connected', socket.id, socket.userId);
        })
        socket.on('send', async ({ sender, receiver, msg, type }, callback) => {
            // console.log('send', sender, receiver, msg)
            // console.log('receive', receiverId);
            // console.log('sending', res)
            const res = await Message.postMessage(sender, receiver, msg, type);
            if (type === 'individual') {
                await Notification.deleteSocketNotify(receiver, sender, "message")
            }

            if (res.status === 200) {
                callback({ status: 200 })
            }
            const senderId = userMap.get(sender);
            io.to(senderId).emit('message-send', { sender, receiver, msg, type })

            if (type === 'group') {
                res.members.forEach(async m => {
                    await Notification.deleteSocketNotify(receiver, sender, "message")
                    const memberId = userMap.get(m.userId.toString());
                    if (m.userId.toString() !== sender) {
                        io.to(memberId).emit('receive', { sender, receiver, msg, type })
                    }
                })
                return;
            }

            // console.log('receiver' , receiver);

            const receiverId = userMap.get(receiver);
            io.to(receiverId).emit('receive', { sender, receiver, msg, type })
        })

        socket.on('add-member', ({ groupId, members }) => {
            // console.log('add member', members)
            members.forEach(m => {
                const receive = userMap.get(m._id)
                io.to(receive).emit('receive-member', { groupId, members })
            })

        })

        socket.on('group-leave', ({ groupId, userId, members }) => {
            // console.log('member left', members, userId)
            members.forEach(m => {
                if (userId !== m._id) {
                    const receive = userMap.get(m._id)
                    io.to(receive).emit('left', { groupId, userId })
                }
            })
        })

        socket.on('send-notify', async ({ sender, receiver, type, postId, status, groupId, groupName, members }, callback) => {
            try {
                console.log('socket', sender, receiver, type, postId, status)
                if (type === "group") {
                    for (let m of receiver) {
                        if (m?._id?.toString() === sender) continue;
                        else {
                            await Notification.postNotification(
                                sender,
                                m._id,
                                "group",
                                null,
                                groupId
                            );

                            const memberSocket = userMap.get(m._id);

                            if (memberSocket) {
                                io.to(memberSocket).emit("receiver-notify", {
                                    sender,
                                    receiver,
                                    type,
                                    groupId,
                                    groupName,
                                    status,
                                    members
                                });
                            }
                        }
                    }
                    if (callback) callback({ status: 200 });
                    return;
                }
                if (type === 'follow') {

                    if (status === 'remove') {
                        await Follow.removeFollow(sender, receiver);
                        await Notification.deleteSocketNotify(sender, receiver, type);
                    } else {
                        await Follow.postFollow(sender, receiver);
                        await Notification.postNotification(sender, receiver, type);
                    }

                    const receiverId = userMap.get(receiver);

                    if (receiverId && sender !== receiver) {
                        io.to(receiverId).emit('receiver-notify', {
                            sender,
                            receiver,
                            type,
                            status
                        });
                    }

                    if (callback) callback({ status: 200 });
                    return;
                }

                if (type === 'like') {

                    if (status === 'remove') {
                        await Post.deleteLike(postId, sender);
                        await Notification.deleteSocketNotify(sender, receiver, type, postId);
                    } else {

                        await Post.postLike(postId, sender);
                        if (sender !== receiver) {
                            await Notification.postNotification(sender, receiver, type, postId);
                        }
                    }

                    const receiverId = userMap.get(receiver);

                    if (receiverId && sender !== receiver) {
                        io.to(receiverId).emit('receiver-notify', {
                            sender,
                            receiver,
                            type,
                            postId,
                            status
                        });
                    }

                    if (callback) callback({ status: 200 });
                    return;
                }
                if (type === 'comment') {

                    if (status === 'add' && sender !== receiver) {
                        await Notification.postNotification(sender, receiver, type, postId);
                    }

                    const receiverId = userMap.get(receiver);

                    if (receiverId && sender !== receiver) {
                        io.to(receiverId).emit('receiver-notify', {
                            sender,
                            receiver,
                            type,
                            postId,
                            status
                        });
                    }

                    if (callback) callback({ status: 200 });
                    return;
                }

                if (type === 'post') {

                    const followers = await Follow.getFollower(sender);

                    for (let f of followers) {

                        if (status === 'remove') {
                            await Notification.deleteSocketNotify(sender, f, type);
                        } else {
                            await Notification.postNotification(sender, f, type);
                        }

                        const followerSocket = userMap.get(f);

                        if (followerSocket) {
                            io.to(followerSocket).emit('receiver-notify', {
                                sender,
                                receiver: f,
                                type,
                                status
                            });
                        }
                    }

                    if (callback) callback({ status: 200 });
                    return;
                }
                if (type === 'message') {

                    if (status === 'remove') {
                        await Notification.deleteSocketNotify(sender, receiver, type);
                    } else {
                        await Notification.postNotification(sender, receiver, type);
                    }

                    const receiverId = userMap.get(receiver);

                    if (receiverId && sender !== receiver) {
                        io.to(receiverId).emit('receiver-notify', {
                            sender,
                            receiver,
                            type,
                            status
                        });
                    }


                    if (callback) callback({ status: 200 });
                    return;
                }

                if (type === 'group-chat') {
                    console.log('here in group chat')
                    for (let m of receiver) {
                        if (sender !== m._id) {
                            await Notification.postNotification(sender, m._id, type)
                            const receiverId = userMap.get(m._id);
                            io.to(receiverId).emit('receiver-notify', {
                                sender,
                                receiver: m._id,
                                type,
                                status,
                                groupId
                            });
                        }
                    } return;
                }

            } catch (err) {
                console.error("Socket notify error:", err);
                if (callback) callback({ status: 500 });
            }
        });

        socket.on('join-group', ({ sender, groupId, groupName, members }) => {
            // 
            members.forEach(m => {
                // 
            });
        })

        socket.on('delete', () => {
            io.to(socket.id).emit('deleted');
        })

        socket.on('disconnect', () => {
            console.log('user disconnect', socket.id, socket.userId)
        })
    })
}