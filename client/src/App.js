import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Join from './components/Join';
const App = () => {
	return (
		<Router>
			<Route path='/' exact>
				<Join />
			</Route>
			<Route path='/chat'>
				<Chat />
			</Route>
		</Router>
	);
};

export default App;
