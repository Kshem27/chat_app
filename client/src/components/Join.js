import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Join = () => {
	const [ name, setName ] = useState('');
	const [ room, setRoom ] = useState('');
	return (
		<div className='joinOuterContainer'>
			<div className='joinInnerContainer'>
				<h1 className='heading mb-4'>Join</h1>
				<div className='mb-3'>
					<input
						type='text'
						className='form-control'
						name='Name'
						value={name}
						placeholder='Name'
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className='mb-3'>
					<input
						type='text'
						className='form-control'
						name='Room'
						value={room}
						placeholder='Room'
						onChange={(e) => setRoom(e.target.value)}
					/>
				</div>
				<Link
					onClick={(e) => (!name || !room ? e.preventDefault() : null)}
					to={`chat?name=${name}&room=${room}`}
				>
					<button type='submit' className='btn btn-primary d-block mx-auto'>
						Submit
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Join;
