const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { getUser, addUser, removeUser, getUsersInRoom } = require('./users.js');
const router = require('./router.js');
app.use(router);

io.on('connection', (socket) => {
	console.log('We have a connection');
	socket.on('join', ({ name, room }, callback) => {
		console.log(name, room);
		const { error, user } = addUser({ id: socket.id, name, room }); //func can return either error or user so if there is a error we can do something
		if (error) return callback(error);

		socket.emit('message', { user: 'admin', text: `${user.name},welcome to the room ${user.room}` });
		socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` }); //emit means sending to front end from backend and on means receiveing
		socket.join(user.room);

		callback(); //callback on front end runs but no error
	});
	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);
		io.to(user.room).emit('message', { user: user.name, text: message });
		callback();
	});
	socket.on('disconnect', () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left the chat` });
		}
	});
});

server.listen(PORT, () => console.log(`Server is running on port : ${PORT}`));
