const socket = io();

const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const messageButton = document.getElementById('messageButton');
const notificationContainer = document.getElementById('notificationContainer');

const params = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true
})
const user = params.username;

socket.emit('joinChat', user);

socket.on('notification', (notification) => {
    notificationContainer.innerHTML = notification;
})

socket.on('messages', (messagesString) => {
    const messages = JSON.parse(messagesString);

    messages.forEach( message => {
        messagesContainer.innerHTML += 
        `<p>${message.user}: ${message.message}</p>`
    })
})

messageButton.addEventListener('click', (e) => {
    const message = messageInput.value;

    if (message) {
        socket.emit('newMessage', {user, message});
    }
})

socket.on('message', (messageString) => {
    const message = JSON.parse(messageString);

    messagesContainer.innerHTML += 
    `<p>${message.user}: ${message.message}</p>`
})