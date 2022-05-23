import React from 'react'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

const styles = (theme) => ({
	listLayout: {
		background: 'white',
		border: 'solid 2px #dddddd',
		padding: '20px',
		margin: '10px',
		borderRadius: '12px',
		width: '760px'
	},
	listDiv: {
		height: '40px',
		verticalAlign: 'middle',
		padding: '0px 20px',
		marginBottom: '10px'
	},
	listInput: {
		width: '20px',
		height: '20px',
		verticalAlign: 'middle',
		margin: '0px 10px !important'
	},
	listP: {
		display: 'inline-block',
		verticalAlign: 'middle',
		margin: '0px',
		fontSize: '20px',
		fontWeight: '600',
		width: '250px'
	},
	listTxt: {
		resize: 'none',
		width: '300px',
		display: 'inline-block',
		verticalAlign: 'middle',
		margin: '0px 20px'
	},
	editBoxLayout: {
		background: 'white',
		border: 'solid 2px #dddddd',
		padding: '20px',
		margin: '10px',
		borderRadius: '12px',
		width: '300px',
		textAlign: 'center',
		display: 'none'
	},
	editBoxSpan: {
		display: 'block',
		textAlign: 'left',
		marginBottom: '10px',
		fontSize: '20px',
		fontWeight: '600'
	},
	editBoxTxt: {
		resize: 'none',
		marginTop: '20px',
		width: '100%'
	},
	editBoxBtnc: {
		width: '100px',
		marginTop: '20px',
		marginRight: '20px'
	},
	editBoxBtns: {
		width: '100px',
		marginTop: '20px'
	},
	btnLayout: {
		margin: '10px',
		width: '100%',
		textAlign: 'center'
	},
	Btnc: {
		width: '126px',
		height: '46px',
		marginTop: '20px',
		marginRight: '40px'
	},
	Btns: {
		width: '126px',
		height: '46px',
		marginTop: '20px'
	}
})

class AutoNoti extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			messageData: [],
			editTitle: '',
			editBoxisOn: false,
			editValue: ''
		}
	}

	componentDidMount() {
		setTimeout(() => {
			this.loadValue()
		}, 200)
	}

	loadValue = async () => {
		// if(this.state.firstDate === '' || this.state.firstDate === null || this.state.lastDate === '' || this.state.lastDate === null) {
		//     this.alertMessage("날짜가 비어있습니다.", "날짜를 선택해주세요.", "danger");
		//     return;
		// }
		// await axios.get('/msg/' + JSON.parse(localStorage.getItem('manager_place')).seq, {
		//     params: {
		//         from: this.state.firstDate,
		//         to: this.state.lastDate
		//     }
		// }).then(res =>{
		//     let data = res.data;
		//     data.sort((a, b) => a.seq - b.seq);
		//     let _salesData = [];
		//     for(let i=0; i<data.length; i++){
		//         let push_data = {
		//             order: i+1,
		//             seq: data[i].seq,
		//             member: data[i].member ? data[i].member : '',
		//             type: data[i].type,
		//             product_name: data[i].product ? data[i].product['name'] : '',
		//             amount: data[i].amount,
		//             payMethod: data[i].payMethod,
		//             wdate: data[i].wdate
		//         };
		//         _salesData.push(push_data);
		//     }
		//     this.setState({ salesData : _salesData })
		// }).catch(error => console.error(error));
	}

	setEdit = (title, index) => {
		// if(this.state.editBoxisOn){
		//   this.setState({editBoxisOn: false, editTitle: ''})
		//   document.getElementById('editBox').style.display = "none";
		// }else {
		this.setState({ editBoxisOn: true, editTitle: title })
		document.getElementById('editBox').style.display = 'block'
		// }
	}

	editCancel = () => {
		this.setState({ editBoxisOn: false, editTitle: '', editValue: '' })
		document.getElementById('editBox').style.display = 'none'
	}

	editSave = () => {
		this.setState({ editBoxisOn: false, editTitle: '' })
		document.getElementById('editBox').style.display = 'none'
		this.setState({ editValue: '' })
	}

	onCancel = () => {}

	onSave = () => {}

	handleChange = (prop) => (event) => {
		this.setState({ [prop]: event.target.value })
	}

	closeEvent = (data) => {
		if (!data) return

		//회원 미선택 Message 출력
		if (data === 'memberSelectChk') {
			this.alertMessage('회원을 선택해주세요.', '회원을 선택해주세요.', 'danger')
			return
		}
		//회원이름 비어있을때 Message 출력
		if (data === 'memberNmChk') {
			this.alertMessage('회원 이름을 입력해주세요.', '회원 이름을 입력해주세요.', 'danger')
			return
		}
		//상품이 비어있을때 Message 출력
		if (data === 'productChk') {
			this.alertMessage('상품을 선택해주세요.', '상품을 선택해주세요.', 'danger')
			return
		}
		//이용내역이 비어있을때 Message 출력
		if (data === 'salesHistoryChk') {
			this.alertMessage('이용내역을 선택해주세요.', '이용내역을 선택해주세요.', 'danger')
			return
		}
		//환불사유가 비어있을때 Message 출력
		if (data === 'refundReasonChk') {
			this.alertMessage('환불사유를 선택해주세요.', '환불사유를 선택해주세요.', 'danger')
			return
		}
		//금액이 비어있을때 Message 출력
		if (data === 'amountChk') {
			this.alertMessage('금액을 입력해주세요.', '금액을 입력해주세요.', 'danger')
			return
		}
		//날짜가 비어있을때 Message 출력
		if (data === 'saleDTChk') {
			this.alertMessage('날짜를 입력해주세요.', '날짜를 입력해주세요.', 'danger')
			return
		}
		//성공 Message 출력
		if (data === 'success') {
			this.alertMessage('등록 완료.', '등록 완료.', 'success')
			this.loadValue()
			return
		}
	}

	//Message 출력
	alertMessage = (title, message, type) => {
		Store.addNotification({
			title: title,
			message: message,
			type: type,
			insert: 'top',
			container: 'top-center',
			animationIn: ['animated', 'fadeIn'],
			animationOut: ['animated', 'fadeOut'],
			dismiss: { duration: 3000 },
			dismissable: { click: true }
		})
	}

	/**
	 * 날짜 0 추가용
	 */
	addZero = (n) => {
		let zero = ''
		n = n.toString()
		if (n.length < 2) {
			for (let i = 0; i < 2 - n.length; i++) zero += '0'
		}
		return zero + n
	}

	render() {
		const { classes } = this.props
		return (
			<div style={{ padding: '5%' }}>
				<ReactNotifications />

				<div className={classNames('col-md-8', classes.listLayout)}>
					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>좌석 1회권 구매 직후</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button
								variant="outlined"
								color="secondary"
								className={''}
								onClick={() => this.setEdit('좌석 1회권 구매 직후', 0)}
							>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>좌석 기간권 구매 직후</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button
								variant="outlined"
								color="secondary"
								className={''}
								onClick={() => this.setEdit('좌석 기간권 구매 직후', 1)}
							>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>좌석 1회권 퇴실 10분전</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button
								variant="outlined"
								color="secondary"
								className={''}
								onClick={() => this.setEdit('좌석 1회권 퇴실 10분전', 2)}
							>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>좌석 기간권 이용만료 1일 전</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button
								variant="outlined"
								color="secondary"
								className={''}
								onClick={() => this.setEdit('좌석 기간권 이용만료 1일 전', 3)}
							>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>스터디룸 예약 직후</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button
								variant="outlined"
								color="secondary"
								className={''}
								onClick={() => this.setEdit('스터디룸 예약 직후', 4)}
							>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>스터디룸 이용 1시간 전</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button
								variant="outlined"
								color="secondary"
								className={''}
								onClick={() => this.setEdit('스터디룸 이용 1시간 전', 5)}
							>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>스터디룸 퇴실 10분 전</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button
								variant="outlined"
								color="secondary"
								className={''}
								onClick={() => this.setEdit('스터디룸 퇴실 10분 전', 6)}
							>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>락커 구매 직후</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button variant="outlined" color="secondary" className={''} onClick={() => this.setEdit('락커 구매 직후', 7)}>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>락커 이용만료 1일 전</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button
								variant="outlined"
								color="secondary"
								className={''}
								onClick={() => this.setEdit('락커 이용만료 1일 전', 8)}
							>
								편집
							</Button>
						</div>
					</div>

					<div className={classNames('row', classes.listDiv)}>
						<div style={{ verticalAlign: 'middle' }}>
							<input
								className={classNames(classes.listInput)}
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
							/>
							<p className={classNames(classes.listP)}>운영시간 종료 전</p>
							<textarea
								className={classNames('form-control', classes.listTxt)}
								placeholder="내용을 입력해주세요."
								rows="1"
							></textarea>
							<Button variant="outlined" color="secondary" className={''} onClick={() => this.setEdit('운영시간 종료 전', 9)}>
								편집
							</Button>
						</div>
					</div>
				</div>

				<div id="editBox" className={classNames('col-md-4', classes.editBoxLayout)}>
					<span className={classNames(classes.editBoxSpan)}>
						<p>{this.state.editTitle}</p>
					</span>

					<textarea
						className={classNames('form-control', classes.editBoxTxt)}
						placeholder="내용을 입력해주세요."
						rows="12"
						value={this.state.editValue}
						onChange={this.handleChange('editValue')}
					></textarea>

					<Button className={classes.editBoxBtnc} variant="raised" onClick={this.editCancel} color="secondary">
						취소
					</Button>
					<Button className={classes.editBoxBtns} variant="raised" onClick={this.editSave} color="primary">
						적용
					</Button>
				</div>

				<div className={classNames('col-md-12', classes.btnLayout)}>
					<Button className={classes.Btnc} variant="raised" onClick={this.onCancel} color="secondary">
						취소
					</Button>
					<Button className={classes.Btns} variant="raised" onClick={this.onSave} color="primary">
						저장
					</Button>
				</div>

				<div className="hidden_"></div>
			</div>
		)
	}
}

export default withStyles(styles)(AutoNoti)
