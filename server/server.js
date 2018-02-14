const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const publicPath = path.join(__dirname, '../public');  //path join resolves the path
const port = process.env.PORT || 3000;
const server = http.createServer(app);
app.use(express.static(publicPath));
const io = socketIO(server)

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.on('createMessage', (data) => {
        io.emit('newMessage', {
            from: data.from,
            text: data.text,
            craetedAt: new Date().getTime()
        })
        console.log("createMessage", data);
    })

    socket.on('disconnect', () => {
        console.log("disconnected from the client");
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