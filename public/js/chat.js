const socket = io();

function scrollToBottom() {
    const messages = $('#messages');
    const newMessage = messages.children('li:last-child');

    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');

    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('updateUsersList', function(users){
    var ol = $("<ol></ol>");

    users.forEach(function(user){
        ol.append($('<li></li>').text(user))
    })

    $('#users').html(ol);
})

socket.on('connect', function () {
    console.log('connected to the server');
    const params = $.deparam(location.search);
    socket.emit('join', params, function(err){
        if(err) {
            alert(err);
            location.href = '/';
        } else {
            console.log('ChatRoom entered')
        }
    })
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
    scrollToBottom();
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
    scrollToBottom();    
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        text: $('[name=msg]').val()
    }, function () {
        $('[name=msg]').val('');
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
