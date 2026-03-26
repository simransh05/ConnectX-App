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
        socket.on('send', async ({ sender, receiver, msg, groupId }, callback) => {
            // console.log('send', sender, receiver, msg)
            // console.log('receive', receiverId);
            const res = await Message.postMessage(sender, receiver, msg, groupId);
            await Notification.deleteSocketNotify(receiver, sender, "message")
            // console.log('socket', r)
            // console.log('status', res?.status, res);
            if (res.status === 200) {
                callback({ status: 200 })
            }
            const senderId = userMap.get(sender);
            // console.log('receiver' , receiver);
            io.to(senderId).emit('message-send', { receiver, type: "message" })
            const receiverId = userMap.get(receiver);
            io.to(receiverId).emit('receive', { sender, receiver, msg })
        })

        socket.on('send-notify', async ({ sender, receiver, type, postId, status }, callback) => {
            const receiverId = userMap.get(receiver);
            if (status === 'remove' && type != 'post' && sender != receiver) {
                await Notification.deleteSocketNotify(sender, receiver, type, postId || null);
            } else if (status === 'add' && type != 'post' && sender != receiver) {
                await Notification.postNotification(sender, receiver, type, postId || null);
            }
            console.log('socket', sender, receiver)
            if (type === 'follow') {
                if (status === 'remove') {
                    await Follow.removeFollow(sender, receiver);
                } else {
                    await Follow.postFollow(sender, receiver);
                }
            } else if (type === "group") {

                for (let m of receiver) {

                    if (m === sender) continue;

                    await Notification.postNotification(
                        sender,
                        m,
                        "group"
                    );

                    const memberSocket = userMap.get(m);

                    if (memberSocket) {
                        io.to(memberSocket).emit("receiver-notify", {
                            sender,
                            receiver: m,
                            type: "group-chat",
                            groupId,
                            groupName,
                            status
                        });
                    }
                } return;
            }
            else if (type === 'like') {
                if (status === 'remove') {
                    await Post.deleteLike(postId, sender);
                } else {
                    await Post.postLike(postId, sender)
                }
                // postid and data add like comment
            } else if (type === 'post') {
                const followers = await Follow.getFollower(sender);
                if (status === 'remove') {
                    for (let f of followers) {
                        // console.log('f' , f)
                        await Notification.deleteSocketNotify(sender, f, type);
                        const followerId = userMap.get(f);
                        io.to(followerId).emit('receiver-notify', { sender, receiver: f, type, status })
                    }
                    return;
                }
                else {
                    for (let f of followers) {
                        await Notification.postNotification(sender, f, type);
                        const followerId = userMap.get(f);
                        io.to(followerId).emit('receiver-notify', { sender, receiver: f, type, status })
                    }
                    return;
                }
            }
            if (callback) {
                callback({ status: 200 }) // for making follow to already follow
            }
            if (sender != receiver) {
                io.to(receiverId).emit('receiver-notify', { sender, receiver, type, postId: postId || null, status })
            }

        })

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