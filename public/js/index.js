const socket = io();
socket.on('connect', function () {
    console.log('connected to the server');
});

socket.on('disconnect', function () {// arrow function is not used as it mite not work in safari mobiles etc
    console.log('disconnected from server');
});

socket.on('newMessage', function (data) {
    const formattedTime = moment(data.createdAt).format('h:mm a');
    const template = $('#message-template').html();
    const element = Mustache.render(template,{
        text: data.text,
        from: data.from,
        createdAt: formattedTime
    });
    $('#messages').append(element);
});

socket.on('displayLocationMessage', function (data) {
    const formattedTime = moment(data.createdAt).format('h:mm a');
    const locationTemplate = $('#location-message-template').html();
    const locationElement= Mustache.render(locationTemplate, {
        url: data.url,
        from: data.from,
        createdAt: formattedTime
    })
    $('#messages').append(locationElement);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'VG',
        text: $('[name=msg]').val()
    }, function () {
        $('[name=msg]').val('');
        console.log('Message sent')
    })
});

const locationButton = $('#share-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Your browser doesn\'t supports geolocation');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...')
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        socket.emit('fetchLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function (data) {
            locationButton.removeAttr('disabled').text('Send location');
            console.log(`location sent >>>> ${data}`)
        })
    }, function (err) {
        locationButton.removeAttr('disabled').text('Send location');
        return alert(`Cannot fetch the location: ${err}`)
    });
})
