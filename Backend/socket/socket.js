let userMap = new Map();
const Message = require('../Controller/Message');
module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('register', (userId) => {
            socket.userId = userId;
            userMap.set(userId, socket.id)
            console.log('user connected', socket.id, socket.userId);
        })
        socket.on('send', async ({ sender, receiver, msg }, callback) => {
            console.log('send', sender, receiver, msg)
            const receiverId = userMap.get(receiver);
            console.log('receive',receiverId);
            const res = await Message.postMessage(sender, receiver, msg);
            console.log('status',res?.status);
            if (res.status === 200) {
                callback({ status: 200 })
            }
            io.to(receiverId).emit('receive', { sender, receiver, msg })
        })
        // chat , notification 

        socket.on('disconnect', () => {
            console.log('user disconnect', socket.id, socket.userId)
        })
    })
}