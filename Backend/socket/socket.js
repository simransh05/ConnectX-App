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
        socket.on('send', async ({ sender, receiver, msg }, callback) => {
            // console.log('send', sender, receiver, msg)
            const receiverId = userMap.get(receiver);
            // console.log('receive', receiverId);
            const res = await Message.postMessage(sender, receiver, msg);
            // console.log('status', res?.status);
            if (res.status === 200) {
                callback({ status: 200 })
            }
            io.to(receiverId).emit('receive', { sender, receiver, msg })
        })

        socket.on('send-notify', async ({ sender, receiver, type, postId }, callback) => {
            console.log('send', sender, receiver, type, postId)
            if (type === 'follow') {
                await Notification.postNotification(sender, receiver, type);
                await Follow.postFollow(sender, receiver);
                // await post follow and post notification
            } else if (type === 'like') {
                await Notification.postNotification(sender, receiver, type, postId);
                await Post.postLike(postId, sender)
                // postid and data add like comment
            } else if (type === 'comment') {
                await Notification.postNotification(sender, receiver, type, postId);
            }
            callback({ status: 200 }) // for making follow to already follow
            const receiverId = userMap.get(receiver);
            io.to(receiverId).emit('receiver-notify', { sender, receiver, type, postId: postId || null })
        })

        socket.on('delete', () => {
            io.to(socket.id).emit('deleted');
        })
        // socket.on()
        // chat , notification 

        socket.on('disconnect', () => {
            console.log('user disconnect', socket.id, socket.userId)
        })
    })
}