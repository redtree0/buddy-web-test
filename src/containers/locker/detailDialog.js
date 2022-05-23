import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import CheckoutDialog from './checkoutDialog'
import MoveLockerDialog from './moveLockerDialog'
import ExtendLockerDialog from './extendLockerDialog'
import CloseIcon from '@material-ui/icons/Close'
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
			checkoutisOpen: false,
			moveLockerisOpen: false,
			extendLockerisOpen: false,

			lockerNo: null, //락커 번호
			lockerPwd: null, //비밀번호
			usageInfo: null
		}
	}

	openDialogReweighing = async () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			const remainDays = moment(this.props.usageInfo.endDT).diff(moment().format('YYYY-MM-DD'), 'days')
			this.setState({
				lockerNo: this.props.lockerNo,
				lockerPwd: this.props.lockerPwd,
				usageInfo: this.props.usageInfo,
				remainDays: remainDays > 0 ? remainDays + 1 : 1
			})
		}, 0)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	//ExtensionDialog Close Event
	closeEvent = async (data, isRefund) => {
		this.setState({ checkoutisOpen: false, moveLockerisOpen: false, extendLockerisOpen: false })
		if (!data) return

		//이용취소
		if (data === 'checkout') {
			await axios
				.post('/locker/cancel', {
					lockerUsageSeq: this.state.usageInfo['seq'],
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
					isRefund
				})
				.then((res) => {
					if (res.data.result === 'success') {
						this.props.onClose('checkout')
						this.closeDialogReweighing()
					}
				})
				.catch((error) => console.error(error))
		}
		//락커이동
		else if (data.moveLocker) {
			if (data.lockerNo) {
				await axios
					.post('/locker/move', {
						lockerUsageSeq: this.state.usageInfo['seq'],
						lockerNo: data.lockerNo,
						placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq
					})
					.then((res) => {
						if (res.data.result === 'success') {
							this.setState({ lockerNo: data.lockerNo })
							this.props.onClose('moveLocker')
						} else {
							this.props.onClose('moveLockerFail', res.data.message)
						}
					})
					.catch((error) => console.error(error))
			}
		}
		//락커 연장
		else if (data.extendLocker) {
			if (data.extensionDay) {
				const extendedEndDT = moment(this.state.usageInfo.endDT)
					.add(parseInt(data.extensionDay, 10), 'days')
					.format('YYYY-MM-DD 23:59:59')
				await axios
					.post('/locker/extend', {
						lockerUsageSeq: this.state.usageInfo['seq'],
						endDT: extendedEndDT,
						placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq
					})
					.then((res) => {
						if (res.data.result === 'success') {
							const remainDays = moment(extendedEndDT).diff(moment().format('YYYY-MM-DD'), 'days')
							this.setState({
								usageInfo: { ...this.state.usageInfo, endDT: moment(extendedEndDT).format('YYYY-MM-DD') },
								remainDays: remainDays > 0 ? remainDays + 1 : 1
							})
							this.props.onClose('extendLocker')
						} else {
							this.props.onClose('extendLockerFail', res.data.message)
						}
					})
					.catch((error) => console.error(error))
			}
		}
	}

	//이용취소 클릭
	DialogOpen = (data) => {
		if (data === 'checkout') {
			this.setState({ checkoutisOpen: !this.state.checkoutisOpen })
		} else if (data === 'usage') {
			this.props.onClose('usage')
		} else if (data === 'moveLocker') {
			this.setState({ moveLockerisOpen: !this.state.moveLockerisOpen })
		} else if (data === 'extendLocker') {
			this.setState({ extendLockerisOpen: !this.state.extendLockerisOpen })
		}
	}

	//기본
	handleFormFieldChange = (prop, value) => {
		this.setState({ [prop]: value })
	}

	//기본
	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	render() {
		return (
			<div>
				<CheckoutDialog open={this.state.checkoutisOpen} title={'이용취소'} onClose={this.closeEvent} />
				<MoveLockerDialog open={this.state.moveLockerisOpen} title={'락커이동'} onClose={this.closeEvent} />
				<ExtendLockerDialog open={this.state.extendLockerisOpen} title={'연장'} onClose={this.closeEvent} />
				<CustomDialog
					// title={this.props.seatNo + '번 좌석'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={
						<InsertButton
							id="detailDialog_btn"
							btnText="상세보기"
							btnContextual="btn-warning"
							className="my-custom-class hidden_"
						/>
					}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<CloseIcon className="dialogCancle" onClick={this.closeDialogReweighing} />
						<div className={'row dialog_row'}>
							<span className={'col-md-2'} style={{ textAlign: 'left', width: '150px', fontSize: '26px', fontWeight: '700' }}>
								{this.state.lockerNo + '번 락커'}
							</span>
							<span className={'col-md-2 seat_span'}>이용중</span>
						</div>

						<div className={'row dialog_row'}>
							<span className={'col-md-2 seat_row_span'}>
								{this.state.usageInfo
									? this.state.usageInfo['member'] && this.state.usageInfo['member'].name
										? this.state.usageInfo['member'].name
										: '이름없음'
									: ''}
								(
								{this.state.usageInfo && this.state.usageInfo['member'] && this.state.usageInfo['member'].phone ? (
									<a href={'sms:' + this.state.usageInfo['member'].phone}>{this.state.usageInfo['member'].phone}</a>
								) : null}
								)
							</span>
							{this.state.lockerPwd && (
								<span
									className={'col-md-4 seat_span'}
									style={{ position: 'absolute', marginRight: '0px', right: '34px', background: 'red' }}
								>
									{this.state.lockerPwd}
								</span>
							)}
						</div>

						<div className={'row dialog_row'}>
							<span className={'col-md-2 seat_row_span'}>
								{this.state.usageInfo ? this.state.usageInfo['startDT'] + ' ~ ' + this.state.usageInfo['endDT'] : ''}
							</span>
						</div>

						<div className={'row dialog_row'}>
							<span className={'col-md-2 seat_row_span'} style={{ marginTop: '0px' }}>
								( {this.state.remainDays}일 남음{' '}
								{this.state.usageInfo &&
									this.state.usageInfo.extendCount > 0 &&
									', ' + this.state.usageInfo.extendCount + '회 연장'}
								)
							</span>
						</div>

						<div className={'row dialog_row'} style={{ marginTop: '8px', textAlign: 'center' }}>
							<Button
								className={'dialog_btn3'}
								variant="outlined"
								onClick={this.DialogOpen.bind(this, 'extendLocker')}
								color="primary"
								style={{ margin: '5px' }}
							>
								연장
							</Button>
							<Button
								className={'dialog_btn3'}
								variant="outlined"
								onClick={this.DialogOpen.bind(this, 'checkout')}
								color="secondary"
								style={{ margin: '5px' }}
							>
								이용취소
							</Button>
							<Button
								className={'dialog_btn3'}
								variant="outlined"
								onClick={this.DialogOpen.bind(this, 'moveLocker')}
								style={{ margin: '5px' }}
							>
								락커이동
							</Button>
						</div>
						<div className={'row dialog_row'} style={{ marginTop: '8px', textAlign: 'center' }}>
							<Button
								variant="outlined"
								onClick={this.DialogOpen.bind(this, 'usage')}
								color="default"
								style={{ margin: '5px', width: md.mobile() ? '290px' : '320px' }}
							>
								이용내역
							</Button>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
