import React, { useEffect, useState } from 'react';
import querystring from 'query-string';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useLocation } from 'react-router-dom';
import ReactEmoji from 'react-emoji';
import io from 'socket.io-client';
let socket;
const Chat = () => {
	const location = useLocation();
	const [ name, setName ] = useState();
	const [ room, setRoom ] = useState();
	const [ message, setMessage ] = useState('');
	const [ messages, setMessages ] = useState([]);
	const ENDPOINT = 'localhost:5000';
	const connectionOptions = {
		'force new connection': true,
		reconnectionAttempts: 'Infinity',
		timeout: 10000,
		transports: [ 'websocket' ]
	};
	useEffect(
		() => {
			const { name, room } = querystring.parse(location.search);

			socket = io(ENDPOINT, connectionOptions);
			setName(name);
			setRoom(room);
			socket.emit('join', { name, room }, () => {
				console.log(`${name} joined the room ${room}`);
			});
			return () => {
				socket.emit('disconnect');
				socket.off();
			};
		},
		[ ENDPOINT, location.search ]
	);
	useEffect(
		() => {
			socket.on('message', (message) => {
				setMessages([ ...messages, message ]);
			});
		},
		[ messages ]
	);
	const sendMessage = (e) => {
		e.preventDefault();
		if (message) {
			socket.emit('sendMessage', message, () => setMessage(''));
		}
	};
	console.log(message, messages);
	return (
		<div className='Container'>
			<div className='chatBox'>
				<nav className='NAV'>
					<h4>{room}</h4>
					<a href='/'>X</a>
				</nav>
				<ScrollToBottom className='messages'>
					{messages.map((message, index) => {
						return (
							<div
								className={message.user === name.trim().toLowerCase() ? 'message mine' : 'message'}
								key={index}
							>
								<p className='text'>{ReactEmoji.emojify(message.text)}</p>
								<p className='user'>{message.user}</p>
							</div>
						);
					})}
				</ScrollToBottom>
				<input
					type='text'
					name='message'
					id='message'
					value={message}
					className='input'
					placeholder='Enter Message'
					onChange={(e) => setMessage(e.target.value)}
					onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
				/>
			</div>
		</div>
	);
};

export default Chat;
