module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('register', (userId) => {
            socket.userId = userId;
            console.log('user connected', socket.id, socket.userId);
        })

        // chat , notification 

        socket.on('disconnect', () => {
            console.log('user disconnect', socket.id, socket.userId)
        })
    })
}