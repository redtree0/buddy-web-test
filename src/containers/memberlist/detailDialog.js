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

class detailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,

			seq: '', //Seq
			userSeq: '',
			key: '', //key
			name: '', //이름
			phone: '', //전화번호
			memberUsage: '', //최근이용내역
			memo: '', //메모
			isBlack: '', //차단여부
			regMethod: '', //가입경로
			wdate: '', //가입날짜

			vaccPass: false //백신패스-관리자확인
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			const data = this.props.memberInfo[0]
			this.setState({
				seq: data.seq,
				userSeq: data.userSeq,
				key: data.key,
				name: data.name,
				phone: data.phone,
				memo: data.memo,
				regMethod: data.regMethod,
				wdate: data.wdate,
				isBlack: data.isBlack,
				vaccPass: data.user && data.user.vaccPass
			})
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	//회원탈퇴
	handleLeave = async () => {
		const result = window.confirm('해당 회원을 탈퇴시키겠습니까?')
		if (result) {
			await axios
				.post('/member/' + this.state.key, {
					isLive: false
				})
				.then(res => {
					if (res.data.result === 'success') {
						this.props.onClose('leave')
						this.closeDialogReweighing()
					} else if (res.data.message) {
						this.props.onClose('error', res.data.message)
						this.closeDialogReweighing()
					} else {
						this.props.onClose('error', '에러가 발생하였습니다. 관리자에게 문의해주세요.')
						this.closeDialogReweighing()
					}
				})
				.catch(error => {
					console.error(error)
					alert('에러가 발생하였습니다.\n관리자에게 문의해주세요.' + error.message)
				})
		}
	}

	//저장
	handleSend = async () => {
		if (!this.state.name || !this.state.phone) {
			this.props.onClose('check')
			return
		}

		await axios
			.post('/member/' + this.state.key, {
				name: this.state.name,
				memo: this.state.memo,
				isBlack: this.state.isBlack
			})
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('edit')
					this.closeDialogReweighing()
				} else if (res.data.message) {
					this.props.onClose('error', res.data.message)
				} else {
					this.props.onClose('error', '에러가 발생하였습니다. 관리자에게 문의해주세요.')
				}
			})
			.catch(error => {
				console.error(error)
				alert('에러가 발생하였습니다.\n관리자에게 문의해주세요.' + error.message)
			})
	}

	handleVaccPass = () => {
		const user = this.props.memberInfo[0].user
		if (!user) {
			this.props.onClose('error', 'APP 사용자에게만 해당되는 기능입니다.')
			return
		}
		axios
			.post('/user/vacc/' + user.key, {
				birthYear: user.birthYear,
				vaccPass: user.vaccPass ? 0 : 1,
				vaccDegree: user.vaccDegree,
				vaccDate: user.vaccDate,
				vaccKind: user.vaccKind
			})
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('edit')
					this.closeDialogReweighing()
				} else if (res.data.message) {
					this.props.onClose('error', res.data.message)
				} else {
					this.props.onClose('error', '에러가 발생하였습니다. 관리자에게 문의해주세요.')
				}
			})
			.catch(error => {
				console.error(error)
				alert('에러가 발생하였습니다.\n관리자에게 문의해주세요.' + error.message)
			})
	}

	regFormat = () => {
		let regMethod = this.state.regMethod === 'admin' ? '관리자' : this.state.regMethod === 'app' ? '앱' : ''
		return `${this.state.wdate ? moment(this.state.wdate).format('YYYY/MM/DD HH:mm') : ''} 가입 (${regMethod})`
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
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px', display: 'inline-block' }}>
						이름
					</span>
					<TextField
						placeholder=""
						style={{ width: '130px' }}
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.name ? this.state.name : ''}
						onChange={e => this.handleFormFieldChange('name', e.target.value)}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px', width: '100px', display: 'inline-block' }}>
						&thinsp;*전화번호
					</span>
					<TextField
						required
						disabled
						style={{ width: '130px' }}
						className={'col-md-1'}
						margin="normal"
						type="tel"
						value={this.state.phone || ''}
						onChange={e => this.handleFormFieldChange('phone', e.target.value)}
					/>
				</div>

				<div className={'row'}>
					<TextField
						placeholder="메모를 입력해주세요"
						style={{ width: '100%' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						multiline
						rows="4"
						value={this.state.memo ? this.state.memo : ''}
						onChange={e => this.handleFormFieldChange('memo', e.target.value)}
					/>
				</div>

				<div className={'row'} style={{ width: '240px', marginTop: '10px', textAlign: 'right' }}>
					{this.regFormat()}
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
						disabled
						style={{ width: '200px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.phone || ''}
						onChange={e => this.handleFormFieldChange('phone', e.target.value)}
					/>
				</div>

				<div className={'row'} style={{ width: '500px' }}>
					<TextField
						placeholder="메모를 입력해주세요"
						style={{ width: '470px', marginLeft: '15px', marginRight: '15px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						multiline
						rows="4"
						value={this.state.memo ? this.state.memo : ''}
						onChange={e => this.handleFormFieldChange('memo', e.target.value)}
					/>
				</div>

				<div className={'row'} style={{ width: '500px', marginTop: '10px', textAlign: 'right' }}>
					{this.regFormat()}
				</div>
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
					title={'회원 수정'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="detailDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>{this.renderPage()}</DialogContent>

					<DialogActions>
						<span style={{ position: md.mobile() ? 'inherit' : 'absolute', left: '32px' }}>
							<input
								type="checkbox"
								checked={this.state.isBlack}
								onChange={e => this.handleFormFieldChange('isBlack', e.target.checked)}
								style={{ width: '20px', height: '20px', verticalAlign: 'bottom', marginRight: '2px' }}
							/>
							이용차단
						</span>

						<Button variant="outlined" onClick={this.handleLeave} color="secondary" style={{ float: 'left' }}>
							탈퇴
						</Button>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
							취소
						</Button>
						<Button variant="outlined" onClick={this.handleSend} color="primary" autoFocus>
							저장
						</Button>
						<Button
							variant="contained"
							onClick={this.handleVaccPass}
							color={this.state.vaccPass ? 'secondary' : 'primary'}
							autoFocus
						>
							{this.state.vaccPass ? '백신 수동중지' : '백신 수동확인'}
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
