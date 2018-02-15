const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const publicPath = path.join(__dirname, '../public');  //path join resolves the path
const port = process.env.PORT || 3000;
const server = http.createServer(app);
app.use(express.static(publicPath));
const io = socketIO(server);
const { isString } = require('./utils/validation');
const { Users } = require('./utils/users');
const users = new Users();
const { generateMessage, generateLocationMessage } = require('./utils/message');

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.on('createMessage', (message, callBack) => {
        // io.emit('newMessage', {
        //     from: data.from,
        //     text: data.text,
        //     craetedAt: new Date().getTime()
        // })
        const user = users.getUser(socket.id);
        if(user && isString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callBack('This is from the server.');
    })

    socket.on('fetchLocation', (coords, callBack) => {
        const user = users.getUser(socket.id);
        if(user){
           io.to(user.room).emit('displayLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
        callBack("from the server: 200");
    })

    socket.on('join', (data, callBack) => {
        if (!isString(data.name) || !isString(data.room)) {
            return callBack('Invalid user or room name')
        }
        socket.join(data.room);
        //socket.leave('same name')
        console.log('----->',users.removeUser(socket.id));
        users.addUser(socket.id, data.name, data.room);
        io.to(data.room).emit('updateUsersList', users.getUserList(data.room))
        console.log('server side', socket.id); //explore socket
        socket.broadcast.to(data.room).emit('newMessage', generateMessage('Admin', `${data.name} joined`))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chatting app'))
        callBack();
    });

    socket.on('disconnect', () => {
        console.log("disconnected from the client");
        const user = users.removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
        }
    })
})

server.listen(port, () => {
    console.log(`app started listening at the port ${port}`)
});


// app.get('/', (req, res) => {
//     res.sendFile(publicPath+ '/index.html');  //this will stop rendering of html file showing forbidden, it seems ../ is malicious so better use path.resolve or path.join...this is another way to render html file other than app.use middleware file
// })

// app.get('/css/styles.css', (req, res) => {
//     console.log('__dirname/css/style.css', __dirname + '/css/style.css')
//     res.sendFile(__dirname+ '/css/style.css');
// }) // saw this working on one of the videos but here it's not working fine //works....give this route in link href tag...



//TESTING
// console.log(`${__dirname}/../public`); //displays D:\NODE.js\chatApp13feb\server/../public which is not necessary to show two dots going back
//solution
// console.log(path.join(`${__dirname}/../public`)); //resolves the path and sends back
//TESTING