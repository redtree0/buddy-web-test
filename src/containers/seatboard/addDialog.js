import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import DeskCancelDialog from './deskCancelDialog'
import UsageDialog from './usageDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CloseIcon from './images/closeIcon.png'
import CancelIcon from './images/cancelIcon.png'
import Paper from '@material-ui/core/Paper'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Autosuggest from 'react-autosuggest'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { debounce } from '../../utils'

const styles = (theme) => ({
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
			deskCancelisOpen: false,
			deskUsageisOpen: false,
			deskUsageMsg: '',

			newAdd: true,
			products: this.props.products || null,
			deskReserved: null,
			placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq || null, //공간 Seq
			deskNo: this.props.seatNo || null, //좌석 번호
			deskKey: this.props.seatKey || null, //좌석 키
			deskType: null,
			selectedUsageSeq: 'select',
			selectedProductSeq: 'select', //상품 select
			memberNm: '', //이름
			product: '', //상품명
			timeType: 'time', //time/day/free/real/char
			selectedPayment: 'service', //결제방식
			selectedSpot: 'cash',
			startDT: '', //상품 시작시간
			endDT: '', //상품 종료시간
			freeEndDT: '', //자유석 종료일
			managerSeq: null, //관리자 Seq
			disableCashRadio: false, //앱회원아니거나 직접상품입력이면 선택불가하게

			//회원 검색용
			value: '',
			suggestions: [],
			selectedMember: null,
			disabled: false,
			currentFreeUsage: null,
			currentCharUsage: null,

			open: false,
			cancelSeq: null,

			changeType: null,
			changeDate: null,
			changeHour: null,
			endDateDisplay: 'block',
			endDateDisabled: false
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			this.setState({
				products: this.props.products,
				deskReserved: this.props.deskReserved,
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				deskKey: this.props.seatKey,
				deskNo: this.props.seatNo,
				deskType:
					this.props.deskType == 'seat_01'
						? 'open'
						: this.props.deskType == 'seat_02'
						? 'semi'
						: this.props.deskType == 'seat_03'
						? 'close'
						: this.props.deskType == 'office_s01'
						? 'round'
						: this.props.deskType == 'sofa_s01'
						? 'sofa'
						: this.props.deskType == 'two_s01'
						? 'dual'
						: 'all',
				memberNm: '',
				product: '',
				startDT: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
				endDT: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
				managerSeq: sessionStorage.getItem('manager_seq'),
				open: false
			})
		}, 0)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, selectedUsageSeq: 'select', selectedProductSeq: 'select', open: false })
		this.reset()
		this.customDialog.handleClose()
		this.props.onClose('change')
	}

	//ExtensionDialog Close Event
	closeEvent = async (data) => {
		this.setState({ deskCancelisOpen: false, deskUsageisOpen: false })
		if (!data) return

		//예약취소
		if (data === 'deskCancel') {
			await axios
				.post('/desk/cancel', {
					deskUsageSeq: this.state.cancelSeq
				})
				.then((res) => {
					if (res.data.result === 'success') {
						this.setState({
							deskReserved: this.state.deskReserved.filter((data) => data.seq !== this.state.cancelSeq)
						})
					}
				})
				.catch((error) => console.error(error))
		} else if (data === 'continue') {
			// 좌석할당
			this.usageDesk(true)
		}
	}

	//좌석할당
	handleSend = async () => {
		if (this.state.value === '' || !this.state.selectedMember) {
			this.props.onClose('memberNmChk')
		} else if (this.state.selectedProductSeq === 'select' && this.state.selectedUsageSeq === 'select') {
			this.props.onClose('productChk')
		} else {
			this.usageDesk()
		}
	}

	// 좌석할당 => api호출
	usageDesk = async (mustUse) => {
		let data = {
			mustUse: mustUse ? mustUse : null,
			placeSeq: this.state.placeSeq,
			deskNo: this.state.deskNo,
			deskKey: this.state.deskKey,
			deskType: this.state.deskType,
			productSeq: this.getProductSeq(),
			deskFreeUsageSeq:
				this.state.currentFreeUsage &&
				this.state.currentFreeUsage.seq === this.state.selectedUsageSeq &&
				this.state.selectedUsageSeq,
			deskCharUsageSeq:
				this.state.currentCharUsage &&
				this.state.currentCharUsage.seq === this.state.selectedUsageSeq &&
				this.state.selectedUsageSeq,
			timeType: this.state.timeType,
			startDT: moment(this.state.startDT, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss'),
			endDT: moment(this.state.endDT, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss'),
			freeEndDT:
				this.state.freeEndDT && this.state.freeEndDT.length > 0
					? moment(this.state.freeEndDT, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss')
					: null,
			managerSeq: this.state.managerSeq,
			selectedPayment: this.state.selectedPayment === 'spot' ? this.state.selectedSpot : this.state.selectedPayment
		}
		if (this.state.selectedMember) {
			data = {
				...data,
				memberSeq: this.state.selectedMember['seq'],
				userSeq: this.state.selectedMember['userSeq']
			}
		} else {
			data = {
				...data,
				phone: this.state.value
			}
		}

		let url = '/desk/use'
		if (this.state.selectedUsageSeq != 'select') url += '/period'

		await axios
			.post(url, data)
			.then((res) => {
				if (res.data.result === 'success') {
					this.props.onClose('deskUse')
					this.closeDialogReweighing()
				} else if (res.data.code == 211) {
					this.setState({ deskUsageisOpen: true, deskUsageMsg: res.data.message })
				} else {
					alert(res.data.message)
				}
			})
			.catch((error) => {
				alert('에러가 발생하였습니다.')
				console.error(error)
			})
	}

	getProductSeq = () => {
		if (this.state.selectedProductSeq != 'select') {
			if (!String(this.state.selectedProductSeq).includes('self') && !String(this.state.selectedProductSeq).includes('real'))
				return this.state.selectedProductSeq
		} else if (this.state.selectedUsageSeq != 'select') {
			if (this.state.currentFreeUsage && this.state.currentFreeUsage.seq == this.state.selectedUsageSeq)
				return this.state.currentFreeUsage.product.seq
			else if (this.state.currentCharUsage && this.state.currentCharUsage.seq == this.state.selectedUsageSeq)
				return this.state.currentCharUsage.product.seq
		}
	}

	//기존 이용권 선택
	handleSelectUsage = (e) => {
		if (e.target.value == 'select') return
		this.setState({
			selectedUsageSeq: e.target.value,
			selectedProductSeq: 'select',
			startDT: moment().format('YYYY-MM-DDTHH:mm'),
			freeEndDT: null,
			endDateDisplay: 'block'
		})

		if (this.state.currentFreeUsage.seq === e.target.value) {
			this.setState({
				timeType: 'free',
				endDT: moment().add(this.state.currentFreeUsage.remainMinutes, 'minutes').format('YYYY-MM-DDTHH:mm'),
				changeType: 'free',
				changeHour: this.state.currentFreeUsage.product.time,
				endDateDisabled: this.state.currentFreeUsage.remainMinutes > 0 ? true : false
			})
		} else if (this.state.currentCharUsage && this.state.currentCharUsage.seq === e.target.value) {
			this.setState({
				timeType: 'char',
				endDT: moment().add(this.state.currentCharUsage.remainMinutes, 'minutes').format('YYYY-MM-DDTHH:mm'),
				changeType: 'char',
				changeHour: this.state.currentCharUsage.product.time,
				endDateDisabled: this.state.currentCharUsage.remainMinutes > 0 ? true : false
			})
		}
	}

	//상품선택
	handleSelectProduct = (event) => {
		if (event.target.value == 'select') return
		this.setState({ selectedProductSeq: event.target.value, selectedUsageSeq: 'select' })

		//상품선택 =>시간 세팅
		const productFilter = this.state.products.filter((products) => products.seq === event.target.value)

		const thisDate = moment().format('YYYY-MM-DDTHH:mm')
		if (productFilter.length > 0) {
			let params = {
				disableCashRadio: false,
				timeType: productFilter[0].timeType,
				startDT: thisDate,
				freeEndDT: null,
				changeType: productFilter[0].timeType,
				changeDate: null,
				changeHour: null,
				endDateDisplay: 'block',
				endDateDisabled: true
			}
			if (productFilter[0].timeType === 'free') {
				this.setState({
					...params,
					endDT: moment().add(parseInt(productFilter[0].time, 10), 'hours').format('YYYY-MM-DDTHH:mm'),
					freeEndDT: moment()
						.add(parseInt(productFilter[0].day, 10) - 1 === 0 ? 1 : parseInt(productFilter[0].day, 10) - 1, 'days')
						.format('YYYY-MM-DD'),
					changeDate: parseInt(productFilter[0].day, 10),
					changeHour: parseInt(productFilter[0].time, 10)
				})
			} else if (productFilter[0].timeType === 'day') {
				this.setState({
					...params,
					startDT: moment().hour(0).minute(0).format('YYYY-MM-DDTHH:mm'),
					endDT: moment()
						.add(parseInt(productFilter[0].day, 10) - 1 === 0 ? 1 : parseInt(productFilter[0].day, 10) - 1, 'days')
						.hour(23)
						.minute(59)
						.format('YYYY-MM-DDTHH:mm'),
					changeDate: parseInt(productFilter[0].day, 10)
				})
			} else if (productFilter[0].timeType === 'time' || productFilter[0].timeType === 'char') {
				this.setState({
					...params,
					endDT: moment().add(parseInt(productFilter[0].time, 10), 'hours').format('YYYY-MM-DDTHH:mm'),
					changeType: 'time',
					changeHour: parseInt(productFilter[0].time, 10)
				})
			} else {
				this.setState(params)
			}
		} else {
			let params = {
				disableCashRadio: true,
				startDT: thisDate,
				endDT: thisDate,
				timeType: event.target.value,
				freeEndDT: null,
				changeType: null,
				changeDate: null,
				changeHour: null,
				endDateDisplay: 'block',
				endDateDisabled: false
			}
			if (event.target.value === 'real') {
				// 실시간
				this.setState({
					...params,
					disableCashRadio: false,
					endDT:
						this.props.initMinutes > 0
							? moment(thisDate).add(this.props.initMinutes, 'minutes').format('YYYY-MM-DDTHH:mm')
							: moment(thisDate).add(this.props.unitTime, 'minutes').format('YYYY-MM-DDTHH:mm'),
					changeType: 'real',
					endDateDisplay: 'none',
					endDateDisabled: true
				})
			} else if (event.target.value === 'self_time') {
				// 직접입력(1회권)
				this.setState({
					...params,
					timeType: 'time'
				})
			} else if (event.target.value === 'self_day') {
				// 직접입력(지정석)
				this.setState({
					...params,
					timeType: 'day'
				})
			} else if (event.target.value === 'self_free') {
				// 직접입력(자유석)
				this.setState({
					...params,
					timeType: 'free',
					endDT: moment().add(10, 'hours').format('YYYY-MM-DDTHH:mm'),
					freeEndDT: moment().add(1, 'month').subtract(1, 'days').format('YYYY-MM-DD')
				})
			} else {
				this.setState({
					...params,
					timeType: 'time'
				})
			}
		}
	}

	//결제방식 선택
	PaymentChange = (event, value) => {
		this.setState({ selectedPayment: value })
	}
	PaymentChange2 = (event, value) => {
		this.setState({ selectedSpot: value })
	}

	//상품선택 => 시간 지정
	updateStartTime = (e) => {
		console.log(e)
		if (this.state.changeType) {
			let endDt = '',
				freeEndDt = null
			if (this.state.changeType === 'day') {
				endDt = moment(e.target.value)
					.add(this.state.changeDate - 1 === 0 ? 1 : this.state.changeDate - 1, 'days')
					.hour(23)
					.minute(59)
			} else if (this.state.changeType === 'free') {
				endDt = moment(e.target.value)
				if (this.state.currentFreeUsage && this.state.currentFreeUsage.seq) {
					endDt = endDt.add(this.state.currentFreeUsage.remainMinutes, 'minutes')
				} else {
					endDt = endDt.add(this.state.changeHour, 'hours')
				}
				freeEndDt = moment(e.target.value)
					.add(this.state.changeDate - 1 === 0 ? 1 : this.state.changeDate - 1, 'days')
					.format('YYYY-MM-DD')
			} else if (this.state.changeType === 'char') {
				endDt = moment(e.target.value)
				if (this.state.currentCharUsage && this.state.currentCharUsage.seq) {
					endDt = endDt.add(this.state.currentCharUsage.remainMinutes, 'minutes')
				} else {
					endDt = endDt.add(this.state.changeHour, 'hours')
				}
			} else if (this.state.changeType === 'time') {
				endDt = moment(e.target.value).add(this.state.changeHour, 'hours')
			} else if (this.state.changeType === 'real') {
				endDt =
					this.props.initMinutes > 0
						? moment(e.target.value).add(this.props.initMinutes, 'minutes')
						: moment(e.target.value).add(this.props.unitTime, 'minutes')
			}
			this.setState({ startDT: e.target.value, endDT: endDt.format('YYYY-MM-DDTHH:mm'), freeEndDT: freeEndDt })
		}
	}
	updateEndTime = (e) => {
		this.setState({ endDT: e.target.value })
	}
	updateFreeEndTime = (e) => {
		this.setState({ freeEndDT: e.target.value })
	}

	renderInput = (inputProps) => {
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
				<img src={CloseIcon} className={classes.resetIcon} onClick={this.reset} alt="" />
			</div>
		)
	}

	getSuggestionValue = (suggestion) => {
		//회원 기존 이용권 조회(자유석,충전권)
		axios
			.get('/member/period/current/', { params: { memberSeq: suggestion.seq } })
			.then((res) => {
				this.setState({
					currentFreeUsage: { ...res.data.deskFreeUsage, remainMinutes: res.data.deskFreeRemainMinutes },
					currentCharUsage: { ...res.data.deskCharUsage, remainMinutes: res.data.deskCharRemainMinutes }
				})
			})
			.catch((error) => console.error(error))

		this.setState({ selectedMember: suggestion, disabled: true, disableCashRadio: suggestion.userSeq == null })
		return suggestion.name ? suggestion.name + ' ( ' + suggestion.phone + ' )' : '이름없음 ( ' + suggestion.phone + ' )'
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

	onSuggestionsFetchRequested = ({ value }) => {
		debounce(() => {
			const inputValue = value.trim().toLowerCase()
			axios
				.get('/member/find/' + inputValue, { params: { placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq } })
				.then((res) => {
					this.setState({
						suggestions: res.data
					})
				})
				.catch((error) => console.error(error))
		})
	}

	shouldRenderSuggestions = (value) => {
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
			disabled: false,
			selectedProductSeq: 'select',
			selectedUsageSeq: 'select'
		})
	}

	handleClick = () => {
		this.setState({ open: !this.state.open })
	}

	//예약 취소
	drCancel = async (seq) => {
		this.setState({ cancelSeq: seq })
		if (this.state.deskCancelisOpen) {
			this.setState({ deskCancelisOpen: false })
		} else {
			this.setState({ deskCancelisOpen: true })
		}
	}

	render() {
		const { classes } = this.props
		const { suggestions } = this.state
		return (
			<div>
				<DeskCancelDialog open={this.state.deskCancelisOpen} title={'예약취소'} onClose={this.closeEvent} />
				<UsageDialog
					open={this.state.deskUsageisOpen}
					message={this.state.deskUsageMsg}
					title={'좌석할당'}
					onClose={this.closeEvent}
				/>

				<CustomDialog
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="addDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<img src={CloseIcon} className="dialogCancle" onClick={this.closeDialogReweighing} alt="" />
						<div className={'row dialog_row'}>
							<span className={'col-md-2'} style={{ textAlign: 'left', width: '240px', fontSize: '26px', fontWeight: '700' }}>
								{this.props.seatNo ?? '-' + ' 번 좌석'}
							</span>
							<span className={'col-md-2 seat_span'}>이용가능</span>
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

						<div
							className={`row dialog_row ${
								(!this.state.selectedMember ||
									this.state.selectedProductSeq != 'select' ||
									((!this.state.currentCharUsage || !this.state.currentCharUsage.seq) &&
										(!this.state.currentFreeUsage || !this.state.currentFreeUsage.seq))) &&
								'hidden'
							}`}
						>
							<div style={{ margin: '20px 20px 0px 20px' }}>
								<label style={{ marginRight: '8px' }}>기존 이용권</label>
								<Select className={'dialog_select'} value={this.state.selectedUsageSeq} onChange={this.handleSelectUsage}>
									<MenuItem key={'select'} value={'select'}>
										{' '}
										{'선택'}{' '}
									</MenuItem>
									{this.state.currentCharUsage && this.state.currentCharUsage.seq && (
										<MenuItem key={this.state.currentCharUsage.seq} value={this.state.currentCharUsage.seq}>
											{this.state.currentCharUsage.product['name']}
										</MenuItem>
									)}
									{this.state.currentFreeUsage && this.state.currentFreeUsage.seq && (
										<MenuItem key={this.state.currentFreeUsage.seq} value={this.state.currentFreeUsage.seq}>
											{this.state.currentFreeUsage.product['name']}
										</MenuItem>
									)}
								</Select>
							</div>
						</div>

						<div
							className={`row dialog_row ${
								(!this.state.selectedMember || this.state.selectedUsageSeq !== 'select') && 'hidden'
							}`}
						>
							<div style={{ margin: '20px 20px 0px 20px' }}>
								<label style={{ marginRight: '8px' }}>신규 이용권</label>
								<Select
									className={'dialog_select'}
									value={this.state.selectedProductSeq}
									onChange={this.handleSelectProduct}
								>
									<MenuItem key={'select'} value={'select'}>
										{' '}
										{'선택'}{' '}
									</MenuItem>
									{this.state.products
										? this.state.products.map((products) => (
												<MenuItem key={products['seq']} value={products['seq']}>
													{products['name']}
												</MenuItem>
										  ))
										: null}
									<MenuItem key={'real'} value={'real'}>
										{' '}
										{'실시간'}{' '}
									</MenuItem>
									<MenuItem key={'self_time'} value={'self_time'}>
										{' '}
										{'직접입력(1회권)'}{' '}
									</MenuItem>
									<MenuItem key={'self_day'} value={'self_day'}>
										{' '}
										{'직접입력(지정석)'}{' '}
									</MenuItem>
									{/* <MenuItem key={'self_free'} value={'self_free'}>
										{' '}
										{'직접입력(자유석)'}{' '}
									</MenuItem> */}
								</Select>
							</div>
						</div>

						<div
							id="self_input"
							className={`row dialog_row ${
								!this.state.selectedMember ||
								(this.state.selectedProductSeq == 'select' && this.state.selectedUsageSeq == 'select')
									? 'hidden'
									: ''
							}`}
						>
							<div style={{ margin: '20px 20px 0px 20px' }}>
								<TextField
									id="datetime-local1"
									label="시작일시"
									type="datetime-local"
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.startDT}
									onChange={this.updateStartTime}
								/>
								<TextField
									id="datetime-local2"
									label="종료일시"
									type="datetime-local"
									disabled={this.state.endDateDisabled}
									style={{ marginTop: '20px', display: this.state.endDateDisplay }}
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.endDT}
									onChange={this.updateEndTime}
								/>
								{this.state.timeType == 'free' && !this.state.currentFreeUsage ? (
									<TextField
										id="date3"
										label="자유석 종료일"
										type="date"
										style={{ marginTop: '20px', display: this.state.endDateDisplay }}
										className={classes.textField}
										InputLabelProps={{
											shrink: true
										}}
										value={this.state.freeEndDT}
										onChange={this.updateFreeEndTime}
										disabled={this.state.changeType == 'free'}
									/>
								) : (
									''
								)}
							</div>
						</div>

						<div
							className={`row dialog_row ${
								!this.state.selectedMember || this.state.selectedProductSeq == 'select' ? 'hidden' : ''
							}`}
						>
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
									<FormControlLabel
										value="admin"
										control={<Radio />}
										label="캐시차감"
										disabled={this.state.disableCashRadio ? true : false}
									/>
									<FormControlLabel value="spot" control={<Radio />} label="현장결제" />
								</RadioGroup>
							</div>
						</div>

						<div
							className={`row dialog_row ${
								(!this.state.selectedMember ||
									this.state.selectedProductSeq == 'select' ||
									this.state.selectedPayment !== 'spot') &&
								'hidden'
							}`}
						>
							<div style={{ marginTop: '0px', textAlign: 'center' }}>
								<RadioGroup
									aria-label="Payment"
									name="Payment"
									row={true}
									style={{ justifyContent: 'center' }}
									className={classes.group}
									value={this.state.selectedSpot}
									onChange={this.PaymentChange2}
								>
									<FormControlLabel value="cash" control={<Radio />} label="현금" />
									<FormControlLabel value="card" control={<Radio />} label="카드" />
								</RadioGroup>
							</div>
						</div>

						<div className={'row dialog_row'} style={{ marginTop: '20px', marginBottom: '10px', textAlign: 'center' }}>
							<Button
								className={'dialog_btn'}
								variant="outlined"
								onClick={() => {
									this.props.onClose('usage')
								}}
								color="default"
								style={{ marginRight: '5px' }}
							>
								이용내역
							</Button>
							<Button
								className={'dialog_btn'}
								variant="outlined"
								onClick={this.handleSend}
								color="primary"
								style={{ marginLeft: '5px' }}
							>
								좌석할당
							</Button>
						</div>

						{this.state.deskReserved ? (
							this.state.deskReserved.length > 0 ? (
								<div>
									<List component="nav">
										<ListItem button onClick={this.handleClick}>
											<ListItemText inset primary="예약" /> {this.state.deskReserved.length}개
											{this.state.open ? <ExpandLess /> : <ExpandMore />}
										</ListItem>
										<Collapse in={this.state.open} timeout="auto" unmountOnExit>
											<List component="div" disablePadding>
												{this.state.deskReserved.map((dr, i) => (
													<ListItem button key={i}>
														<ListItemText inset style={{ paddingLeft: '0px', textAlign: 'center' }}>
															<span>
																{moment(dr.startDT).format('MM/DD HH:mm') +
																	' ~ ' +
																	moment(dr.endDT).format('MM/DD HH:mm')}
															</span>
															<img
																src={CancelIcon}
																className="cancleIcon"
																onClick={this.drCancel.bind(this, dr.seq)}
																alt=""
															/>
														</ListItemText>
													</ListItem>
												))}
											</List>
										</Collapse>
									</List>
								</div>
							) : null
						) : null}
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(addDialog)
