import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import CloseIcon from './images/closeIcon.png'
import CancelDialog from './cancelDialog'
import moment from 'moment'
import axios from '../../wrapper/axios'

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

class detailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,
			cancelisOpen: false,

			reserveData: [],
			reserveRoomName: null,
			selectedTime: 1
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			this.setState({
				reserveData: this.props.reserveData,
				reserveRoomName: this.props.reserveRoomName,
				selectedTime: this.props.timeUnit == 60 ? 1 : 0.5
			})
		}, 0)
		this.loadValue()
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
		this.props.onClose()
	}

	loadValue = () => {}

	//ExtensionDialog Close Event
	closeEvent = (data, isRefund) => {
		this.setState({ cancelisOpen: false })
		if (!data) return
		//예약취소
		if (data === 'cancel') {
			//[예약취소] API 호출후
			const api_data = {
				roomUsageSeq: this.state.reserveData.seq,
				placeSeq: this.state.reserveData.placeSeq,
				isRefund
			}
			axios
				.post('/room/cancel', api_data)
				.then(res => {
					this.props.onClose('cancel')
					this.closeDialogReweighing()
				})
				.catch(error => console.error(error))
		}
	}

	//연장&퇴실처리 클릭
	DialogOpen = data => {
		if (data == 'cancel') {
			if (this.state.cancelisOpen) {
				this.setState({ cancelisOpen: false })
			} else {
				this.setState({ cancelisOpen: true })
			}
		}
	}

	//메시지
	hrefMessage = () => {
		if (this.state.reserveData.userSeq) {
			let data = {
				userSeq: this.state.reserveData.userSeq,
				userName: this.state.reserveData.member_name,
				userPhone: this.state.reserveData.member_phone,
				newMsgCnt: 0,
				image: 'assets/images/avatars/admin.png'
			}
			localStorage.setItem('message_user', JSON.stringify(data))
			this.props.onClose('message')
		}
	}

	//등록
	handleSend = () => {
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

	render() {
		const { classes } = this.props
		return (
			<div>
				<CancelDialog open={this.state.cancelisOpen} title={'예약취소'} onClose={this.closeEvent} />

				<CustomDialog
					// title={this.props.seatNo + '번 좌석'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={
						<InsertButton id="reserveDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />
					}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<img src={CloseIcon} className="dialogCancle" onClick={this.closeDialogReweighing} />
						<div className={'row room_dialog_row'}>
							<span className={'col-md-4 room_dialog_title'}>{this.state.reserveRoomName}</span>
							<span className={'col-md-2 seat_span'}>예약됨</span>
						</div>

						<div className={'row room_dialog_row'}>
							<span className={'col-md-2 seat_row_span'}>
								{this.state.reserveData.startDT
									? moment(this.state.reserveData.startDT).format('HH시 mm분') +
									  ' ~ ' +
									  moment(this.state.reserveData.endDT).format('HH시 mm분')
									: null}
							</span>
						</div>

						<div className={'row room_dialog_row'}>
							<span className={'col-md-2 seat_row_span'}>
								{this.state.reserveData.member_name || ''}
								{this.state.reserveData.member_phone && '('}
								{this.state.reserveData.member_phone && (
									<a href={'sms:' + this.state.reserveData.member_phone}>{this.state.reserveData.member_phone}</a>
								)}
								{this.state.reserveData.member_phone && ')'}
								{this.state.reserveData.headCount > 1 && ` 외 ${this.state.reserveData.headCount - 1}명`}
							</span>
						</div>

						<div className={'row room_dialog_row'} style={{ marginTop: '10px', textAlign: 'center' }}>
							<Button
								className={'room_dialog_btn'}
								variant="outlined"
								onClick={this.hrefMessage.bind(this)}
								color="default"
								style={{ margin: '10px' }}
							>
								채팅
							</Button>
							<Button
								className={'room_dialog_btn'}
								variant="outlined"
								onClick={this.DialogOpen.bind(this, 'cancel')}
								color="secondary"
								style={{ margin: '10px' }}
							>
								예약취소
							</Button>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
