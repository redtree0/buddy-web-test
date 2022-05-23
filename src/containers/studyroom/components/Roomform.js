import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setErrors } from 'reducers/room.reducer'

import styled from 'styled-components'
import CanReserve from './CanReserve'
import RoomInput from './RoomInput'
const Roomform = ({ room, idx }) => {
	const {
		control,
		watch,
		handleSubmit,
		formState: { errors }
	} = useForm({
		defaultValues: {
			...room,
			timeUnit: room.timeUnit ? room.timeUnit.toString() : '60'
		},
		mode: 'onChange',
		reValidateMode: 'onChange'
	})
	const onValid = (data) => {
		throw new Error('okok')
	}
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setErrors(errors))
	}, [Object.keys(errors).length])
	const isRoom = watch().chargeType === 'room'
	return (
		<DetailContent onSubmit={handleSubmit(onValid)}>
			<ContentContainer>
				<RoomInput label="스터디룸 명칭" type="name" idx={idx} control={control} />
				<RoomInput label="비밀번호" type="lockPassword" idx={idx} control={control} />
			</ContentContainer>
			<ContentContainer>
				<RoomInput label="단위시간" type="timeUnit" idx={idx} control={control} />
				<RoomInput type="pricePerTime" label="요금" idx={idx} control={control} />
			</ContentContainer>
			<ContentContainer>
				<RoomInput label="금액계산" type="chargeType" idx={idx} control={control} />
			</ContentContainer>
			<ContentContainer>
				<RoomInput
					type={{ minPerson: 'minPerson', maxPerson: 'maxPerson' }}
					idx={idx}
					control={control}
					label="인원수"
					isRoom={isRoom}
				/>
				<RoomInput label="추가요금" type="priceBasic" idx={idx} control={control} />
			</ContentContainer>
			<ContentContainer>
				<RoomInput type={{ opStartHour: 'opStartHour', opEndHour: 'opEndHour' }} idx={idx} control={control} label="운영시간" />
				<RoomInput type="cancellableHour" idx={idx} control={control} label="취소가능시간" />
			</ContentContainer>
			<CanReserve roomKey={room.key} idx={idx} control={control} />
			<button className="onsubmitHandler" style={{ visibility: 'hidden' }} type="submit"></button>
		</DetailContent>
	)
}

export default React.memo(Roomform)

const DetailContent = styled.form`
	/* padding-left: 2rem; */
	position: relative;
	flex: 1;
`
const ContentContainer = styled.div`
	display: flex;
	margin-bottom: 10px;
	& > div:first-child {
		margin-right: 20px;
	}
`
