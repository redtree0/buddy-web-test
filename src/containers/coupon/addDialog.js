import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CloseIcon from './images/closeIcon.png'
import Paper from '@material-ui/core/Paper'
import axios from '../../wrapper/axios'
import moment from 'moment'
import MobileDetect from 'mobile-detect'

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

const makePlainData = (context) => {
	const handler = {
		get: function (target, name) {
			return Object.prototype.hasOwnProperty.call(target, name) ? target[name] : ''
		}
	}

	const _ = new Proxy(context, handler)
	return {
		seq: _.seq,
		name: _.name,
		code: _.code,
		usedCount: _.usedCount,
		issuedCount: _.issuedCount,
		minPrice: _.minPrice,
		startDate: moment(_.startDate ? _.startDate : new Date()).format('YYYY-MM-DD'),
		endDate: (_.endDate ? moment(_.endDate) : moment().add(3, 'month')).format('YYYY-MM-DD'),
		type: _.type ? _.type : 'discountAmount',
		discountAmount: _.discountAmount,
		discountRate: _.discountRate,
		bonusAmount: _.bonusAmount,
		bonusRate: _.bonusRate,
		isActive: !!_.isActive
	}
}

class addDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			title: '쿠폰 등록', // 쿠폰 수정
			buttonText: '등록', // 수정
			handler: null,

			stateDialogReweighing: false,
			amount: '',

			disabled: false,
			...makePlainData({})
		}
		this.id = 'addDialog_btn'
	}

	static popup() {
		const button = document.getElementById('addDialog_btn')
		button && button.click()
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			this.loadValue()
		}, 0)
	}

	async handleCreate(params) {
		return axios.post('/coupon', params)
	}

	async handleEdit(params) {
		if (!this.props.couponSeq) {
			console.error('couponSeq가 없음')
		}

		return axios.put(`/coupon/${this.props.couponSeq}`, params)
	}

	loadValue = async () => {
		try {
			if (!this.props.couponSeq) {
				this.setState({
					title: '쿠폰 등록',
					buttonText: '등록',
					handler: this.handleCreate.bind(this)
				})
				this.setState(makePlainData({}))
				return
			}

			const res = await axios.get(`coupon/${this.props.couponSeq}`, {
				headers: { 'Context-type': 'application/json' }
			})
			const { data } = res
			if (data !== '' && data !== null) {
				this.setState(makePlainData(data))
				this.setState({
					title: '쿠폰 수정',
					buttonText: '수정',
					handler: this.handleEdit.bind(this)
				})
			}
		} catch (err) {
			console.error(err)
		}
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.reset()
		this.customDialog.handleClose()
	}

	//좌석할당
	handleSend = async () => {
		const { state } = this
		const params = makePlainData(state)
		const { handler } = state

		try {
			if (typeof handler !== 'function') {
				throw new Error('this.state.handler not function')
			}

			const res = await handler(params)
			const { data } = res
			const { result } = data

			if (result === 'success') {
				this.props.onClose('success')
				this.closeDialogReweighing()
			} else {
				this.props.onClose(data.message ? data.message : '실패하였습니다.')
				this.closeDialogReweighing()
			}
		} catch (err) {
			this.props.onClose('fail')
			console.error(err)
		}
	}

	handleChange = (name, isValid) => (event) => {
		if (event.target) {
			let val = event.target.value
			if (typeof isValid === 'function' && !isValid(val)) {
				this.props.onClose(name)
				return
			}
			if (val === 'true') val = true
			else if (val === 'false') val = false
			this.setState({ [name]: val })
		}
	}

	reset = () => {
		this.setState({
			value: '',
			searchValue: '',
			disabled: false
		})
	}

	render() {
		const { classes } = this.props
		const rowStyle = md.mobile() ? { width: '100%', margin: '0' } : { width: '460px', margin: null }
		const rowLeftSideStyle = { textAlign: 'center', marginTop: '20px' }
		const rowRightSideStyle = { width: '290px', marginLeft: '15px', marginRight: '15px' }

		const discountInput = {
			discountAmount: (
				<div className={'row'} style={{ rowStyle }}>
					<span className="col-md-3" style={rowLeftSideStyle}>
						할인금액
					</span>
					<TextField
						placeholder="0 원"
						style={{ rowRightSideStyle }}
						className={'col-md-9'}
						margin="normal"
						type="text"
						rows="1"
						max="999999"
						min="0"
						value={this.state.discountAmount ? this.state.discountAmount : ''}
						onChange={this.handleChange('discountAmount').bind(this)}
					/>
				</div>
			),
			discountRate: (
				<div className={'row'} style={{ rowStyle }}>
					<span className="col-md-3" style={rowLeftSideStyle}>
						할인률
					</span>
					<TextField
						placeholder="0.0 %"
						style={{ rowRightSideStyle }}
						className={'col-md-9'}
						margin="normal"
						type="text"
						rows="1"
						value={this.state.discountRate ? this.state.discountRate : ''}
						onChange={this.handleChange('discountRate', (v) => v <= 100.0 && v >= 0.0).bind(this)}
					/>
				</div>
			)
			/* 'bonusAmount' : <div className={'row'} style={{ rowStyle }}>
			<span
				className="col-md-3"
				style={ rowLeftSideStyle }
			>
				보너스금액
			</span>
			<TextField
				placeholder="0 원"
				style={{ rowRightSideStyle }}
				className={'col-md-9'}
				margin="normal"
				type="text"
				multiline
				rows="1"
				rowsMax="4"
				value={this.state.bonusAmount ? this.state.bonusAmount : ''}
				onChange={this.handleChange('bonusAmount').bind(this)}
			/>
			</div>,
			'bonusRate' : <div className={'row'} style={{ rowStyle }}>
			<span
				className="col-md-3"
				style={ rowLeftSideStyle }
			>
				보너스%
			</span>
			<TextField
				placeholder="0.0 %"
				style={{ rowRightSideStyle }}
				className={'col-md-9'}
				margin="normal"
				type="text"
				multiline
				rows="1"
				rowsMax="4"
				value={this.state.bonusRate ? this.state.bonusRate : ''}
				onChange={this.handleChange('bonusRate', (v)=>(v <= 100.0 && v >= 0.0)).bind(this)}
			/>
			</div> */
		}

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
						<div className={'row'} style={{ rowStyle }}>
							<span
								className={'col-md-12'}
								style={{ textAlign: 'left', width: '250px', fontSize: '26px', fontWeight: '700' }}
							>
								{this.state.title}
							</span>
						</div>

						<div className={'row'} style={rowStyle}>
							<span className="col-md-3" style={rowLeftSideStyle}>
								쿠폰명
							</span>
							<TextField
								placeholder="쿠폰명"
								style={{ rowRightSideStyle }}
								className={'col-md-9'}
								margin="normal"
								type="text"
								multiline
								rows="1"
								rowsMax="4"
								value={this.state.name ? this.state.name : ''}
								onChange={this.handleChange('name')}
							/>
						</div>

						<div className={'row'} style={rowStyle}>
							<span className="col-md-3" style={rowLeftSideStyle}>
								쿠폰코드
							</span>
							<TextField
								placeholder="쿠폰코드"
								style={{ rowRightSideStyle }}
								className={'col-md-9'}
								margin="normal"
								type="text"
								multiline
								rows="1"
								rowsMax="4"
								value={this.state.code ? this.state.code : ''}
								onChange={this.handleChange('code')}
							/>
						</div>

						<div className={'row'} style={rowStyle}>
							<span className="col-md-3" style={rowLeftSideStyle}>
								쿠폰타입
							</span>
							<div className="col-md-9">
								<RadioGroup
									aria-label="Payment"
									name="Payment"
									row={true}
									className={classes.group}
									style={{ justifyContent: 'center', width: '270px', display: 'inline-block' }}
									value={this.state.type}
									onChange={this.handleChange('type')}
								>
									<FormControlLabel value="discountAmount" control={<Radio />} label="할인금액" />
									<FormControlLabel value="discountRate" control={<Radio />} label="할인%" />
									{/* <FormControlLabel value="bonusAmount" control={<Radio />} label="보너스금액" />
									<FormControlLabel value="bonusRate" control={<Radio />} label="보너스%" /> */}
								</RadioGroup>
							</div>
						</div>

						{discountInput[this.state.type] ? discountInput[this.state.type] : ''}

						<div className={'row'} style={rowStyle}>
							<span className="col-md-3" style={rowLeftSideStyle}>
								전체발행수
							</span>
							<TextField
								placeholder="0 개"
								style={{ rowRightSideStyle }}
								className={'col-md-9'}
								margin="normal"
								type="number"
								rows="1"
								min="1"
								max="999999"
								value={this.state.issuedCount ? this.state.issuedCount : ''}
								onChange={this.handleChange('issuedCount')}
							/>
						</div>

						<div className={'row'} style={rowStyle}>
							<span className="col-md-3" style={rowLeftSideStyle}>
								최소금액조건
							</span>
							<TextField
								placeholder="0 원"
								style={{ rowRightSideStyle }}
								className={'col-md-9'}
								margin="normal"
								type="number"
								rows="1"
								min="0"
								max="999999"
								value={this.state.minPrice ? this.state.minPrice : ''}
								onChange={this.handleChange('minPrice')}
							/>
						</div>

						<div className={'row'} style={rowStyle}>
							<span className="col-md-3" style={rowLeftSideStyle}>
								시작일
							</span>
							<TextField
								type="date"
								className={'col-md-9'}
								margin="normal"
								rows="1"
								style={{ rowRightSideStyle }}
								value={this.state.startDate}
								onChange={this.handleChange('startDate').bind(this)}
							/>
						</div>

						<div className={'row'} style={rowStyle}>
							<span className="col-md-3" style={rowLeftSideStyle}>
								종료일
							</span>
							<TextField
								type="date"
								className={'col-md-9'}
								margin="normal"
								rows="1"
								style={{ rowRightSideStyle }}
								value={this.state.endDate}
								onChange={this.handleChange('endDate').bind(this)}
							/>
						</div>

						<div className={'row'} style={rowStyle}>
							<span className="col-md-3" style={rowLeftSideStyle}>
								사용여부
							</span>
							<div className="col-md-9">
								<RadioGroup
									aria-label="Payment"
									name="Payment"
									row={true}
									className={classes.group}
									style={{ justifyContent: 'center', width: '270px', display: 'inline-block' }}
									value={this.state.isActive}
									onChange={this.handleChange('isActive')}
								>
									<FormControlLabel value={true} control={<Radio />} label="사용" />
									<FormControlLabel value={false} control={<Radio />} label="미사용" />
								</RadioGroup>
							</div>
						</div>

						<div
							className={'row text-center'}
							style={{
								margin: md.mobile() ? '0' : null,
								marginTop: '10px'
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
								{this.state.buttonText}
							</Button>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(addDialog)
