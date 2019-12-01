const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path')

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

console.log(path.join(__dirname, './src/public'));

app.set('port', process.env.PORT || 3000)

require('./sockets')(io);

app.use(express.static(path.join(__dirname, './src/public')));

server.listen(app.get('port'), () => {
    console.log('Servidor en puerto ', app.get('port'));
});