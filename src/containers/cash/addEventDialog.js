import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import MenuItem from '@material-ui/core/MenuItem'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CloseIcon from './images/closeIcon.png'
import Paper from '@material-ui/core/Paper'
import axios from '../../wrapper/axios'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Autosuggest from 'react-autosuggest'
import InputAdornment from '@material-ui/core/InputAdornment'
import MobileDetect from 'mobile-detect'
import { debounce } from '../../utils'

const md = new MobileDetect(window.navigator.userAgent)

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

class addEventDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,

			userSeq: '',
			name: '',
			amount: '',
			selectedPayment: 'minus',

			//회원 검색용
			value: '',
			suggestions: [],
			selectedMember: null,
			disabled: false
		}
	}

	openDialogReweighing = () => {
		this.setState({
			stateDialogReweighing: true,
			value: this.props.searchUser && this.getSuggestionValue(this.props.searchUser)
		})
	}

	closeDialogReweighing = () => {
		this.setState({
			stateDialogReweighing: false,
			userSeq: '',
			name: '',
			amount: '',
			value: '',
			suggestion: [],
			selectedMember: null,
			disabled: false
		})
		this.customDialog.handleClose()
	}

	//등록
	handleSend = async () => {
		if (this.state.userSeq === '' || this.state.amount === null) {
			this.props.onClose('check')
			return
		}

		const data = {
			userSeq: this.state.userSeq,
			amount: this.state.amount.split(',').join('') * (this.state.selectedPayment == 'minus' ? -1 : 1)
		}

		await axios
			.post('/cash/admin', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('add')
					this.closeDialogReweighing()
				}
			})
			.catch(error => console.error(error))
		// this.props.onClose(this.state);
	}

	//기본
	handleFormFieldChange = (prop, value) => {
		this.setState({ [prop]: value })
	}

	//기본
	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
	}

	//금액
	amountChange = value => {
		const re = /^[0-9\,]+$/
		if (value === '' || re.test(value)) {
			value = value.replace(/,/gi, '')
			value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			this.setState({ amount: value })
		}
	}

	//결제방식 선택
	PaymentChange = (event, value) => {
		this.setState({ selectedPayment: value })
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
		this.setState({ selectedMember: suggestion, disabled: true, userSeq: suggestion.seq })
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
				.get('/user/find/' + inputValue)
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
			userSeq: null
		})
	}

	render() {
		const { classes } = this.props
		const { suggestions } = this.state
		return (
			<div>
				<CustomDialog
					title={'캐시 조정'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton btnText="등록" btnContextual="btn-info" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px', padding: md.mobile() ? '0px' : '0 24px 24px' }}>
						<div className={'row'} style={{ width: md.mobile() ? '100%' : '300px', margin: md.mobile() ? '0' : null }}>
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
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<div style={{ marginTop: '20px', textAlign: 'center' }}>
								<TextField
									placeholder={'금액입력'}
									inputProps={{ maxLength: 7 }}
									style={{ width: '100px', marginRight: '10px' }}
									value={this.state.amount}
									onChange={e => this.amountChange(e.target.value)}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" id="payAdornment">
												원
											</InputAdornment>
										)
									}}
								/>
								<RadioGroup
									aria-label="Payment"
									name="Payment"
									row={true}
									style={{ justifyContent: 'center', width: '180px', display: 'inline-block' }}
									className={classes.group}
									value={this.state.selectedPayment}
									onChange={this.PaymentChange}
								>
									<FormControlLabel value="plus" control={<Radio />} label="충전" />
									<FormControlLabel value="minus" control={<Radio />} label="차감" />
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

export default withStyles(styles)(addEventDialog)
