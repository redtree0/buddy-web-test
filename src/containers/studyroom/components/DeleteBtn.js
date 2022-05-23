import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteImage } from 'reducers/room.reducer'
import styled from 'styled-components'

const DeleteBtn = ({ image, idx }) => {
	const dispatch = useDispatch()
	const handleCLick = () => {
		const { url } = image
		dispatch(deleteImage({ url, idx }))
	}
	return (
		<DeleteButton onClick={() => handleCLick()}>
			{/* <img src={RemoveIcon} alt="" /> */}
			<XMark className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</XMark>
			<p>삭제</p>
		</DeleteButton>
	)
}

export default DeleteBtn

const XMark = styled.svg`
	width: 16px;
	height: 16px;
	fill: #f50057;
	color: white;
`

const DeleteButton = styled.button`
	height: 26px;
	width: 50px;
	padding: 0 5px;
	background: #fafafa;
	border: 1px solid #f50057;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-radius: 24px;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	position: absolute;
	opacity: 0;
	top: 5px;
	right: 5px;
	& p {
		font-size: 0.7rem;
		color: #f50057;
		margin: 0;
		word-break: keep-all;
	}

	&:hover {
		background-color: #f50057;
		& p {
			color: white;
		}
		/* & svg {
			fill: white;
			color: #f50057;
		} */
	}
`
