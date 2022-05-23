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
import CloseIcon from '@material-ui/icons/Close'
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

let today = new Date(),
	year = today.getFullYear(),
	month = today.getMonth() + 1,
	day = today.getDate()

class addDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,
			newAdd: true,
			products: null,

			placeSeq: null, //공간 Seq
			lockerNo: null, //락커 번호
			productSeq: 'select', //상품 select
			memberNm: '', //이름
			product: '', //상품명
			selectedPayment: 'service', //결제방식
			startDT: '', //상품 시작시간
			endDT: '', //상품 종료시간
			managerSeq: null, //관리자 Seq

			//회원 검색용
			value: '',
			suggestions: [],
			selectedMember: null,
			disabled: false
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			this.setState({
				productSeq: 'select',
				products: this.props.products,
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				lockerNo: this.props.lockerNo,
				memberNm: '',
				product: '',
				startDT: moment().format('YYYY-MM-DD'),
				endDT: moment()
					.add(1, 'days')
					.format('YYYY-MM-DD'),
				managerSeq: sessionStorage.getItem('manager_seq')
			})
			this.reset()
		}, 0)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, productSeq: 'select' })
		this.reset()
		this.customDialog.handleClose()
	}

	//이용내역 이동
	moveUsagePage = () => {
		// this.props.history.push({
		// 	pathname: '/usage',
		// 	state: { type: 'locker', key: this.state.lockerNo }
		// })
		this.props.onClose('usage')
	}

	//락커할당
	handleSend = async () => {
		let data = ''
		if (this.state.value === '') {
			this.props.onClose('memberNmChk')
			return
		}
		if (this.state.productSeq === 'select') {
			this.props.onClose('productChk')
			return
		}

		if (this.state.selectedMember !== null) {
			data = {
				placeSeq: this.state.placeSeq,
				memberSeq: this.state.selectedMember['seq'],
				userSeq: this.state.selectedMember.userSeq || null,
				lockerNo: this.state.lockerNo,
				productSeq: this.state.productSeq === 'self' ? null : this.state.productSeq,
				startDT: this.state.startDT,
				endDT: this.state.endDT,
				managerSeq: this.state.managerSeq,
				selectedPayment: this.state.selectedPayment
			}
		} else {
			data = {
				placeSeq: this.state.placeSeq,
				phone: this.state.value,
				lockerNo: this.state.lockerNo,
				productSeq: this.state.productSeq === 'self' ? null : this.state.productSeq,
				startDT: this.state.startDT,
				endDT: this.state.endDT,
				managerSeq: this.state.managerSeq,
				selectedPayment: this.state.selectedPayment
			}
		}

		await axios
			.post('/locker/use', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('lockerUse')
					this.closeDialogReweighing()
				} else {
					this.props.onClose('lockerUseError', res.data.message)
				}
			})
			.catch(error => console.error(error))
	}

	//상품선택
	SelecthandleChange = event => {
		this.setState({ productSeq: event.target.value })

		// => 직접입력
		if (event.target.value === 'self') {
			document.getElementById('self_input').style.display = 'block'
		} else {
			document.getElementById('self_input').style.display = 'none'
		}

		//상품선택 =>시간 세팅
		if (event.target.value !== 'self' && event.target.value !== 'select') {
			const productFilter = this.state.products.filter(products => products.seq === event.target.value)
			if (productFilter[0].timeType === 'day') {
				this.setState({
					startDT: moment().format('YYYY-MM-DD'),
					endDT: moment()
						.add(parseInt(productFilter[0].day, 10) - 1, 'days')
						.format('YYYY-MM-DD')
				})
			} else if (productFilter[0].timeType === 'time') {
				this.setState({
					startDT: moment().format('YYYY-MM-DD HH:mm:ss'),
					endDT: moment()
						.add(parseInt(productFilter[0].time, 10), 'hours')
						.format('YYYY-MM-DD HH:mm:ss')
				})
			}
		}
	}

	//결제방식 선택
	PaymentChange = (event, value) => {
		this.setState({ selectedPayment: value })
	}

	//상품선택 => 시간 지정
	updateStartTime = e => {
		this.setState({ startDT: e.target.value })
	}
	updateEndTime = e => {
		this.setState({ endDT: e.target.value })
	}

	addZero = (n, digits) => {
		let zero = ''
		n = n.toString()

		if (n.length < digits) {
			for (let i = 0; i < digits - n.length; i++) zero += '0'
		}
		return zero + n
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
				<CloseIcon className={classes.resetIcon} onClick={this.reset} />
			</div>
		)
	}

	getSuggestionValue = suggestion => {
		this.setState({ selectedMember: suggestion, disabled: true })
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
						<CloseIcon className="dialogCancle" onClick={this.closeDialogReweighing} />
						<div className={'row dialog_row'}>
							<span className={'col-md-2'} style={{ textAlign: 'left', width: '150px', fontSize: '26px', fontWeight: '700' }}>
								{this.props.lockerNo + '번 락커'}
							</span>
							<span className={'col-md-2 seat_span'}>이용가능</span>
						</div>
						<div className={'row dialog_row'}>
							<span className={'col-md-9'}>
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
							</span>
							<span
								className={'col-md-3 seat_span'}
								style={{ position: 'absolute', marginRight: '0px', right: '34px', background: 'red' }}
							>
								{this.props.lockerPwd}
							</span>
						</div>

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
									<MenuItem key={'self'} value={'self'}>
										{' '}
										{'직접입력'}{' '}
									</MenuItem>
								</Select>
							</div>
						</div>

						<div id="self_input" className={'row dialog_row'} style={{ display: 'none' }}>
							<div style={{ margin: '20px 20px 0px 20px' }}>
								<TextField
									id="date"
									label="시작일시"
									type="date"
									style={{ width: '280px' }}
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.startDT}
									onChange={this.updateStartTime}
								/>
								<TextField
									id="date"
									label="종료일시"
									type="date"
									style={{ marginTop: '20px', width: '280px' }}
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.endDT}
									onChange={this.updateEndTime}
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
								onClick={this.moveUsagePage}
								color="default"
								style={{ marginBottom: '10px' }}
							>
								이용내역
							</Button>
							<Button
								className={'dialog_btn_full'}
								variant="outlined"
								onClick={this.handleSend}
								color="primary"
								style={{ marginBottom: '10px' }}
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
