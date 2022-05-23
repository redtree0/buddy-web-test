import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import MobileDetect from 'mobile-detect'
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
const md = new MobileDetect(window.navigator.userAgent)

class detailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,

			seq: '', //Seq
			key: '', //key
			name: '', //이름
			phone: '', //전화번호
			memo: '', //메모
			wdate: '', //가입날짜
			usage: '',
			cash: ''
		}
	}

	openDialogReweighing = async () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			const userInfo = this.props.userInfo[0]

			axios
				.get('/user/' + userInfo.key, { params: { incCash: true } })
				.then(res => {
					this.setState({
						seq: res.data.seq,
						key: res.data.key,
						name: res.data.name,
						phone: res.data.phone,
						memo: res.data.memo,
						cash: res.data.usersCash && res.data.usersCash.cash,
						wdate: res.data.wdate,
						usage: res.data.salesHistory
							? moment(res.data.salesHistory.saleDT).format('M/D HH:mm') +
							  (res.data.salesHistory.deskUsageSeq ? ` 좌석(${res.data.salesHistory.deskUsageSeq}) ` : '') +
							  (res.data.salesHistory.roomUsageSeq ? ` 스터디룸(${res.data.salesHistory.roomUsageSeq}) ` : '') +
							  (res.data.salesHistory.lockerUsageSeq ? ` 락커(${res.data.salesHistory.lockerUsageSeq}) ` : '') +
							  (res.data.salesHistory.amount ? res.data.salesHistory.amount.toLocaleString() + '원' : '')
							: '-'
					})
				})
				.catch(error => {
					console.error(error)
				})
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	deleteUser = async () => {
		await axios
			.delete('/user/' + this.state.seq)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('delete')
					this.closeDialogReweighing()
				}
			})
			.catch(error => {
				console.error(error)
			})
	}

	//저장
	handleSend = async () => {
		if (this.state.name === '' || this.state.name === null || this.state.phone === '' || this.state.phone === null) {
			this.props.onClose('check')
			return
		}

		await axios
			.post('/user/' + this.state.key, {
				headers: { 'Content-type': 'application/json' },
				seq: this.state.seq,
				key: this.state.key,
				name: this.state.name,
				phone: this.state.phone,
				memo: this.state.memo
			})
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('edit')
					this.closeDialogReweighing()
				}
			})
			.catch(error => {
				console.error(error)
			})
	}

	//메시지
	hrefMessage = () => {
		if (this.state.seq) {
			let data = {
				userSeq: this.state.seq,
				userName: this.state.name,
				userPhone: this.state.phone,
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

	mobileChk = () => {
		if (md.mobile() === null) {
			return 'none'
		}
	}

	//기본
	handleFormFieldChange = (prop, value) => {
		this.setState({ [prop]: value })
	}

	//기본
	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
	}

	mobilePage = () => {
		return (
			<div className={'row'} style={{ width: '240px', margin: '0px' }}>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '120px', display: 'inline-block' }}>
						이름
					</span>
					<TextField
						placeholder=""
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.name ? this.state.name : ''}
						onChange={e => this.handleFormFieldChange('name', e.target.value)}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '120px', display: 'inline-block' }}>
						&thinsp;*전화번호
					</span>
					<TextField
						required
						placeholder="000-0000-0000"
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="tel"
						value={this.state.phone ? this.state.phone : ''}
						onChange={e => this.handleFormFieldChange('phone', e.target.value)}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px', width: '120px', display: 'inline-block' }}>
						최근 이용내역
					</span>
					<TextField
						disabled
						placeholder="없음"
						style={{ width: '150px' }}
						className={'col-md-9'}
						margin="normal"
						type="text"
						value={this.state.usage ? this.state.usage : ''}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '120px', display: 'inline-block' }}>
						보유 캐시
					</span>
					<TextField
						disabled
						placeholder="없음"
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.cash ? Number(this.state.cash).toLocaleString() + '원' : '0원'}
					/>
				</div>

				<div className={'row'}>
					<TextField
						placeholder="메모를 입력해주세요"
						style={{ width: '100%', marginLeft: '15px', marginRight: '15px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.memo ? this.state.memo : ''}
						onChange={e => this.handleFormFieldChange('memo', e.target.value)}
					/>
				</div>

				<div className={'row'} style={{ width: '300px', marginTop: '10px', textAlign: 'right' }}>
					가입일 : {moment(this.state.wdate).format('YYYY/MM/DD HH:mm')}
				</div>
			</div>
		)
	}

	pcPage = () => {
		return (
			<div>
				<div className={'row'} style={{ width: '500px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '80px' }}>
						이름
					</span>
					<TextField
						placeholder=""
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.name ? this.state.name : ''}
						onChange={e => this.handleFormFieldChange('name', e.target.value)}
					/>

					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px' }}>
						&thinsp;*전화번호
					</span>
					<TextField
						required
						placeholder="000-0000-0000"
						style={{ width: '200px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.phone ? this.state.phone : ''}
						onChange={e => this.handleFormFieldChange('phone', e.target.value)}
					/>
				</div>

				<div className={'row'} style={{ width: '500px' }}>
					<span className={'col-md-3'} style={{ textAlign: 'left', marginTop: '20px' }}>
						최근 이용내역
					</span>
					<TextField
						disabled
						placeholder="없음"
						className={'col-md-9'}
						margin="normal"
						type="text"
						value={this.state.usage ? this.state.usage : ''}
					/>
				</div>

				<div className={'row'} style={{ width: '500px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '120px' }}>
						보유 캐시
					</span>
					<TextField
						disabled
						placeholder="없음"
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.cash ? Number(this.state.cash).toLocaleString() + '원' : '0원'}
					/>
				</div>

				<div className={'row'} style={{ width: '500px' }}>
					<TextField
						placeholder="메모를 입력해주세요"
						style={{ width: '470px', marginLeft: '15px', marginRight: '15px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.memo ? this.state.memo : ''}
						onChange={e => this.handleFormFieldChange('memo', e.target.value)}
					/>
				</div>

				<div className={'row'} style={{ width: '500px', marginTop: '10px', textAlign: 'right' }}>
					가입일 : {moment(this.state.wdate).format('YYYY/MM/DD HH:mm')}
				</div>
			</div>
		)
	}

	renderPage = () => {
		return md.mobile() ? this.mobilePage() : this.pcPage()
	}

	render() {
		const { classes } = this.props
		return (
			<div>
				<CustomDialog
					title={'유저 상세'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="detailDialog_btn" btnText="수정" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>{this.renderPage()}</DialogContent>

					<DialogActions>
						<Button variant="outlined" style={{ margin: md.mobile() ? '0px' : null }} onClick={this.hrefMessage}>
							채팅
						</Button>
						<Button
							variant="outlined"
							onClick={this.hrefSms}
							style={{ display: this.mobileChk(), margin: md.mobile() ? '0px' : null }}
						>
							SMS
						</Button>
						<Button
							variant="outlined"
							onClick={this.deleteUser}
							color="secondary"
							style={{ margin: md.mobile() ? '0px' : null, marginRight: md.mobile() ? '0px' : '200px' }}
						>
							삭제
						</Button>
						<Button
							variant="outlined"
							style={{ margin: md.mobile() ? '0px' : null }}
							onClick={this.closeDialogReweighing}
							color="default"
						>
							닫기
						</Button>
						<Button
							variant="outlined"
							style={{ margin: md.mobile() ? '0px' : null }}
							onClick={this.handleSend}
							color="primary"
							autoFocus
						>
							저장
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
