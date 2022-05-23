import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { insertImage } from 'reducers/room.reducer'
import styled from 'styled-components'

const CheckBtn = ({ room }) => {
	const ref = useRef()
	const dispatch = useDispatch()

	const onChangeFiles = (event) => {
		const payload = {
			key: room.key,
			files: event.target.files
		}
		dispatch(insertImage(payload))
	}

	return (
		<DeleteButton onClick={() => ref.current.click()}>
			<Btn className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</Btn>
			<p>등록</p>
			<input
				ref={ref}
				onChange={onChangeFiles}
				multiple
				type="file"
				accept="image/*"
				style={{ visibility: 'hidden', display: 'none' }}
			/>
		</DeleteButton>
	)
}

export default CheckBtn

const Btn = styled.svg`
	width: 16px;
	aspect-ratio: 1/1;
	stroke: transparent;
	fill: #1dd1a1;
`

const DeleteButton = styled.button`
	height: 26px;
	width: 50px;
	padding: 0 5px;
	background: #fafafa;
	border: 1px solid #1dd1a1;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-radius: 24px;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	& p {
		font-size: 0.7rem;
		color: #1dd1a1;
		margin: 0;
		word-break: keep-all;
	}

	&:hover {
		background-color: #1dd1a1;
		& p {
			color: white;
		}
		& svg {
			fill: white;
			stroke: #1dd1a1;
		}
	}
`
