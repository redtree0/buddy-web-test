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
import InputAdornment from '@material-ui/core/InputAdornment'
import axios from '../../wrapper/axios'
import moment from 'moment'
import MobileDetect from 'mobile-detect'
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

const md = new MobileDetect(window.navigator.userAgent)

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
			salesData: null,
			refundReason: 'select',
			cancelUsage: 'true',
			salesHistorySeq: 'select', //상품 select
			amount: '',
			max_amount: '',
			placeSeq: null, //공간 Seq
			managerSeq: null, //관리자 Seq

			//회원 검색용
			value: '',
			suggestions: [],
			selectedMember: null,
			disabled: false,

			hdisabled: true
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			this.setState({
				salesData: null,
				refundReason: 'select',
				salesHistorySeq: 'select',
				amount: '',
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				managerSeq: sessionStorage.getItem('manager_seq')
			})
		}, 0)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, salesHistorySeq: 'select', refundReason: 'select' })
		this.reset()
		this.customDialog.handleClose()
	}

	//등록
	handleSend = async () => {
		let data = ''
		if (this.state.selectedMember === null) {
			this.props.onClose('memberSelectChk')
			return
		}
		if (this.state.refundReason === 'select') {
			this.props.onClose('refundReasonChk')
			return
		}
		if (this.state.salesHistorySeq === 'select') {
			this.props.onClose('salesHistoryChk')
			return
		}
		if (this.state.amount === '') {
			this.props.onClose('amountChk')
			return
		}

		data = {
			placeSeq: this.state.placeSeq,
			salesHistorySeq: this.state.salesHistorySeq,
			amount: this.state.amount.replace(/,/gi, ''),
			cancelUsage: this.state.cancelUsage !== 'false',
			refundReason: this.state.refundReason
		}

		await axios
			.post('/sales/refund', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('success')
					this.closeDialogReweighing()
				}
			})
			.catch(error => console.error(error))
	}

	//환불사유 선택
	SelectTypeChange = event => {
		this.setState({ refundReason: event.target.value })
	}

	//이용내역 선택
	SelecthandleChange = event => {
		this.setState({ salesHistorySeq: event.target.value })

		//이용내역 선택 =>금액 세팅
		if (event.target.value !== 'select') {
			const salesDataFilter = this.state.salesData.filter(salesData => salesData.seq === event.target.value)
			this.setState({ amount: salesDataFilter[0].amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') })
			this.setState({ max_amount: salesDataFilter[0].amount })
		}
	}

	//금액
	amountChange = async value => {
		const re = /^[0-9\,]+$/
		if (value === '' || re.test(value)) {
			value = await value.replace(/,/gi, '')
			value = await value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			let max_amount = await this.state.max_amount

			if (parseInt(value.replace(/,/gi, ''), 10) > parseInt(max_amount, 10)) {
				this.setState({ amount: max_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') })
			} else {
				this.setState({ amount: value })
			}
		}
	}

	//이용취소여부 선택
	cancelUsageChange = (event, value) => {
		this.setState({ cancelUsage: value })
	}

	//시간
	updateDt = e => {
		this.setState({ saleDT: e.target.value })
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
				<img src={CloseIcon} className={classes.resetIcon} onClick={this.reset} alt="" />
			</div>
		)
	}

	getSuggestionValue = suggestion => {
		axios
			.get('/sales/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/member/' + suggestion['seq'] + '/sales', {
				params: {
					onlyBuy: true,
					perPage: 15
				}
			})
			.then(res => {
				const history =
					res.data.salesHistory &&
					res.data.salesHistory.map(el => {
						return {
							...el,
							startDT: el.deskFreeUsage
								? moment(el.deskFreeUsage.startDT, 'YYYY-MM-DD HH:mm:ss').format('M/D')
								: el.deskUsage
								? moment(el.deskUsage.startDT, 'YYYY-MM-DD HH:mm:ss').format('M/D HH:mm')
								: el.roomUsage
								? moment(el.roomUsage.startDT, 'YYYY-MM-DD HH:mm:ss').format('M/D HH시')
								: el.lockerUsage
								? moment(el.lockerUsage.startDT, 'YYYY-MM-DD HH:mm:ss').format('M/D')
								: '',
							endDT: el.deskFreeUsage
								? moment(el.deskFreeUsage.endDT, 'YYYY-MM-DD HH:mm:ss').format('M/D')
								: el.deskUsage
								? moment(el.deskUsage.endDT, 'YYYY-MM-DD HH:mm:ss').format('M/D HH:mm')
								: el.roomUsage
								? moment(el.roomUsage.endDT, 'YYYY-MM-DD HH:mm:ss').format('HH시')
								: el.lockerUsage
								? moment(el.lockerUsage.endDT, 'YYYY-MM-DD HH:mm:ss').format('M/D')
								: ''
						}
					})
				this.setState({ salesData: history })
			})
			.catch(error => console.error(error))

		this.setState({ selectedMember: suggestion, disabled: true, hdisabled: false })

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
			disabled: false,
			hdisabled: true,
			salesHistorySeq: 'select',
			refundReason: 'select',
			amount: '',
			cancelUsage: 'true'
		})
	}

	render() {
		const { classes } = this.props
		const { suggestions } = this.state
		return (
			<div>
				<CustomDialog
					className={'refundDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="refundDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px', padding: md.mobile() ? '0px' : '0 24px 24px' }}>
						<img src={CloseIcon} className="dialogCancle" onClick={this.closeDialogReweighing} alt="" />
						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<span
								className={'col-md-12'}
								style={{ textAlign: 'left', width: '250px', fontSize: '26px', fontWeight: '700' }}
							>
								{'환불등록'}
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

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<div style={{ margin: '20px 16px 0px 16px' }}>
								<Select
									disabled={this.state.hdisabled}
									value={this.state.salesHistorySeq}
									onChange={this.SelecthandleChange}
									style={{ width: '286px' }}
								>
									<MenuItem key={'select'} value={'select'}>
										{'이용내역 선택'}
									</MenuItem>
									{this.state.salesData
										? this.state.salesData.map(salesData => (
												<MenuItem key={salesData['seq']} value={salesData['seq']}>
													{(salesData.roomUsage && salesData.roomUsage.room
														? salesData.roomUsage.room.name
														: salesData.product && salesData.product.name
														? salesData.product.name
														: !salesData.deskUsage
														? ''
														: salesData.deskUsage.timeType == 'real'
														? '실시간'
														: salesData.deskUsage && salesData.deskUsage.timeType == 'day'
														? '지정석'
														: salesData.deskUsage && salesData.deskUsage.timeType == 'free'
														? '자유석'
														: salesData.deskUsage && salesData.deskUsage.timeType == 'time'
														? '1회권'
														: '') +
														(salesData.deskUsage ? `(${salesData.deskUsage.deskNo}번)` : '') +
														(salesData.lockerUsage ? `(${salesData.lockerUsage.lockerNo}번)` : '') +
														` *${salesData.startDT} ~ ${salesData.endDT}`}
												</MenuItem>
										  ))
										: null}
								</Select>
							</div>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<div
								className={'col-md-6'}
								style={{ marginTop: '20px', textAlign: 'center', display: 'inline-block', verticalAlign: 'middle' }}
							>
								<Select value={this.state.refundReason} onChange={this.SelectTypeChange} style={{ width: '130px' }}>
									<MenuItem key={0} value={'select'}>
										{' '}
										{'환불사유'}{' '}
									</MenuItem>
									<MenuItem key={1} value={'불만'}>
										{' '}
										{'불만'}{' '}
									</MenuItem>
									<MenuItem key={2} value={'실수'}>
										{' '}
										{'실수'}{' '}
									</MenuItem>
									<MenuItem key={3} value={'변심'}>
										{' '}
										{'변심'}{' '}
									</MenuItem>
									<MenuItem key={4} value={'버그'}>
										{' '}
										{'버그'}{' '}
									</MenuItem>
									<MenuItem key={4} value={'관리'}>
										{' '}
										{'관리'}{' '}
									</MenuItem>
									<MenuItem key={4} value={'기타'}>
										{' '}
										{'기타'}{' '}
									</MenuItem>
								</Select>
							</div>
							<div
								className={'col-md-6'}
								style={{ marginTop: '20px', textAlign: 'center', display: 'inline-block', verticalAlign: 'middle' }}
							>
								<TextField
									placeholder={'금액입력'}
									inputProps={{ maxLength: 7 }}
									style={{ width: '130px' }}
									value={this.state.amount}
									onChange={e => this.amountChange(e.target.value)}
									InputProps={{
										startAdornment: <InputAdornment position="start"></InputAdornment>,
										endAdornment: (
											<InputAdornment position="end" id="payAdornment">
												원
											</InputAdornment>
										)
									}}
								/>
							</div>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<div style={{ marginTop: '20px', textAlign: 'center' }}>
								<RadioGroup
									aria-label="cancelUsage"
									name="cancelUsage"
									row={true}
									style={{ justifyContent: 'center' }}
									className={classes.group}
									value={this.state.cancelUsage}
									onChange={this.cancelUsageChange}
								>
									<FormControlLabel value="true" control={<Radio />} label="이용취소" />
									<FormControlLabel value="false" control={<Radio />} label="이용유지" />
								</RadioGroup>
							</div>
						</div>

						<div
							className={'row'}
							style={{
								width: md.mobile() ? '100%' : '320px',
								margin: md.mobile() ? '0' : null,
								marginTop: '10px',
								textAlign: 'center'
							}}
						>
							<Button
								variant="outlined"
								onClick={this.closeDialogReweighing}
								color="default"
								style={{ width: '130px', margin: '10px' }}
							>
								취소
							</Button>
							<Button variant="outlined" onClick={this.handleSend} color="primary" style={{ width: '130px', margin: '10px' }}>
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
