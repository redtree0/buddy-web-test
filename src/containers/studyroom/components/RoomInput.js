import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { handleRoomInputClick } from 'reducers/room.reducer'
import styled from 'styled-components'
import { debounce } from 'utils'

const RoomInput = ({ className = '', label, type = 'text', control, isRoom, idx }) => {
	const [state, setState] = useState()
	const dispatch = useDispatch()
	useEffect(() => {
		if (state) {
			dispatch(handleRoomInputClick(state))
		}
	}, [state])
	return type === 'chargeType' ? (
		<Container toggle>
			{label && <label>{label}</label>}
			<div>
				<Controller
					control={control}
					name={type}
					rules={{
						required: '금액계산 기준을 설정하세요. '
					}}
					render={({ field }) => (
						<RadioGroup
							row={true}
							{...field}
							onChange={(event) => {
								const value = event.target.value
								field.onChange(event)
								debounce(() => setState({ type, value, idx }), 150)
							}}
						>
							<FormControlLabel
								value="room"
								control={<Radio size="small" />}
								label={'단위시간제'}
								style={{ marginBottom: '0' }}
							/>
							<FormControlLabel
								value="man"
								control={<Radio size="small" />}
								label={'단위시간X인원제'}
								style={{ marginBottom: '0' }}
							/>
						</RadioGroup>
					)}
				/>
			</div>
		</Container>
	) : type === 'timeUnit' ? (
		<Container>
			{label && <label>{label}</label>}
			<div>
				<Controller
					control={control}
					name={type}
					render={({ field }) => {
						return (
							<RadioGroup
								{...field}
								onChange={(event) => {
									const value = event.target.value
									field.onChange(event)
									debounce(() => setState({ type, value, idx }), 150)
								}}
								row={true}
							>
								<FormControlLabel value={'60'} control={<Radio />} label="1시간" style={{ marginBottom: '0' }} />
								<FormControlLabel value={'30'} control={<Radio />} label="30분" style={{ marginBottom: '0' }} />
							</RadioGroup>
						)
					}}
				/>
			</div>
		</Container>
	) : type === 'priceBasic' ? (
		<Container>
			<label>{label}</label>
			<div>
				<Controller
					control={control}
					name={type}
					rules={{
						min: { value: 0, message: '추가요금을 제대로 입력하세요..' },
						validate: (value) => !isNaN(+value) || '정확한 추가요금을 입력하세요.'
					}}
					render={({ field }) => (
						<InputWrapper>
							<InputEndTag
								{...field}
								onChange={(event) => {
									const value = event.target.value
									field.onChange(event)
									debounce(() => setState({ type, value, idx }), 150)
								}}
								// type={typeof field.value}
								className={`form-control ${className}`}
								rows="1"
								min="0"
								max="999999"
								placeholder="요금입력"
							/>
							<EndString>원</EndString>
						</InputWrapper>
					)}
				/>
			</div>
		</Container>
	) : type.minPerson ? (
		!isRoom && (
			<Container>
				<label>{label}</label>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Controller
						control={control}
						name={type.minPerson}
						rules={{
							validate: (value) => !!+value || '정확한 인원수를 입력하세요.',
							min: { value: 0, message: '정확한 인원수를 입력하세요.' }
						}}
						render={({ field }) => (
							<InputWrapper>
								<InputEndTag
									defaultValue={1}
									{...field}
									onChange={(event) => {
										const value = event.target.value
										field.onChange(event)
										debounce(() => setState({ type: type.minPerson, value, idx }), 150)
									}}
									// type={typeof field.value}
									className={`form-control ${className}`}
									rows="1"
									min="0"
									max="99"
									placeholder="최소"
								/>
								<EndString>명</EndString>
							</InputWrapper>
						)}
					/>
					~&nbsp;
					<Controller
						control={control}
						name={type.maxPerson}
						rules={{
							validate: (value) => !!+value || '정확한 인원수를 입력하세요.',
							min: { value: 0, message: '정확한 인원수를 입력하세요.' }
						}}
						render={({ field }) => (
							<InputWrapper style={{ marginLeft: '10px' }}>
								<InputEndTag
									// type={typeof field.value}
									defaultValue={2}
									{...field}
									onChange={(event) => {
										const value = event.target.value
										field.onChange(event)
										debounce(() => setState({ type: type.maxPerson, value, idx }), 150)
									}}
									className={`form-control ${className}`}
									rows="1"
									min="0"
									max="99"
									placeholder="최대"
								/>
								<EndString>명</EndString>
							</InputWrapper>
						)}
					/>
				</div>
			</Container>
		)
	) : type.opStartHour ? (
		<Container>
			<label>
				{label} <span style={{ fontSize: '11px', fontWeight: 150 }}>0~24</span>
			</label>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<Controller
					name={type.opStartHour}
					control={control}
					rules={{
						validate: (value) => !isNaN(+value) || '정확한 운영시간을 입력하세요.',
						min: { value: 0, message: '운영시간은 0보다 작을 수 없습니다.' }
						// max: { value: 24, message: '운영시간은 24보다 클 수 없습니다.' }
					}}
					render={({ field }) => (
						<InputWrapper>
							<InputEndTag
								{...field}
								onChange={(event) => {
									const value = event.target.value
									field.onChange(event)
									debounce(() => setState({ type: type.opStartHour, value, idx }), 150)
								}}
								// type={typeof field.value}
								className={`form-control ${className}`}
								rows="1"
								min="0"
								max="23"
								placeholder="0"
							/>
							<EndString>시</EndString>
						</InputWrapper>
					)}
				/>
				~&nbsp;
				<Controller
					name={type.opEndHour}
					control={control}
					rules={{
						validate: (value) => !isNaN(+value) || '정확한 운영시간을 입력하세요.',
						min: { value: 0, message: '운영시간은 0시보다 작을 수 없습니다.' }
						// max: { value: 24, message: '운영시간은 24시를 넘을 수 없습니다.' }
					}}
					render={({ field }) => (
						<InputWrapper style={{ marginLeft: '10px' }}>
							<InputEndTag
								{...field}
								onChange={(event) => {
									const value = event.target.value
									field.onChange(event)
									debounce(() => setState({ type: type.opEndHour, value, idx }), 150)
								}}
								// type={typeof field.value}
								className={`form-control ${className}`}
								rows="1"
								min="1"
								max="24"
								placeholder="24"
							/>
							<EndString>시</EndString>
						</InputWrapper>
					)}
				/>
			</div>
		</Container>
	) : type === 'cancellableHour' ? (
		<Container>
			<label>{label}</label>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<Controller
					name={type}
					control={control}
					rules={{
						min: { value: 0, message: '취소가능시간을 제대로 입력하세요..' },
						validate: (value) => !isNaN(+value) || '정확한 취소가능시간을 입력하세요.'
					}}
					render={({ field }) => (
						<InputWrapper>
							<input
								{...field}
								onChange={(event) => {
									const value = event.target.value
									field.onChange(event)
									debounce(() => setState({ type, value, idx }), 150)
								}}
								// type="number"
								className={`form-control ${className}`}
								rows="1"
								min="0"
								max="999"
								placeholder="0"
							/>
						</InputWrapper>
					)}
				/>
				<span style={{ marginLeft: '10px', wordBreak: 'keep-all', width: 'fit-content' }}>시간 전까지</span>
			</div>
		</Container>
	) : type === 'pricePerTime' ? (
		<Container>
			{label && <label>{label}</label>}
			<Controller
				name={type}
				control={control}
				rules={{
					required: '요금을 입력하세요..',
					validate: (value) => !isNaN(+value) || '정확한 요금을 입력하세요.'
				}}
				render={({ field }) => (
					<InputWrapper>
						<InputEndTag
							{...field}
							onChange={(event) => {
								const value = event.target.value
								field.onChange(event)
								debounce(() => setState({ type, value, idx }), 150)
							}}
							// type={typeof field.value}
							className={`form-control ${className}`}
							rows="1"
							id="textarea1"
							maxLength="20"
							placeholder={type === 'pricePerTime' ? null : '4인 스터디룸 A'}
						/>
						{type === 'pricePerTime' && <EndString>원</EndString>}
					</InputWrapper>
				)}
			/>
		</Container>
	) : (
		<Container>
			{label && <label>{label}</label>}
			<Controller
				name={type}
				control={control}
				rules={{
					required: type === 'name' ? '스터디룸 명칭을 입력하세요..' : ''
				}}
				render={({ field }) => (
					<InputWrapper>
						<InputEndTag
							{...field}
							onChange={(event) => {
								const value = event.target.value
								field.onChange(event)
								debounce(() => setState({ type, value, idx }), 150)
							}}
							// type={typeof field.value}
							className={`form-control ${className}`}
							rows="1"
							id="textarea1"
							maxLength="20"
							placeholder={type === 'pricePerTime' ? null : '4인 스터디룸 A'}
						/>
						{type === 'pricePerTime' && <EndString>원</EndString>}
					</InputWrapper>
				)}
			/>
		</Container>
	)
}

export default RoomInput

const Container = styled.div`
	width: ${(props) => (props.toggle ? 'fit-content' : '200px')};
`

const InputWrapper = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	width: fit-content;
	min-height: 48px;
`

const EndString = styled.span`
	position: relative;
	right: 20px;
	-webkit-user-select: all;
	-moz-user-select: all;
	-ms-user-select: all;
	user-select: all;
	pointer-events: none;
`
const InputEndTag = styled.input`
	padding-right: 25px !important;
`
