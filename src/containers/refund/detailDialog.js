import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import { InsertButton } from 'react-bootstrap-table'
import moment from 'moment'
import axios from '../../wrapper/axios'
import MobileDetect from 'mobile-detect'

const styles = (theme) => ({
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

class detailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,

			seq: '',
			userName: '', // 이름
			userPhone: '', // 전화번호
			amount: '', // 신청금액
			usersCash: '', // 보유캐시
			refundReason: '', // 환불사유
			rejectReasonOpt: '', // 환불사유옵션
			isAccept: null, // 승인여부
			refundAmount: null, // 지급액
			refundCash: null, //캐시차감액
			processedTime: null, // 지급시간
			rejectReason: null //	거절사유
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		this.setState({
			seq: null,
			userName: null,
			userPhone: null,
			amount: null,
			usersCash: null,
			refundReason: null,
			isAccept: null,
			refundAmount: null,
			refundCash: null,
			processedTime: null,
			rejectReason: null
		})
		setTimeout(() => {
			const data = this.props.refundInfo[0]
			this.setState({
				seq: data.seq,
				userName: data.userName,
				userPhone: data.userPhone,
				amount: data.amount ? data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null,
				usersCash: data.usersCash ? data.usersCash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null,
				refundReason: data.refundReason || null,
				isAccept: data.isAccept !== null ? String(data.isAccept) : null,
				refundAmount: data.refundAmount
					? data.refundAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
					: data.amount
					? data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
					: null,
				processedTime: data.processedTime
					? moment(data.processedTime).format('YYYY-MM-DDTHH:mm')
					: moment().format('YYYY-MM-DDTHH:mm'),
				rejectReason: data.rejectReason || null
			})
			this.setState({
				refundCash:
					data.usersCash < data.amount
						? data.usersCash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						: data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			})
			if (data.rejectReason) {
				if (data.rejectReason === '중복신청') this.setState({ rejectReasonOpt: 'duplicated' })
				else if (data.rejectReason === '신청후 캐시사용') this.setState({ rejectReasonOpt: 'used' })
				else if (data.rejectReason === '신청후 캐시충전') this.setState({ rejectReasonOpt: 'charged' })
				else if (data.rejectReason === '계좌 미기입') this.setState({ rejectReasonOpt: 'noaccount' })
				else this.setState({ rejectReasonOpt: 'memo' })
			}
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, rejectReasonOpt: '' })
		this.customDialog.handleClose()
	}

	//저장
	handleSend = async () => {
		let data = {}
		if (this.state.isAccept === 'false') {
			data = {
				seq: this.state.seq,
				isAccept: false,
				rejectReason: this.state.rejectReason //거절사유
			}
		} else if (this.state.isAccept === 'true') {
			data = {
				seq: this.state.seq,
				isAccept: true,
				refundAmount: this.state.refundAmount && this.state.refundAmount.replace(/,/gi, ''), //실제 환불금액
				refundCash: this.state.refundCash && this.state.refundCash.replace(/,/gi, ''), //실제 캐시차감액
				processedTime: this.state.processedTime //실제 환불지급 처리시각
			}
		} else {
			data = {
				seq: this.state.seq,
				isAccept: 'hold'
			}
		}

		await axios
			.post('/cash/refund/update', data)
			.then((res) => {
				if (res.data.result === 'success') {
					this.props.onClose({ flag: 'edit', message: '저장되었습니다.' })
					this.closeDialogReweighing()
				} else {
					this.props.onClose({ flag: 'fail', message: res.data.message })
				}
			})
			.catch((error) => {
				this.props.onClose({ flag: 'error', message: String(error.message) })
				console.error(error)
			})
	}

	//기본
	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
		if (name === 'rejectReasonOpt') {
			let reason = ''
			if (event.target.value === 'duplicated') reason = '중복신청'
			else if (event.target.value === 'used') reason = '신청후 캐시사용'
			else if (event.target.value === 'charged') reason = '신청후 캐시충전'
			else if (event.target.value === 'noaccount') reason = '계좌 미기입'
			else if (event.target.value === 'memo') reason = ''
			this.setState({ rejectReason: reason })
		}
	}
	handleChange2 = (name) => (event) => {
		this.setState({ [name]: String(event.target.value) })
	}
	//금액
	amountChange = (name) => (event) => {
		const re = /^[0-9\,]+$/
		if (event.target.value === '' || re.test(event.target.value)) {
			event.target.value = event.target.value.replace(/,/gi, '')
			event.target.value = event.target.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			this.setState({ [name]: event.target.value })
		}
	}

	//금액 Format
	payFormat = (value) => {
		let str = ''
		str = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'
		return str
	}

	isMobileCheck = () => {
		if (md.mobile()) {
			return (
				<div className={'row'} style={{ width: '240px', margin: '0px' }}>
					<div className={'row'}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							이름
						</span>
						<TextField disabled className={'col-md-2'} margin="normal" type="text" value={this.state.userName} />
					</div>

					<div className={'row'}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							전화번호
						</span>
						<TextField disabled className={'col-md-2'} margin="normal" type="text" value={this.state.userPhone} />
					</div>

					<div className={'row'}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							신청금액
						</span>
						<TextField
							disabled
							className={'col-md-2'}
							style={{ width: '130px' }}
							margin="normal"
							type="text"
							inputProps={{ style: { textAlign: 'right' } }}
							value={this.state.amount}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end" id="payAdornment">
										원
									</InputAdornment>
								)
							}}
						/>
					</div>

					<div className={'row'}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							보유캐시
						</span>
						<TextField
							disabled
							className={'col-md-2'}
							style={{ width: '130px' }}
							margin="normal"
							type="text"
							inputProps={{ style: { textAlign: 'right' } }}
							value={this.state.usersCash}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end" id="payAdornment">
										원
									</InputAdornment>
								)
							}}
						/>
					</div>

					<div className={'row'}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							환불사유
						</span>
						<TextField disabled className={'col-md-2'} margin="normal" type="text" value={this.state.refundReason} />
					</div>

					<div className={'row'}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							승인여부
						</span>
						<RadioGroup
							style={{ width: '160px', display: 'inline-block' }}
							aria-label="Payment"
							name="Payment"
							row={true}
							value={this.state.isAccept}
							onChange={this.handleChange2('isAccept')}
						>
							<FormControlLabel value={'true'} control={<Radio />} label="승인" />
							<FormControlLabel value={'false'} control={<Radio />} label="거절" />
							<FormControlLabel value={''} control={<Radio />} label="보류" />
						</RadioGroup>
					</div>

					<div className={'row'} style={{ display: this.state.isAccept == null || this.state.isAccept !== 'true' ? 'none' : '' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							지급액
						</span>
						<TextField
							className={'col-md-2'}
							style={{ width: '130px' }}
							margin="normal"
							type="text"
							inputProps={{ style: { textAlign: 'right' } }}
							value={this.state.refundAmount}
							onChange={this.amountChange('refundAmount')}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end" id="payAdornment">
										원
									</InputAdornment>
								)
							}}
						/>
					</div>

					<div className={'row'} style={{ display: this.state.isAccept == null || this.state.isAccept !== 'true' ? 'none' : '' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							지급일시
						</span>
						<TextField
							className={'col-md-2'}
							id="datetime-local2"
							type="datetime-local"
							style={{ marginLeft: '20px' }}
							value={this.state.processedTime}
							onChange={this.handleChange('processedTime')}
						/>
					</div>

					<div className={'row'} style={{ display: this.state.isAccept == null || this.state.isAccept !== 'true' ? 'none' : '' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', color: 'red' }}>
							캐시차감
						</span>
						<TextField
							className={'col-md-2'}
							style={{ width: '130px' }}
							margin="normal"
							type="text"
							inputProps={{ style: { textAlign: 'right' } }}
							value={this.state.refundCash}
							onChange={this.amountChange('refundCash')}
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
						className={'row'}
						style={{ display: this.state.isAccept == null || this.state.isAccept !== 'false' ? 'none' : '' }}
					>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							거절사유
						</span>
						<RadioGroup
							aria-label="rejectReasonOpt"
							name="rejectReasonOpt"
							row={true}
							value={this.state.rejectReasonOpt}
							onChange={this.handleChange('rejectReasonOpt')}
						>
							<FormControlLabel value={'duplicated'} control={<Radio />} label="중복신청" />
							<FormControlLabel value={'used'} control={<Radio />} label="신청후 캐시사용" />
							<FormControlLabel value={'charged'} control={<Radio />} label="신청후 캐시충전" />
							<FormControlLabel value={'noaccount'} control={<Radio />} label="계좌 미기입" />
							<FormControlLabel value={'memo'} control={<Radio />} label="직접입력" />
							{this.state.rejectReasonOpt === 'memo' && (
								<TextField
									className={'col-md-2'}
									margin="normal"
									type="text"
									value={this.state.rejectReason}
									onChange={this.handleChange('rejectReason')}
								/>
							)}
						</RadioGroup>
					</div>
				</div>
			)
		} else {
			return (
				<div>
					<div className={'row'}>
						<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px' }}>
							이름
						</span>
						<TextField disabled className={'col-md-3'} margin="normal" type="text" value={this.state.userName} />

						<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px' }}>
							전화번호
						</span>
						<TextField disabled className={'col-md-3'} margin="normal" type="text" value={this.state.userPhone} />
					</div>

					<div className={'row'}>
						<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px' }}>
							신청금액
						</span>
						<TextField
							disabled
							className={'col-md-3'}
							margin="normal"
							type="text"
							value={this.state.amount}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end" id="payAdornment">
										원
									</InputAdornment>
								)
							}}
						/>

						<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px' }}>
							보유캐시
						</span>
						<TextField
							disabled
							className={'col-md-3'}
							margin="normal"
							type="text"
							value={this.state.usersCash}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end" id="payAdornment">
										원
									</InputAdornment>
								)
							}}
						/>
					</div>

					<div className={'row'}>
						<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px' }}>
							환불사유
						</span>
						<TextField disabled className={'col-md-9'} margin="normal" type="text" value={this.state.refundReason} />
					</div>

					<div className={'row'}>
						<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px' }}>
							승인여부
						</span>
						<RadioGroup
							aria-label="Payment"
							name="Payment"
							row={true}
							value={this.state.isAccept}
							onChange={this.handleChange2('isAccept')}
						>
							<FormControlLabel value={'true'} control={<Radio />} label="승인" />
							<FormControlLabel value={'false'} control={<Radio />} label="거절" />
							<FormControlLabel value={'hold'} control={<Radio />} label="보류" />
						</RadioGroup>
					</div>

					<div
						className={'row'}
						style={{
							display: this.state.isAccept === null || this.state.isAccept !== 'true' ? 'none' : ''
						}}
					>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							지급액
						</span>
						<TextField
							className={'col-md-2'}
							margin="normal"
							type="text"
							inputProps={{ style: { textAlign: 'right' } }}
							value={this.state.refundAmount}
							onChange={this.amountChange('refundAmount')}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end" id="payAdornment">
										원
									</InputAdornment>
								)
							}}
						/>

						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							지급일시
						</span>
						<TextField
							className={'col-md-4'}
							id="datetime-local2"
							type="datetime-local"
							style={{ marginTop: '14px' }}
							value={this.state.processedTime}
							onChange={this.handleChange('processedTime')}
						/>
						<Button
							variant="flat"
							style={{ marginTop: '12px' }}
							onClick={() => {
								this.setState({ processedTime: moment().format('YYYY-MM-DDTHH:mm') })
							}}
							color="default"
						>
							지금
						</Button>
					</div>

					<div
						className={'row'}
						style={{
							display: this.state.isAccept === null || this.state.isAccept !== 'true' ? 'none' : ''
						}}
					>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', color: 'red' }}>
							캐시차감
						</span>
						<TextField
							className={'col-md-2'}
							margin="normal"
							type="text"
							inputProps={{ style: { textAlign: 'right' } }}
							value={this.state.refundCash}
							onChange={this.amountChange('refundCash')}
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
						className={'row'}
						style={{
							display: this.state.isAccept === null || this.state.isAccept !== 'false' ? 'none' : ''
						}}
					>
						<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px' }}>
							거절사유
						</span>
						<RadioGroup
							aria-label="rejectReasonOpt"
							name="rejectReasonOpt"
							row={true}
							value={this.state.rejectReasonOpt}
							onChange={this.handleChange('rejectReasonOpt')}
						>
							<FormControlLabel value={'duplicated'} control={<Radio />} label="중복신청" />
							<FormControlLabel value={'used'} control={<Radio />} label="신청후 캐시사용" />
							<FormControlLabel value={'charged'} control={<Radio />} label="신청후 캐시충전" />
							<FormControlLabel value={'noaccount'} control={<Radio />} label="계좌 미기입" />
							<FormControlLabel value={'memo'} control={<Radio />} label="직접입력" />
							{this.state.rejectReasonOpt === 'memo' && (
								<TextField
									className={'col-md-6'}
									margin="normal"
									type="text"
									value={this.state.rejectReason}
									onChange={this.handleChange('rejectReason')}
								/>
							)}
						</RadioGroup>
					</div>
				</div>
			)
		}
	}

	render() {
		return (
			<div>
				<CustomDialog
					title={'상태 변경'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="detailDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>{this.isMobileCheck()}</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
							취소
						</Button>
						<Button variant="outlined" onClick={this.handleSend} color="primary" autoFocus>
							저장
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
