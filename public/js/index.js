const socket = io();
socket.on('connect', function() {
    console.log('connected to the server');
});

socket.on('disconnect', function() {// arrow function is not used as it mite not work in safari mobiles etc
    console.log('disconnected from server');
});

socket.on('newMessage',function(data) {
    const li = $('<li></li>');
    li.text(`${data.from} :  ${data.text}`);
    $('#messages').append(li);
});

$('#messages').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'VG',
        text: $('[name=msg]').val()
    }, function(){
        console.log('Message sent')
    })
})
