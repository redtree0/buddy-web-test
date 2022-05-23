import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
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
import Paper from '@material-ui/core/Paper'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Autosuggest from 'react-autosuggest'
import axios from '../../wrapper/axios'
import moment from 'moment'
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

			products: null,
			placeSeq: null, //공간 Seq
			productSeq: 'select', //상품 select
			memberNm: '', //이름
			product: '', //상품명
			timeType: '', //day/free/char
			deskNo: '',
			selectedPayment: 'service', //결제방식
			selectedSpot: 'cash',
			startDT: '', //상품 시작시간
			endDT: '', //상품 종료시간
			managerSeq: null, //관리자 Seq
			disableCashRadio: false, //앱회원아니거나 직접상품입력이면 선택불가하게

			//회원 검색용
			value: '',
			suggestions: [],
			selectedMember: null,
			disabled: false,

			open: false,

			changeDate: null
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			this.setState({
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				memberNm: '',
				product: '',
				deskNo: '',
				startDT: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
				endDT: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
				managerSeq: sessionStorage.getItem('manager_seq'),
				open: false,
				timeType: this.props.timeType
			})
			this.loadProducts()
		}, 0)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, productSeq: 'select', open: false })
		this.reset()
		this.customDialog.handleClose()
	}

	loadProducts = async () => {
		await axios
			.get('/product/desk/' + JSON.parse(localStorage.getItem('manager_place')).seq, {
				params: { timeType: this.props.timeType, all: true }
			})
			.then(res => {
				this.setState({ products: res.data.products })
			})
			.catch(error => console.error(error))
	}

	//좌석할당
	handleSend = async () => {
		if (this.state.value === '' || !this.state.selectedMember) {
			this.props.onClose('memberNmChk', '회원을 선택해주세요')
		} else if (this.state.productSeq === 'select') {
			this.props.onClose('productChk', '상품을 선택해주세요')
		} else {
			this.usageDesk()
		}
	}

	// 좌석할당 => api호출
	usageDesk = async () => {
		let data = {
			timeType: this.state.timeType,
			placeSeq: this.state.placeSeq,
			productSeq: this.includesCheck(this.state.productSeq) ? null : this.state.productSeq,
			deskNo: this.state.deskNo,
			startDT: moment(this.state.startDT, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss'),
			endDT: this.state.endDT ? moment(this.state.endDT, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : '',
			managerSeq: this.state.managerSeq,
			selectedPayment: this.state.selectedPayment === 'spot' ? this.state.selectedSpot : this.state.selectedPayment
		}
		if (this.state.selectedMember !== null) {
			data.memberSeq = this.state.selectedMember['seq']
			data.userSeq = this.state.selectedMember['userSeq']
		} else {
			data.phone = this.state.value
		}

		await axios
			.post('/desk/add/period', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('deskUse')
					this.closeDialogReweighing()
				} else {
					alert(res.data.message)
				}
			})
			.catch(error => {
				alert('에러가 발생하였습니다.')
				console.error(error)
			})
	}

	includesCheck = productSeq => {
		let res = false
		if (String(productSeq).includes('self') || String(productSeq).includes('real')) {
			res = true
		}
		return res
	}

	//상품선택
	SelecthandleChange = event => {
		if (event.target.value == 'select') {
			document.getElementById('self_input').style.display = 'none'
		} else {
			document.getElementById('self_input').style.display = 'block'
		}

		//상품선택 =>시간 세팅
		const productFilter = this.state.products.filter(products => products.seq === event.target.value)

		if (productFilter[0] && productFilter[0].timeType === 'char') {
			document.getElementById('self_input').style.display = 'none'
		} else if (productFilter[0] && productFilter[0].timeType === 'day') {
			document.getElementById('self_input_deskNo').style.display = 'block'
		} else {
			document.getElementById('self_input_deskNo').style.display = 'none'
		}
		if (!productFilter || !productFilter[0]) return
		else if (productFilter[0].timeType === 'free' || productFilter[0].timeType === 'day') {
			this.setState({
				productSeq: event.target.value,
				disableCashRadio: false,
				timeType: productFilter[0].timeType,
				startDT: moment().format('YYYY-MM-DD'),
				endDT: moment()
					.add(parseInt(productFilter[0].day, 10) - 1 === 0 ? 1 : parseInt(productFilter[0].day, 10) - 1, 'days')
					.format('YYYY-MM-DD'),
				changeDate: parseInt(productFilter[0].day, 10)
			})
		} else if (productFilter[0].timeType === 'char') {
			this.setState({
				productSeq: event.target.value,
				disableCashRadio: false,
				timeType: productFilter[0].timeType,
				startDT: moment().format('YYYY-MM-DD'),
				endDT: '',
				changeDate: parseInt(productFilter[0].time, 10)
			})
		} else {
			this.setState({
				productSeq: event.target.value,
				disableCashRadio: false,
				timeType: productFilter[0].timeType,
				startDT: moment().format('YYYY-MM-DD'),
				changeDate: null
			})
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
	updateStartTime = e => {
		let endDt = moment(e.target.value)
			.add(this.state.changeDate - 1 === 0 ? 1 : this.state.changeDate - 1, 'days')
			.format('YYYY-MM-DD')
		this.setState({ startDT: e.target.value, endDT: endDt })
	}
	updateEndTime = e => {
		this.setState({ endDT: e.target.value })
	}
	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
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
				<img src={CloseIcon} className={classes.resetIcon} onClick={this.reset} alt="" />
			</div>
		)
	}

	getSuggestionValue = suggestion => {
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

	render() {
		const { classes } = this.props
		const { suggestions } = this.state
		return (
			<div>
				<CustomDialog
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="addDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<img src={CloseIcon} className="dialogCancle" onClick={this.closeDialogReweighing} alt="" />

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
								<Select className={'dialog_select'} value={this.state.productSeq} onChange={this.SelecthandleChange}>
									<MenuItem key={'select'} value={'select'}>
										{' '}
										{'선택'}{' '}
									</MenuItem>
									{this.state.products
										? this.state.products.map(products => (
												<MenuItem key={products['seq']} value={products['seq']}>
													{products['name']}
												</MenuItem>
										  ))
										: null}
								</Select>
							</div>
						</div>

						<div id="self_input" className={'row dialog_row'} style={{ display: 'none' }}>
							<div style={{ margin: '20px 20px 0px 20px' }}>
								<TextField
									id="datetime-local1"
									label="시작일"
									type="date"
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.startDT}
									onChange={this.updateStartTime}
								/>
								<TextField
									id="datetime-local2"
									label="종료일"
									type="date"
									disabled={true}
									style={{ marginTop: '20px', marginLeft: '20px' }}
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.endDT}
									onChange={this.updateEndTime}
								/>
							</div>
						</div>

						<div id="self_input_deskNo" className={'row dialog_row'} style={{ display: 'none' }}>
							<div style={{ margin: '20px 20px 0px 20px' }}>
								<TextField
									id="deskNoInput"
									label="좌석번호"
									type="text"
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.deskNo}
									onChange={this.handleChange('deskNo')}
								/>
							</div>
						</div>

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

						<div className={'row dialog_row'} style={{ display: this.state.selectedPayment !== 'spot' ? 'none' : '' }}>
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

						<div className={'row dialog_row'} style={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}>
							<Button
								className={'dialog_btn'}
								variant="outlined"
								onClick={this.handleSend}
								color="primary"
								style={{ marginLeft: '5px' }}
							>
								등록
							</Button>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(addDialog)
