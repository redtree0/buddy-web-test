import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import scss from './periodlist.module.scss'
import moment from 'moment'
import axios from '../../wrapper/axios'
import MobileDetect from 'mobile-detect'

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	}
})

const md = new MobileDetect(window.navigator.userAgent)

class refundDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,

			timeType: '',
			seq: '', //Seq
			memberName: '', //이름
			memberPhone: '', //전화번호
			productName: '',
			startDT: '', //가입경로
			endDT: '', //가입날짜
			amount: '',
			max_amount: '',
			payMethod: '',
			usedHour: '0',
			usedMinute: '0',
			remainHour: '0',
			remainMinute: '0'
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			const data = this.props.memberInfo[0]
			this.setState({
				timeType: this.props.timeType,
				seq: data.seq,
				memberName: data.member ? data.member.name : '',
				memberPhone: data.member ? data.member.phone : '',
				productName: data.product ? data.product.name : '직접입력',
				amount: data.salesHistory ? data.salesHistory.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0,
				max_amount: data.salesHistory ? data.salesHistory.amount : 0,
				startDT: moment(data.startDT).format('YYYY-MM-DD'),
				endDT: moment(data.endDT).format('YYYY-MM-DD'),
				dayCnt: moment().diff(data.startDT, 'days'),
				ddayCnt: moment(data.endDT).diff(moment(), 'days'),
				payMethod: data.salesHistory ? data.salesHistory.payMethod : '',
				usedHour: data.usedHour,
				totalHour: data.totalHour
			})
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	//저장
	handleSend = async () => {
		if (this.state.amount === '') {
			this.props.onClose('check')
			return
		}
		let data = {}
		if (this.state.timeType === 'free') {
			data = {
				deskFreeUsageSeq: this.state.seq,
				cancelFreeDesk: true,
				isRefund:
					this.state.payMethod != 'service' && this.state.amount && parseInt(this.state.amount.replace(/,/gi, ''), 10) > 0
						? true
						: false,
				refundAmount:
					this.state.payMethod != 'service' && this.state.amount && parseInt(this.state.amount.replace(/,/gi, ''), 10) > 0
						? parseInt(this.state.amount.replace(/,/gi, ''), 10)
						: null
			}
		} else if (this.state.timeType === 'char') {
			data = {
				deskCharUsageSeq: this.state.seq,
				cancelFreeDesk: true,
				isRefund:
					this.state.payMethod != 'service' && this.state.amount && parseInt(this.state.amount.replace(/,/gi, ''), 10) > 0
						? true
						: false,
				refundAmount:
					this.state.payMethod != 'service' && this.state.amount && parseInt(this.state.amount.replace(/,/gi, ''), 10) > 0
						? parseInt(this.state.amount.replace(/,/gi, ''), 10)
						: null
			}
		} else {
			data = {
				deskUsageSeq: this.state.seq,
				isRefund: this.state.amount && parseInt(this.state.amount.replace(/,/gi, ''), 10) > 0 ? true : false,
				refundAmount:
					this.state.amount && parseInt(this.state.amount.replace(/,/gi, ''), 10) > 0
						? parseInt(this.state.amount.replace(/,/gi, ''), 10)
						: null
			}
		}

		await axios
			.post('/desk/cancel', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('refund')
					this.closeDialogReweighing()
				} else {
					this.props.onClose('error', res.data.message)
				}
			})
			.catch(error => {
				console.error(error)
				this.props.onClose('error', error.message)
			})
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

	render() {
		return (
			<div>
				<CustomDialog
					title={this.state.timeType === 'char' ? '충전권 환불' : this.state.timeType === 'free' ? '자유석 환불' : '기간권 환불'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="refundDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px', padding: md.mobile() ? '0px' : '0 24px 24px' }}>
						<div className={'row'} style={{ width: md.mobile() ? '100%' : '400px', margin: md.mobile() ? '0' : null }}>
							<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '80px' }}>
								이름
							</span>
							<TextField
								disabled
								placeholder=""
								style={{ width: md.mobile() ? '70px' : '110px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								value={this.state.memberName}
							/>

							<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px' }}>
								전화번호
							</span>
							<TextField
								disabled
								placeholder="000-0000-0000"
								style={{ width: '100px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								value={this.state.memberPhone}
							/>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '400px', margin: md.mobile() ? '0' : null }}>
							<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '80px' }}>
								상품명
							</span>
							<TextField
								disabled
								placeholder=""
								style={{ width: md.mobile() ? '240px' : '300px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								value={this.state.productName}
							/>
						</div>
						{this.state.payMethod == 'service' && (
							<div className={'row'}>
								<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px' }}>
									서비스
								</span>
							</div>
						)}
						{this.state.payMethod != 'service' && (
							<div className={'row'} style={{ width: md.mobile() ? '100%' : '400px' }}>
								<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px' }}>
									상품금액
								</span>
								<TextField
									disabled
									placeholder=""
									style={{ width: '200px' }}
									className={'col-md-2'}
									margin="normal"
									inputProps={{ style: { textAlign: 'right' } }}
									value={
										this.state.max_amount ? this.state.max_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
									}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" id="payAdornment">
												원
											</InputAdornment>
										)
									}}
								/>
							</div>
						)}
						{this.state.payMethod != 'service' && (
							<div className={'row'} style={{ width: md.mobile() ? '100%' : '400px' }}>
								<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px' }}>
									환불금액
								</span>
								<TextField
									placeholder={'금액입력'}
									inputProps={{ maxLength: 7, style: { textAlign: 'right' } }}
									style={{ width: '200px' }}
									className={'col-md-2'}
									margin="normal"
									value={this.state.amount}
									// inputProps={{ style: { textAlign: 'right' } }}
									onChange={e => this.amountChange(e.target.value)}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" id="payAdornment">
												원
											</InputAdornment>
										)
									}}
								/>
							</div>
						)}
						{this.state.timeType === 'char' ? (
							<div>
								<div className={'row'} style={{ width: md.mobile() ? '100%' : '400px' }}>
									<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px' }}>
										이용시간
									</span>
									<TextField
										disabled
										placeholder=""
										style={{ width: '220px' }}
										className={'col-md-2'}
										margin="normal"
										type="text"
										value={`${this.state.usedHour >= 1 ? Math.floor(this.state.usedHour) + '시간' : ''} ${Math.round(
											((this.state.usedHour * 100) % 100) * 0.6
										)}분 / ${this.state.totalHour >= 1 ? Math.floor(this.state.totalHour) + '시간' : ''}${
											(this.state.totalHour * 100) % 100 > 0
												? Math.round(((this.state.totalHour * 100) % 100) * 0.6) + '분'
												: ''
										}(${Number((this.state.usedHour / this.state.totalHour) * 100).toFixed(0)}%)`}
									/>
								</div>
							</div>
						) : (
							<div className={'row'} style={{ width: md.mobile() ? '310px' : '400px' }}>
								<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px' }}>
									이용일수
								</span>
								<TextField
									disabled
									placeholder=""
									style={{ width: md.mobile() ? '60px' : '80px' }}
									className={'col-md-2'}
									margin="normal"
									type="text"
									inputProps={{ style: { textAlign: 'right' } }}
									value={this.state.dayCnt}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" id="payAdornment">
												일
											</InputAdornment>
										)
									}}
								/>

								<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px' }}>
									잔여일수
								</span>
								<TextField
									disabled
									placeholder=""
									style={{ width: md.mobile() ? '60px' : '80px' }}
									className={'col-md-2'}
									margin="normal"
									type="text"
									inputProps={{ style: { textAlign: 'right' } }}
									value={this.state.ddayCnt}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" id="payAdornment">
												일
											</InputAdornment>
										)
									}}
								/>
							</div>
						)}
					</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
							취소
						</Button>
						<Button variant="outlined" onClick={this.handleSend} color="primary" autoFocus>
							{this.state.payMethod === 'service' ? '이용취소' : '환불처리'}
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(refundDialog)
