import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { deleteRooms, handleRoomInputClick } from 'reducers/room.reducer'
import { Controller } from 'react-hook-form'
import { debounce } from 'utils'
const CanReserve = ({ roomKey, idx, control }) => {
	const dispatch = useDispatch()
	const [state, setState] = useState()
	useEffect(() => {
		if (state) {
			dispatch(handleRoomInputClick(state))
		}
	}, [state])

	return (
		<Container>
			<Controller
				name="isLive"
				control={control}
				render={({ field: { value, ...rest } }) => (
					<input
						type="checkbox"
						{...rest}
						onChange={(event) => {
							const value = event.target.checked
							rest.onChange(event)
							debounce(() => setState({ type: 'isLive', value, idx }), 300)
						}}
						checked={value}
					/>
				)}
			/>
			<span>예약 가능</span>
			<Button
				variant="outlined"
				size="medium"
				onClick={() => {
					dispatch(deleteRooms(idx))
				}}
			>
				삭제
			</Button>
		</Container>
	)
}

export default CanReserve

const Container = styled.div`
	float: right;
	& * {
		margin: 0 5px;
	}
	& *:last-child {
		margin-right: 0;
	}
`
