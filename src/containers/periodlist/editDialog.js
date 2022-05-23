import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
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

class editDialog extends React.Component {
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
			startDT: '',
			endDT: '',
			validEndDate: '',
			totalHourHour: '', //충전권 총시간 (시)
			totalHourMin: '', //충전권 총시간 (분)
			deskNo: '', //지정석 좌석
			changedDeskNo: null //지정석 변경할 좌석
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
				startDT:
					this.props.timeType !== 'free'
						? moment(data.startDT, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')
						: data.startDT,
				endDT:
					this.props.timeType !== 'free' ? moment(data.endDT, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss') : data.endDT,
				validEndDate: data.validEndDate || '',
				totalHourHour: Number(data.totalHour) >= 1 ? Math.floor(data.totalHour) : '0',
				totalHourMin: (Number(data.totalHour) * 100) % 100 > 0 ? Math.floor(((data.totalHour * 100) % 100) * 0.6) : '0',
				deskNo: data.deskNo || ''
			})
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, changedDeskNo: null })
		this.customDialog.handleClose()
	}

	//저장
	handleSend = async () => {
		let data = {}
		if (this.state.timeType === 'free') {
			data = {
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				deskFreeUsageSeq: this.state.seq,
				startDT: this.state.startDT,
				endDT: this.state.endDT
			}
		} else if (this.state.timeType === 'char') {
			data = {
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				deskCharUsageSeq: this.state.seq,
				startDT: this.state.startDT,
				validEndDate: this.state.validEndDate,
				totalHour: Number(this.state.totalHourHour * 1 + this.state.totalHourMin / 60).toFixed(2)
			}
		} else {
			data = {
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				deskUsageSeq: this.state.seq,
				startDT: moment(this.state.startDT, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
				endDT: moment(this.state.endDT, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
				deskNo: this.state.changedDeskNo
			}
		}

		await axios
			.post('/desk/edit', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('edit')
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

	finishChargeUsage = async () => {
		await axios
			.post('/desk/edit', {
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				deskCharUsageSeq: this.state.seq,
				endDT: moment().format('YYYY-MM-DD HH:mm:ss')
			})
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('finish')
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

	updateStartTime = e => {
		this.setState({ startDT: e.target.value })
	}
	updateEndTime = e => {
		this.setState({ endDT: e.target.value })
	}
	updateValidEndDate = e => {
		this.setState({ validEndDate: e.target.value })
	}
	updateTotalHour = timeType => e => {
		const re = /(^\d+$)|(^\d+\.\d{1,2}$)/
		if (e.target.value === '' || re.test(e.target.value)) {
			this.setState({
				[timeType]: e.target.value ? Number(e.target.value) : 0
			})
		}
	}
	updateDeskNo = e => {
		this.setState({ deskNo: e.target.value, changedDeskNo: e.target.value })
	}

	mobilePage = () => {
		const { classes } = this.props
		return (
			<div className={'row'} style={{ width: '240px', margin: '0px' }}>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '80px' }}>
						이름
					</span>
					<TextField
						disabled
						placeholder=""
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.memberName}
					/>
				</div>
				<div className={'row'}>
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

				<div className={'row'} style={{ marginTop: '20px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', width: '80px' }}>
						상품명
					</span>
				</div>
				<div className={'row'}>
					<TextField
						disabled
						placeholder=""
						style={{ width: '240px', marginTop: '0px', marginLeft: '20px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.productName}
					/>
				</div>

				{this.state.timeType === 'day' && (
					<div className={'row'}>
						<span className={'col-md-2'} style={{ textAlign: 'left', width: '80px' }}>
							좌석번호
						</span>
						<TextField
							placeholder="좌석번호"
							style={{ width: '40px', marginTop: '0px' }}
							className={'col-md-2'}
							margin="normal"
							type="text"
							value={this.state.deskNo}
							onChange={this.updateDeskNo}
						/>
					</div>
				)}

				<div className={'row'} style={{ width: '240px', marginTop: '10px', marginBottom: '20px' }}>
					<TextField
						id="date1"
						label="시작일시"
						type={this.state.timeType === 'free' ? 'date' : 'datetime-local'}
						style={{ width: this.state.timeType !== 'free' ? '220px' : '180px', marginLeft: '10px' }}
						className={classes.textField}
						InputLabelProps={{
							shrink: true
						}}
						value={this.state.startDT}
						onChange={this.updateStartTime}
					/>
				</div>
				{this.state.timeType !== 'char' && (
					<div className={'row'} style={{ width: '240px', marginTop: '10px', marginBottom: '20px' }}>
						<TextField
							id="date2"
							label="종료일시"
							type={this.state.timeType === 'free' ? 'date' : 'datetime-local'}
							style={{
								width: this.state.timeType !== 'free' ? '240px' : '180px',
								marginLeft: '10px'
							}}
							className={classes.textField}
							InputLabelProps={{
								shrink: true
							}}
							value={this.state.endDT}
							onChange={this.updateEndTime}
						/>
					</div>
				)}
				{this.state.timeType === 'char' && (
					<div className={'row'} style={{ width: '240px', marginTop: '10px', marginBottom: '20px' }}>
						<TextField
							id="validEndDate"
							label="유효기한"
							type="date"
							style={{
								width: '240px',
								marginLeft: '10px'
							}}
							className={classes.textField}
							InputLabelProps={{
								shrink: true
							}}
							value={this.state.validEndDate}
							onChange={this.updateValidEndDate}
						/>
					</div>
				)}
				{this.state.timeType === 'char' && (
					<div className={'row'} style={{ marginTop: '10px', marginBottom: '20px' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', width: '80px' }}>
							총 시간
						</span>
						<TextField
							id="totalHourHour"
							type="number"
							style={{ width: '40px', marginTop: '0px' }}
							className={classes.textField}
							value={this.state.totalHourHour}
							min="0"
							max="999"
							onChange={this.updateTotalHour('totalHourHour')}
						/>
						<span>시간&nbsp;</span>
						<TextField
							id="totalHourMin"
							type="number"
							style={{ width: '40px', marginLeft: '8px', marginTop: '0px' }}
							className={classes.textField}
							value={this.state.totalHourMin}
							min="0"
							max="59"
							onChange={this.updateTotalHour('totalHourMin')}
						/>
						<span>분</span>
					</div>
				)}
			</div>
		)
	}

	pcPage = () => {
		const { classes } = this.props
		return (
			<div>
				<div className={'row'} style={{ width: '400px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '80px' }}>
						이름
					</span>
					<TextField
						disabled
						placeholder=""
						style={{ width: '110px' }}
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

				<div className={'row'} style={{ width: '400px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '80px' }}>
						상품명
					</span>
					<TextField
						disabled
						placeholder=""
						style={{ width: '300px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.productName}
					/>
				</div>

				{this.state.timeType === 'day' && (
					<div className={'row'} style={{ width: '400px', marginTop: '10px', marginBottom: '20px' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', width: '100px' }}>
							좌석번호
						</span>
						<TextField
							placeholder="좌석번호"
							style={{ width: '40px', marginTop: '0px' }}
							className={'col-md-2'}
							margin="normal"
							type="text"
							value={this.state.deskNo}
							onChange={this.updateDeskNo}
						/>
					</div>
				)}

				<div className={'row'} style={{ width: '400px', marginTop: '10px', marginBottom: '20px' }}>
					{this.state.timeType !== 'char' && (
						<TextField
							id="date1"
							label="시작일시"
							type={this.state.timeType === 'free' ? 'date' : 'datetime-local'}
							style={{ width: this.state.timeType !== 'free' ? '220px' : '180px', marginLeft: '10px' }}
							className={classes.textField}
							InputLabelProps={{
								shrink: true
							}}
							value={this.state.startDT}
							onChange={this.updateStartTime}
						/>
					)}
					{this.state.timeType !== 'char' && (
						<TextField
							id="date2"
							label="종료일시"
							type={this.state.timeType === 'free' ? 'date' : 'datetime-local'}
							style={{
								width: this.state.timeType !== 'free' ? '220px' : '180px',
								marginLeft: this.state.timeType === 'day' ? '10px' : '20px',
								marginTop: this.state.timeType === 'day' ? '20px' : '0px'
							}}
							className={classes.textField}
							InputLabelProps={{
								shrink: true
							}}
							value={this.state.endDT}
							onChange={this.updateEndTime}
						/>
					)}
					{this.state.timeType === 'char' && (
						<TextField
							id="validEndDate"
							label="유효기한"
							type="date"
							style={{
								width: '220px',
								marginLeft: '10px',
								marginTop: '20px'
							}}
							className={classes.textField}
							InputLabelProps={{
								shrink: true
							}}
							value={this.state.validEndDate}
							onChange={this.updateValidEndDate}
						/>
					)}
				</div>
				{this.state.timeType === 'char' && (
					<div className={'row'} style={{ width: '400px', marginTop: '10px', marginBottom: '20px' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '8px', width: '76px' }}>
							총 시간
						</span>
						<TextField
							id="totalHourHour"
							type="number"
							style={{ width: '40px', marginLeft: '10px', marginTop: '0px' }}
							className={classes.textField}
							value={this.state.totalHourHour}
							min="0"
							max="999"
							onChange={this.updateTotalHour('totalHourHour')}
						/>
						<span>시간</span>
						<TextField
							id="totalHourMin"
							type="number"
							style={{ width: '40px', marginLeft: '10px', marginTop: '0px' }}
							className={classes.textField}
							value={this.state.totalHourMin}
							min="0"
							max="59"
							onChange={this.updateTotalHour('totalHourMin')}
						/>
						<span>분</span>
					</div>
				)}
			</div>
		)
	}

	renderPage = () => {
		return md.mobile() ? this.mobilePage() : this.pcPage()
	}

	render() {
		return (
			<div>
				<CustomDialog
					title={this.state.timeType === 'char' ? '충전권 변경' : this.state.timeType === 'free' ? '자유석 변경' : '기간권 변경'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="editDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>{this.renderPage()}</DialogContent>

					<DialogActions>
						{this.state.timeType == 'char' && (
							<Button
								variant="outlined"
								onClick={this.finishChargeUsage}
								color="secondary"
								style={{ float: 'left', marginRight: 'auto' }}
							>
								종료처리
							</Button>
						)}
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

export default withStyles(styles)(editDialog)
