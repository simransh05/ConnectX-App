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
            const res = await Message.postMessage(sender, receiver, msg, type);
            // console.log('sending', res)
            if (type === 'individual') {
                await Notification.deleteSocketNotify(receiver, sender, "message")
            }
            if (res.status === 200) {
                callback({ status: 200 })
            }

            if (type === 'group') {
                res.members.forEach(m => {
                    const memberId = userMap.get(m.toString());
                    io.to(memberId).emit('receive', { sender, receiver, msg, type })
                })
                return;
            }

            // console.log('socket', r)
            // console.log('status', res?.status, res);
            const senderId = userMap.get(sender);
            // console.log('receiver' , receiver);
            io.to(senderId).emit('message-send', { receiver, type: "message" })
            const receiverId = userMap.get(receiver);
            io.to(receiverId).emit('receive', { sender, receiver, msg })
        })

        socket.on('send-notify', async ({ sender, receiver, type, postId, status, groupId, groupName }, callback) => {
            try {
                if (type === "group") {
                    for (let m of receiver) {
                        if (m._id.toString() === sender) continue;

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
                                status
                            });
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
                if (type === 'comment') {

                    if (status === 'add') {
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