import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import ExtensionDialog from './extensionDialog'
import MoveDeskDialog from './moveDeskDialog'
import CheckoutDialog from './checkoutDialog'
import DeskCancelDialog from './deskCancelDialog'
import MobileDetect from 'mobile-detect'
import CloseIcon from './images/closeIcon.png'
import CancelIcon from './images/cancelIcon.png'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import moment from 'moment'
import axios from '../../wrapper/axios'

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
			extensionisOpen: false,
			moveDeskisOpen: false,
			checkoutisOpen: false,
			deskCancelisOpen: false,

			seatKey: null, //좌석 키
			seatNo: null, //좌석 번호
			usageSeq: null,

			userSeq: '',
			member_name: '', //이름
			member_phone: '', //전화번호
			product_name: '', //상품명
			startDT: null, //시작시간
			endDT: null, //종료시간
			startDT_fm: null, //시작시간 포멧적용
			endDT_fm: null, //종료시간 포멧적용
			timeType: null, //1회권 & 기간권 & 충전권
			type: null,

			remainingDay: 0, //남은 일수
			remainingHour: 0, //남은 시간
			remainingMinute: 0, //남은 분

			open: false,
			cancelSeq: null
		}
	}

	openDialogReweighing = async () => {
		this.setState({ stateDialogReweighing: true, loading: true })
		setTimeout(() => {
			this.setState({
				seatKey: this.props.seatKey,
				seatNo: this.props.seatNo,
				usageSeq: this.props.usageSeq,
				deskReserved: this.props.deskReserved,
				open: false
			})
		}, 0)

		await axios
			.get('/desk/usage/' + this.props.usageSeq)
			.then((res) => {
				if (res.status === 200) {
					//기본정보 set
					this.setState({
						userSeq: res.data.userSeq,
						member_name: res.data['member'].name,
						member_phone: res.data['member'].phone,
						product_name: res.data['product'] ? (res.data['product'].name ? res.data['product'].name : null) : null,
						startDT: res.data.startDT,
						endDT: res.data.endDT,
						timeType: res.data['timeType'],
						type: res.data['product']
							? res.data['product'].timeType === 'day' || res.data['product'].timeType === 'free'
								? '기간권'
								: res.data['product'].timeType === 'time'
								? '1회권'
								: res.data['product'].timeType === 'char'
								? '충전권'
								: '?'
							: res.data['timeType']
							? res.data['timeType'] === 'real'
								? '실시간'
								: res.data['timeType'] === 'day'
								? '지정석'
								: res.data['timeType'] === 'time'
								? '1회권'
								: res.data['timeType'] === 'char'
								? '충전권'
								: res.data['timeType'] === 'free'
								? '자유석'
								: '직접입력'
							: '??'
					})

					//기간권 & 1회권 시간 단위 다르게
					if (res.data['product'] !== null && res.data['product'].timeType === 'day') {
						this.setState({
							startDT_fm: moment(res.data.startDT).format('M/D'),
							endDT_fm: moment(res.data.endDT).format('M/D')
						})
					} else if (
						res.data['product'] !== null &&
						(res.data['product'].timeType === 'time' || res.data['product'].timeType === 'free')
					) {
						this.setState({
							startDT_fm: moment(res.data.startDT).format('HH:mm'),
							endDT_fm: moment(res.data.endDT).format('HH:mm')
						})
					} else {
						//직접입력
						this.setState({
							startDT_fm: moment(res.data.startDT).format('M/D HH:mm'),
							endDT_fm: moment(res.data.endDT).format('M/D HH:mm')
						})
					}
				}
				//남은 일수 시간 계산
				this.setState({
					remainingDay: moment(res.data.endDT).diff(moment(), 'days'),
					remainingHour: moment(res.data.endDT).diff(moment(), 'hours') % 24,
					remainingMinute: moment(res.data.endDT).diff(moment(), 'minutes') % 60
				})
			})
			.catch((error) => console.error(error))
		this.setState({ loading: false })
	}

	closeDialogReweighing = (data) => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
		this.props.onClose('change')
	}

	//ExtensionDialog Close Event
	closeEvent = async (data, { isRefund = false, cancelFreeDesk = false } = {}) => {
		this.setState({ extensionisOpen: false, moveDeskisOpen: false, checkoutisOpen: false, deskCancelisOpen: false })
		if (!data) return

		//연장처리
		if (data['extension']) {
			let endDT = this.state.endDT
			endDT = data.extensionDay ? moment(endDT).add(parseInt(data.extensionDay, 10), 'days') : endDT
			endDT = data.extensionHour ? moment(endDT).add(parseInt(data.extensionHour, 10), 'hours') : endDT
			endDT = data.extensionMinute ? moment(endDT).add(parseInt(data.extensionMinute, 10), 'minutes') : endDT

			await axios
				.post('/desk/extend', {
					deskUsageSeq: this.props.usageSeq,
					userSeq: this.state.userSeq,
					endDT: endDT.format('YYYY-MM-DD HH:mm:ss'),
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq
				})
				.then((res) => {
					if (res.data.result === 'success') {
						let endDT_fm
						this.props.onClose('extension')
						// this.closeDialogReweighing();
						this.setState({ endDT: endDT.format('YYYY-MM-DD HH:mm:ss') })

						//기간권 & 1회권 시간 단위 다르게
						if (this.state.timeType !== null) {
							if (this.state.timeType === 'day') {
								endDT_fm = moment(endDT).format('YYYY-MM-DD')
							} else if (this.state.timeType === 'time' || this.state.timeType === 'free') {
								endDT_fm = moment(endDT).format('HH:mm')
							}
						} else {
							//직접입력
							endDT_fm = moment(endDT).format('YYYY-MM-DD HH:mm:ss')
						}

						//남은 일수 시간 계산
						this.setState({
							remainingDay: moment(endDT).diff(moment(), 'days'),
							remainingHour: moment(endDT).diff(moment(), 'hours') % 24,
							remainingMinute: moment(endDT).diff(moment(), 'minutes') % 60,
							endDT_fm
						})
					} else if (res.data.message) {
						this.props.onClose('extendDeskFail', res.data.message)
					}
				})
				.catch((error) => {
					console.error(error)
					this.props.onClose('extendDeskFail', error.message)
				})
		}

		//퇴실처리
		else if (data === 'checkout') {
			await axios
				.post('/desk/exit', {
					deskUsageSeq: this.props.usageSeq,
					userSeq: this.state.userSeq,
					isRefund,
					cancelFreeDesk,
					timeType: this.state.timeType
				})
				.then((res) => {
					if (res.data.result === 'success') {
						this.props.onClose('checkout')
						this.closeDialogReweighing()
					} else {
						this.props.onClose('checkoutFail', res.data.message)
					}
				})
				.catch((error) => {
					console.error(error)
					this.props.onClose('checkoutFail', error.message)
				})
		}

		//예약취소
		else if (data === 'deskCancel') {
			await axios
				.post('/desk/cancel', {
					deskUsageSeq: this.state.cancelSeq,
					userSeq: this.state.userSeq,
					isRefund: false
				})
				.then((res) => {
					if (res.data.result === 'success') {
						this.setState({
							deskReserved: this.state.deskReserved.filter((data) => data.seq !== this.state.cancelSeq)
						})
					} else if (res.data.message) {
						this.props.onClose('deskCancelFail', res.data.message)
					}
				})
				.catch((error) => {
					console.error(error)
					this.props.onClose('checkoutFail', error.message)
				})
		}

		//좌석이동
		else if (data.moveDesk) {
			this.props.place_layout &&
				this.props.place_layout.some((space, i) => {
					return (
						space.data &&
						space.data.some((row, x) => {
							return row.some((seat, y) => {
								if (seat.n === data.deskNo) {
									data.deskKey = seat.k
									if (seat.t === 'seat_01') {
										data.deskType = 'open'
									} else if (seat.t === 'seat_02') {
										data.deskType = 'semi'
									} else if (seat.t === 'seat_03') {
										data.deskType = 'close'
									} else if (seat.t === 'office_s01') {
										data.deskType = 'round'
									} else if (seat.t === 'sofa_s01') {
										data.deskType = 'sofa'
									} else if (seat.t === 'two_s01') {
										data.deskType = 'dual'
									} else {
										data.deskType = ''
									}
									return true
								}
							})
						})
					)
				})
			if (data.deskKey) {
				await axios
					.post('/desk/move', {
						placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
						deskUsageSeq: this.state.usageSeq,
						deskNo: data.deskNo,
						deskKey: data.deskKey,
						deskType: data.deskType
					})
					.then((res) => {
						if (res.data.result === 'success') {
							this.setState({ seatNo: data.deskNo, seatKey: data.deskKey })
							this.props.onClose('moveDesk')
						} else {
							this.props.onClose('moveDeskFail', res.data.message)
						}
					})
					.catch((error) => {
						console.error(error)
						this.props.onClose('moveDeskFail', error.message)
					})
			} else {
				this.props.onClose('moveDeskFail', '존재하지 않는 좌석번호입니다.')
			}
		}
	}
	//연장&퇴실처리&좌석이동 클릭
	DialogOpen = (data) => {
		if (data === 'extension') {
			if (this.state.timeType === 'char') {
				this.props.onClose('noExtensionChar', '충전권은 기간/충전권 메뉴에서 시간 조정 가능합니다')
			} else if (this.state.extensionisOpen) {
				this.setState({ extensionisOpen: false })
			} else {
				this.setState({ extensionisOpen: true })
			}
		} else if (data === 'checkout') {
			if (this.state.checkoutisOpen) {
				this.setState({ checkoutisOpen: false })
			} else {
				this.setState({ checkoutisOpen: true })
			}
		} else if (data === 'moveDesk') {
			if (this.state.moveDeskisOpen) {
				this.setState({ moveDeskisOpen: false })
			} else {
				this.setState({ moveDeskisOpen: true })
			}
		}
	}

	//예약 취소
	drCancel = async (seq) => {
		this.setState({ cancelSeq: seq })
		if (this.state.deskCancelisOpen) {
			this.setState({ deskCancelisOpen: false })
		} else {
			this.setState({ deskCancelisOpen: true })
		}
	}

	//메시지
	hrefMessage = () => {
		if (this.state.userSeq) {
			let data = {
				userSeq: this.state.userSeq,
				userName: this.state.member_name,
				userPhone: this.state.member_phone,
				newMsgCnt: 0,
				image: 'assets/images/avatars/admin.png'
			}
			localStorage.setItem('message_user', JSON.stringify(data))
			this.props.onClose('message')
		}
	}

	hrefSms = () => {
		window.location.href = `sms:${this.state.member_phone}`
	}

	hrefUsage = () => {
		this.props.onClose('usage')
	}

	//기본
	handleFormFieldChange = (prop, value) => {
		this.setState({ [prop]: value })
	}

	handleClick = () => {
		this.setState({ open: !this.state.open })
	}

	//기본
	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	addZero = (n, digits) => {
		let zero = ''
		n = n.toString()

		if (n.length < digits) {
			for (let i = 0; i < digits - n.length; i++) zero += '0'
		}
		return zero + n
	}

	mobileChk = () => {
		if (md.mobile() === null) {
			return 'none'
		}
	}

	render() {
		return (
			<div>
				<ExtensionDialog open={this.state.extensionisOpen} title={'연장'} onClose={this.closeEvent} />
				<CheckoutDialog
					open={this.state.checkoutisOpen}
					title={'퇴실처리'}
					onClose={this.closeEvent}
					timeType={this.state.timeType}
				/>
				<DeskCancelDialog open={this.state.deskCancelisOpen} title={'예약취소'} onClose={this.closeEvent} />
				<MoveDeskDialog open={this.state.moveDeskisOpen} title={'좌석이동'} onClose={this.closeEvent} />

				<CustomDialog
					// title={this.props.seatNo + '번 좌석'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="detailDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<img src={CloseIcon} className="dialogCancle" onClick={this.closeDialogReweighing} alt="" />
						<div className={'row dialog_row'}>
							<span className={'col-md-3'} style={{ textAlign: 'left', width: '220px', fontSize: '22px', fontWeight: '500' }}>
								{this.state.seatNo + '번 좌석'}
							</span>
							<span className={'col-md-2 seat_span'}>이용중</span>
						</div>

						<div className={'row dialog_row'} style={{ marginTop: '20px' }}>
							<span className={'col-md-2'} style={{ textAlign: 'left', width: '240px', padding: '3px 15px' }}>
								{this.state.member_name ? this.state.member_name : '이름없음'}(
								{this.state.member_phone ? <a href={'sms:' + this.state.member_phone}>{this.state.member_phone}</a> : null})
							</span>
							<span className={'col-md-2 user_span'}>{this.state.userSeq ? '회원' : '비회원'}</span>
						</div>

						<div className={'row dialog_row'}>
							<span className={'col-md-2 seat_row_span'}>
								[{this.state.type}] {this.state.product_name}
							</span>
						</div>

						<div className={'row dialog_row'}>
							<span className={'col-md-2 seat_row_span'} style={{ marginBottom: '10px' }}>
								{this.state.startDT_fm} ~ {this.state.timeType === 'real' ? '미정' : this.state.endDT_fm}
								&nbsp;
								{this.state.timeType === 'char' ? (
									<span style={{ float: 'right' }}>
										(
										{(this.state.remainingDay > 0 || this.state.remainingHour > 0) &&
											this.state.remainingDay * 24 + this.state.remainingHour + '시간 '}
										{this.state.remainingMinute + '분 남음)'}
									</span>
								) : this.state.timeType === 'day' ? (
									<span style={{ float: 'right' }}>
										{this.state.remainingDay > 0 ? `(${this.state.remainingDay + 1}일 남음)` : '(0일 남음)'}
									</span>
								) : this.state.timeType !== 'real' ? (
									<span style={{ float: 'right' }}>
										({this.state.remainingDay > 0 && this.state.remainingDay + '일 '}
										{this.state.remainingHour > 0 && this.state.remainingHour + '시간 '}
										{this.state.remainingMinute > 0 && this.state.remainingMinute + '분 '}
										남음)
									</span>
								) : null}
							</span>
						</div>

						<div className={'row dialog_row'} style={{ marginTop: '8px', textAlign: 'center' }}>
							<Button
								className={'dialog_btn3'}
								variant="outlined"
								onClick={this.DialogOpen.bind(this, 'extension')}
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
								퇴실처리
							</Button>
							<Button
								className={'dialog_btn3'}
								variant="outlined"
								onClick={this.DialogOpen.bind(this, 'moveDesk')}
								style={{ margin: '5px' }}
							>
								좌석이동
							</Button>
						</div>
						<div className={'row dialog_row'} style={{ marginBottom: '8px', textAlign: 'center' }}>
							<Button
								className={'dialog_btn3'}
								variant="outlined"
								onClick={this.hrefMessage.bind(this)}
								style={{ margin: '5px' }}
							>
								채팅
							</Button>
							<Button
								className={'dialog_btn3'}
								variant="outlined"
								onClick={this.hrefSms.bind(this)}
								style={{ margin: '5px', display: this.mobileChk() }}
							>
								SMS
							</Button>
							<Button
								className={'dialog_btn3'}
								variant="outlined"
								onClick={this.hrefUsage.bind(this)}
								style={{ margin: '5px' }}
							>
								이용내역
							</Button>
						</div>

						{this.state.deskReserved ? (
							this.state.deskReserved.length > 0 ? (
								<div>
									<List component="nav">
										<ListItem button onClick={this.handleClick}>
											<ListItemText inset primary="예약" /> {this.state.deskReserved.length}개
											{this.state.open ? <ExpandLess /> : <ExpandMore />}
										</ListItem>
										<Collapse in={this.state.open} timeout="auto" unmountOnExit>
											<List component="div" disablePadding>
												{this.state.deskReserved.map((dr, i) => (
													<ListItem button key={i}>
														<ListItemText inset style={{ paddingLeft: '0px', textAlign: 'center' }}>
															<span>
																{moment(dr.startDT).format('MM/DD HH:mm') +
																	' ~ ' +
																	moment(dr.endDT).format('MM/DD HH:mm')}
															</span>
															<img
																src={CancelIcon}
																className="cancleIcon"
																onClick={this.drCancel.bind(this, dr.seq)}
																alt=""
															/>
														</ListItemText>
													</ListItem>
												))}
											</List>
										</Collapse>
									</List>
								</div>
							) : null
						) : null}
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
