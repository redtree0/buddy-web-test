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
			products: null,
			serviceType: '',
			type: 'buy',
			productSeq: 'select', //상품 select
			amount: '',
			placeSeq: null, //공간 Seq
			selectedPayment: 'cash', //결제방식
			saleDT: '', //시간
			memo: '',
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
				products: this.props.products.sort((a, b) => a.serviceType.localeCompare(b.serviceType)),
				type: 'buy',
				productSeq: 'select',
				selectedPayment: 'cash',
				amount: '',
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				saleDT: moment().format('YYYY-MM-DDTHH:mm'),
				memo: '',
				managerSeq: sessionStorage.getItem('manager_seq')
			})
		}, 0)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, productSeq: 'select' })
		this.reset()
		this.customDialog.handleClose()
	}

	//좌석할당
	handleSend = async () => {
		let data = ''
		if (this.state.selectedMember === null) {
			this.props.onClose('memberSelectChk')
			return
		} else if (this.state.amount === '') {
			this.props.onClose('amountChk')
			return
		} else if (this.state.saleDT === '') {
			this.props.onClose('saleDTChk')
			return
		}

		if (this.state.type === 'buy') {
			data = {
				placeSeq: this.state.placeSeq,
				memberSeq: this.state.selectedMember['seq'],
				userSeq: this.state.selectedMember['userSeq'] ? this.state.selectedMember['userSeq'] : null,
				serviceType: this.state.serviceType,
				productSeq: this.state.productSeq,
				amount: this.state.amount.replace(/,/gi, ''),
				payMethod: this.state.selectedPayment,
				saleDT: this.state.saleDT,
				memo: this.state.memo
			}
		} else if (this.state.type === 'book') {
			data = {
				placeSeq: this.state.placeSeq,
				memberSeq: this.state.selectedMember['seq'],
				serviceType: this.state.serviceType,
				productSeq: null,
				amount: this.state.amount.replace(/,/gi, ''),
				payMethod: this.state.selectedPayment,
				saleDT: this.state.saleDT,
				memo: this.state.memo
			}
		}

		await axios
			.post('/sales', data)
			.then((res) => {
				if (res.data.result === 'success') {
					this.props.onClose('success')
					this.closeDialogReweighing()
				} else if (res.data.message) {
					alert(res.data.message)
				} else {
					alert('오류가 발생했습니다.')
				}
			})
			.catch((error) => console.error(error))
	}

	//구분선택
	SelectTypeChange = (event) => {
		this.setState({ type: event.target.value, productSeq: event.target.value === 'book' ? '' : 'select' })

		if (event.target.value === 'book') {
			this.setState({ serviceType: 'book' })
			document.getElementById('select_product').style.display = 'none'
		} else {
			document.getElementById('select_product').style.display = 'inline-block'
		}
	}

	//상품선택
	SelecthandleChange = (event) => {
		this.setState({ productSeq: event.target.value })

		//상품선택 =>금액 세팅
		if (event.target.value !== 'select') {
			const productFilter = this.state.products.filter((products) => products.seq === event.target.value)
			this.setState({ amount: productFilter[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') })
			this.state.type === 'buy'
				? this.setState({ serviceType: productFilter[0].serviceType })
				: this.state.type === 'book'
				? this.setState({ serviceType: 'book' })
				: ''
		}
	}

	//금액
	amountChange = (value) => {
		const re = /^[0-9\,]+$/
		if (value === '' || re.test(value)) {
			value = value.replace(/,/gi, '')
			value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			this.setState({ amount: value })
		}
	}

	handleFormFieldChange = (name, value) => {
		this.setState({ [name]: value })
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
					innerRef={(ref) => (this.customDialog = ref)}
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
								{'매출 수기등록'}
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
								<Select value={this.state.type} onChange={this.SelectTypeChange} style={{ width: '100px' }}>
									<MenuItem key={'buy'} value={'buy'}>
										{' '}
										{'구매'}{' '}
									</MenuItem>
									{/* <MenuItem key={'refund'} value={'refund'} > {'환불'} </MenuItem> */}
									<MenuItem key={'book'} value={'book'}>
										{' '}
										{'예약'}{' '}
									</MenuItem>
									{/* <MenuItem key={'cancel'} value={'cancel'} > {'예약취소'} </MenuItem> */}
								</Select>

								<div id="select_product" style={{ display: 'inline-block' }}>
									<Select
										value={this.state.productSeq}
										onChange={this.SelecthandleChange}
										style={{ width: '174px', marginLeft: '10px' }}
									>
										<MenuItem key={'select'} value={'select'}>
											{' '}
											{'선택'}{' '}
										</MenuItem>
										{this.state.products
											? this.state.products.map((products) => (
													<MenuItem key={products['seq']} value={products['seq']}>
														{products['serviceType'] === 'desk'
															? '좌석' + '-' + products['name']
															: '락커' + '-' + products['name']}
													</MenuItem>
											  ))
											: null}
									</Select>
								</div>
							</div>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<div style={{ marginTop: '10px', textAlign: 'center' }}>
								<RadioGroup
									aria-label="Payment"
									name="Payment"
									row={true}
									className={classes.group}
									style={{ justifyContent: 'center', width: '270px', display: 'inline-block' }}
									value={this.state.selectedPayment}
									onChange={(e) => this.handleFormFieldChange('selectedPayment', e.target.value)}
								>
									<FormControlLabel value="cash" control={<Radio />} label="현금" />
									<FormControlLabel value="card" control={<Radio />} label="카드" />
									<FormControlLabel value="admin" control={<Radio />} label="캐시" />
								</RadioGroup>
							</div>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<TextField
								placeholder={'금액입력'}
								inputProps={{ maxLength: 7 }}
								style={{ width: '140px', marginLeft: '15px' }}
								value={this.state.amount}
								onChange={(e) => this.amountChange(e.target.value)}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end" id="payAdornment">
											원
										</InputAdornment>
									)
								}}
							/>
						</div>

						<div
							id="self_input"
							className={'row'}
							style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}
						>
							<div style={{ margin: '10px 15px 0px 15px' }}>
								<TextField
									id="datetime-local"
									type="datetime-local"
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.saleDT}
									onChange={(e) => this.handleFormFieldChange('saleDT', e.target.value)}
								/>
							</div>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<TextField
								placeholder="비고"
								style={{ width: '290px', marginLeft: '15px', marginRight: '15px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								multiline
								rows="2"
								rowsMax="4"
								value={this.state.memo ? this.state.memo : ''}
								onChange={(e) => this.handleFormFieldChange('memo', e.target.value)}
							/>
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
