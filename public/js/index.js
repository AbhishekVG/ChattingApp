const socket = io();
socket.on('connect', function() {
    console.log('connected to the server');
    socket.emit('createMessage', {
        to: 'luffY@op.com',
        createdAt: 32253456456,
        text: 'hi luffy'
    })
});

socket.on('disconnect', function() {// arrow function is not used as it mite not work in safari mobiles etc
    console.log('disconnected from server');
});

socket.on('newMessage',function(data) {
    console.log('newMessage', data)
});