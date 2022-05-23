import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import Select from '@material-ui/core/Select'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import MenuItem from '@material-ui/core/MenuItem'
import moment from 'moment'
import CloseIcon from './images/closeIcon.png'
import axios from '../../wrapper/axios'
import Autosuggest from 'react-autosuggest'
import { debounce } from '../../utils'

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
	suggestionsContainerOpen: {
		// position: 'absolute',
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit * 3,
		left: 0,
		right: 0
	},
	suggestion: {
		display: 'block'
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none'
	},
	resetIcon: {
		width: '20px',
		height: '20px',
		position: 'relative',
		marginTop: '-26px',
		float: 'right',
		opacity: 0.5,
		background: 'white',
		border: '1px solid white',
		borderRadius: '70px',

		'&:hover': {
			cursor: 'pointer',
			opacity: 1
		}
	}
})

function renderSuggestionsContainer(options) {
	const { containerProps, children } = options

	return (
		<Paper {...containerProps} square>
			{children}
		</Paper>
	)
}

class addDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,
			newAdd: true,

			memberNm: '', //이름
			selectedPayment: 'service', //결제방식

			reserveData: [],
			reserveRoomName: null,
			clickDate: null,

			value: '',
			suggestions: [],
			selectedMember: null,
			disabled: false,
			selectedTime: 0.5,
			timeUnit: 60,
			headCount: 1
		}
	}

	openDialogReweighing = () => {
		setTimeout(() => {
			this.setState({
				stateDialogReweighing: true,
				// selectedTime: this.props.selectedTime,
				headCount: this.props.chargeType == 'man' ? this.props.minPerson || 1 : null,
				reserveData: this.props.reserveData,
				reserveRoomName: this.props.reserveRoomName,
				clickDate: this.props.clickDate,
				timeUnit: this.props.timeUnit,
				selectedTime: this.props.timeUnit == 60 ? 1 : 0.5
			})
		}, 0)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	//예약
	handleSend = () => {
		const startHour = this.state.reserveData.hour
		const startMinutes = startHour - Math.trunc(startHour)

		let api_data = {
			placeSeq: this.state.reserveData.placeSeq,
			phone: this.state.value,
			roomSeq: this.state.reserveData.roomSeq,
			roomKey: this.state.reserveData.roomKey,
			startDT: moment(this.state.clickDate)
				.hour(parseInt(startHour))
				.add(startMinutes * 60, 'minutes')
				.format('YYYY-MM-DD HH:mm:ss'),
			endDT: moment(this.endTimeSet(true)).format('YYYY-MM-DD HH:mm:ss'),
			managerSeq: this.state.reserveData.managerSeq,
			payMethod: this.state.selectedPayment,
			headCount: this.state.headCount
		}
		if (this.state.selectedMember === null) {
			if (this.state.value == '' || this.state.value == null) {
				this.props.onClose('memberNmChk')
				return
			} else {
				api_data.phone = this.state.value
			}
		} else {
			api_data.memberSeq = this.state.selectedMember.seq
			api_data.userSeq = this.state.selectedMember.userSeq
		}

		axios
			.post('/room/reserve', api_data)
			.then(res => {
				if (res.data.result == 'success') {
					this.props.onClose({ success: true })
					this.closeDialogReweighing()
				} else if (res.data.result == 'fail') {
					this.props.onClose({ fail: true, msg: res.data.message })
				}
			})
			.catch(error => console.error(error))
	}

	//결제방식 선택
	PaymentChange = (event, value) => {
		this.setState({ selectedPayment: value })
	}

	endTimeSet = isMoment => {
		const time = this.state.reserveData.hour * 1

		const endDateTime = moment(this.state.clickDate)
			.hour(Math.floor(time))
			.minute((time - Math.floor(time)) * 60)
			.add(this.state.selectedTime * 60, 'minutes')

		if (isMoment) {
			return endDateTime
		}
		return time === 24 ? time + '시' : time > 24 ? endDateTime.format('YYYY-MM-DD HH시 mm분') : endDateTime.format('HH시 mm분')
	}

	renderInput = inputProps => {
		const { disabled, classes, ref, ...other } = inputProps

		return (
			<div>
				<TextField
					fullWidth
					disabled={disabled}
					style={{ marginTop: '20px' }}
					inputRef={ref}
					InputProps={{
						classes: {
							input: classes.input
						},
						...other
					}}
				/>
				<img src={CloseIcon} className={classes.resetIcon} onClick={this.reset} />
			</div>
		)
	}

	getSuggestionValue = suggestion => {
		this.setState({ selectedMember: suggestion, disabled: true })
		return suggestion.name + ' ( ' + suggestion.phone + ' )'
	}

	renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const matches = match(suggestion.name, query)
		const parts = parse(suggestion.name, matches)

		return (
			<MenuItem selected={isHighlighted} component="div">
				<div>
					{parts.map((part, index) =>
						part.highlight ? (
							<span key={String(index)} style={{ fontWeight: 300 }}>
								{part.text}
							</span>
						) : (
							<strong key={String(index)} style={{ fontWeight: 500 }}>
								{part.text}
							</strong>
						)
					)}
					{' ( ' + suggestion.phone + ' )'}
				</div>
			</MenuItem>
		)
	}

	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue
		})
	}

	handleFormFieldChange = (name, value) => {
		this.setState({ [name]: value })
	}

	SelecthandleChange = event => {
		this.setState({ selectedTime: event.target.value })
	}

	onSuggestionsFetchRequested = ({ value }) => {
		debounce(() => {
			const inputValue = value.trim().toLowerCase()
			axios
				.get('/member/find/' + inputValue, { params: { placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq } })
				.then(res => {
					this.setState({
						suggestions: res.data
					})
				})
				.catch(error => console.error(error))
		})
	}

	shouldRenderSuggestions = value => {
		return isNaN(value) ? value.trim().length > 1 : value.trim().length > 3
	}

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		})
	}

	reset = () => {
		this.setState({
			value: '',
			selectedMember: null,
			disabled: false
		})
	}

	timeList = () => {
		const list =
			this.state.timeUnit == 30
				? Array(23)
						.fill()
						.map((element, index) => (index + 1) / 2)
				: Array(11)
						.fill()
						.map((element, index) => index + 1)
		return list
	}

	render() {
		const { classes } = this.props
		const { value, suggestions, reserveData } = this.state
		const start = Number.isInteger(reserveData.hour) ? `${reserveData.hour}시` : `${parseInt(reserveData.hour)}시 30분`

		return (
			<div>
				<CustomDialog
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="emptyDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<img src={CloseIcon} className="dialogCancle" onClick={this.closeDialogReweighing} />
						<div className={'row dialog_row'}>
							<span className={'col-md-4'} style={{ textAlign: 'left', width: '220px', fontSize: '22px', fontWeight: '900' }}>
								{this.state.reserveRoomName}
							</span>
							<span className={'col-md-2 seat_span'}>예약가능</span>
						</div>

						<div className={'row dialog_row'}>
							<span className={'col-md-2 seat_row_span'}>
								{this.state.clickDate
									? moment(this.state.clickDate).format('YYYY-MM-DD') + ' ' + start + ' ~ ' + this.endTimeSet()
									: null}
							</span>
						</div>

						<Autosuggest
							theme={{
								suggestionsContainerOpen: classes.suggestionsContainerOpen,
								suggestionsList: classes.suggestionsList,
								suggestion: classes.suggestion
							}}
							renderInputComponent={this.renderInput}
							suggestions={suggestions}
							shouldRenderSuggestions={this.shouldRenderSuggestions}
							onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
							onSuggestionsClearRequested={this.onSuggestionsClearRequested}
							renderSuggestionsContainer={renderSuggestionsContainer}
							getSuggestionValue={this.getSuggestionValue}
							renderSuggestion={this.renderSuggestion}
							inputProps={{
								classes,
								placeholder: '회원검색(이름 또는 전화번호)',
								value: this.state.value,
								onChange: this.onChange,
								disabled: this.state.disabled
							}}
						/>

						<div className={'row dialog_row'}>
							<div style={{ margin: '20px 20px 0px 20px' }}>
								<Select className={'dialog_select'} value={this.state.selectedTime} onChange={this.SelecthandleChange}>
									{this.timeList().map(value => (
										<MenuItem key={value} value={value}>
											{' '}
											{parseInt(value) === value ? `${parseInt(value)}시간` : `${parseInt(value)}시간 30분`}
										</MenuItem>
									))}
								</Select>
							</div>
						</div>

						{this.props.chargeType == 'man' && (
							<div className={'row dialog_row'}>
								<div style={{ margin: '18px 6px 0px' }}>
									<TextField
										placeholder={'인원수'}
										inputProps={{ maxLength: 3 }}
										style={{ width: '80px', marginLeft: '15px' }}
										value={this.state.headCount}
										onChange={e => this.handleFormFieldChange('headCount', e.target.value)}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end" id="payAdornment">
													명
												</InputAdornment>
											)
										}}
									/>
								</div>
							</div>
						)}

						<div className={'row dialog_row'}>
							<div style={{ marginTop: '20px', textAlign: 'center' }}>
								<RadioGroup
									aria-label="Payment"
									name="Payment"
									row={true}
									style={{ justifyContent: 'center' }}
									className={classes.group}
									value={this.state.selectedPayment}
									onChange={this.PaymentChange}
								>
									<FormControlLabel value="service" control={<Radio />} label="서비스" />
									<FormControlLabel value="admin" control={<Radio />} label="캐시차감" />
									<FormControlLabel value="cash" control={<Radio />} label="현장결제(현금)" />
									<FormControlLabel value="card" control={<Radio />} label="현장결제(카드)" />
								</RadioGroup>
							</div>
						</div>

						<div className={'row dialog_row'} style={{ marginTop: '10px', textAlign: 'center' }}>
							<Button
								className={'dialog_btn_full'}
								variant="outlined"
								onClick={this.handleSend}
								color="primary"
								style={{ marginBottom: '10px' }}
							>
								예약
							</Button>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(addDialog)
