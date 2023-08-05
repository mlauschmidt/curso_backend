const { Server } = require('socket.io');
const messageModel = require('../dao/models/message.model');

const init = (httpServer) => {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        socket.on('joinChat', async (username) => {
            socket.broadcast.emit('notification', `${username} se ha unido al chat`);

            socket.emit('notification', `Bienvenid@ ${username}`);

            const messages = await messageModel.find();
            
            socket.emit('messages', JSON.stringify(messages));
        })

        socket.on('newMessage', async ({user, message}) => {
            const newMessage = {
                user,
                message
            }
                
            await messageModel.create(newMessage);
    
            io.emit('message', JSON.stringify(newMessage));
        })
    })

    return io;
}

module.exports = init;

