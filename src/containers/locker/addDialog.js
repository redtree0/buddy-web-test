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

			placeSeq: null, //?????? Seq
			lockerNo: null, //?????? ??????
			productSeq: 'select', //?????? select
			memberNm: '', //??????
			product: '', //?????????
			selectedPayment: 'service', //????????????
			startDT: '', //?????? ????????????
			endDT: '', //?????? ????????????
			managerSeq: null, //????????? Seq

			//?????? ?????????
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

	//???????????? ??????
	moveUsagePage = () => {
		// this.props.history.push({
		// 	pathname: '/usage',
		// 	state: { type: 'locker', key: this.state.lockerNo }
		// })
		this.props.onClose('usage')
	}

	//????????????
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

	//????????????
	SelecthandleChange = event => {
		this.setState({ productSeq: event.target.value })

		// => ????????????
		if (event.target.value === 'self') {
			document.getElementById('self_input').style.display = 'block'
		} else {
			document.getElementById('self_input').style.display = 'none'
		}

		//???????????? =>?????? ??????
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

	//???????????? ??????
	PaymentChange = (event, value) => {
		this.setState({ selectedPayment: value })
	}

	//???????????? => ?????? ??????
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
		return suggestion.name ? suggestion.name + ' ( ' + suggestion.phone + ' )' : '???????????? ( ' + suggestion.phone + ' )'
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
					dialogButton={<InsertButton id="addDialog_btn" btnText="????????????" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<CloseIcon className="dialogCancle" onClick={this.closeDialogReweighing} />
						<div className={'row dialog_row'}>
							<span className={'col-md-2'} style={{ textAlign: 'left', width: '150px', fontSize: '26px', fontWeight: '700' }}>
								{this.props.lockerNo + '??? ??????'}
							</span>
							<span className={'col-md-2 seat_span'}>????????????</span>
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
										placeholder: '????????????(?????? ?????? ????????????)',
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
										{'??????'}{' '}
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
										{'????????????'}{' '}
									</MenuItem>
								</Select>
							</div>
						</div>

						<div id="self_input" className={'row dialog_row'} style={{ display: 'none' }}>
							<div style={{ margin: '20px 20px 0px 20px' }}>
								<TextField
									id="date"
									label="????????????"
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
									label="????????????"
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
									<FormControlLabel value="service" control={<Radio />} label="?????????" />
									<FormControlLabel value="admin" control={<Radio />} label="????????????" />
									<FormControlLabel value="cash" control={<Radio />} label="????????????(??????)" />
									<FormControlLabel value="card" control={<Radio />} label="????????????(??????)" />
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
								????????????
							</Button>
							<Button
								className={'dialog_btn_full'}
								variant="outlined"
								onClick={this.handleSend}
								color="primary"
								style={{ marginBottom: '10px' }}
							>
								??????
							</Button>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(addDialog)
