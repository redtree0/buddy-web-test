import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import axios from '../../wrapper/axios'
import MobileDetect from 'mobile-detect'
import moment from 'moment'

const kindData = [
	{
		value: 'wait',
		label: '계산서 발급 전'
	},
	{
		value: 'billed',
		label: '계산서 승인대기'
	},
	{
		value: 'ready',
		label: '지급 대기중'
	},
	{
		value: 'paid',
		label: '지급완료'
	},
	{
		value: 'deny',
		label: '거부'
	}
]

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

			seq: '',
			place: '', // 공간정보
			startDate: '', // 정산시작일
			endDate: '', // 정산종료일
			transferAmount: '', // 정산금액
			costVat: '', // 수수료
			costTotal: '', // 비용
			incomeTotal: '', // 수익
			transferStatus: '', // 상태
			transferDate: '' // 입금일
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			const data = this.props.placeInfo[0]
			this.setState({
				seq: data.seq,
				place: data.place, // 공간정보
				startDate: data.startDate, // 정산시작일
				endDate: data.endDate, // 정산종료일
				transferAmount: data.transferAmount, // 정산금액
				costVat: data.costVat, // 수수료
				costTotal: data.costTotal, // 비용
				incomeTotal: data.incomeTotal, // 수익
				transferStatus: data.transferStatus, // 상태
				transferDate: data.transferDate || moment().format('YYYY-MM-DD') // 입금일
			})
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({
			stateDialogReweighing: false,
			seq: '',
			place: '',
			startDate: '',
			endDate: '',
			transferAmount: '',
			costVat: '',
			costTotal: '',
			incomeTotal: '',
			transferStatus: '',
			transferDate: ''
		})
		this.customDialog.handleClose()
	}

	//저장
	handleSend = params => async () => {
		const { transferStatus } = params
		const { transferDate } = this.state

		// 지급완료일 때 입금일 선택
		if (transferStatus === 'paid' && !transferDate) {
			this.props.onClose({ flag: 'error', message: '입금일을 선택해주세요.' })
			return
		}

		try {
			const res = await axios.post('/income/update', {
				headers: { 'Content-type': 'application/json' },
				seq: this.state.seq,
				transferStatus,
				transferDate: transferStatus === 'paid' ? transferDate : null
			})

			if (res.data.result === 'success') {
				this.props.onClose({ flag: 'edit', message: '저장되었습니다.' })
				this.closeDialogReweighing()
			} else {
				this.props.onClose({ flag: 'fail', message: res.data.message })
			}
		} catch (error) {
			this.props.onClose({ flag: 'error', message: String(error.message) })
			console.error(error)
		}
	}

	//기본
	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
	}

	//금액 Format
	payFormat = value => {
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
							정산기간
						</span>
						<TextField
							disabled
							className={'col-md-2'}
							margin="normal"
							type="text"
							value={this.state.startDate + ' ~ ' + this.state.endDate}
						/>
					</div>

					<div className={'row'}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							정산금액
						</span>
						<TextField
							disabled
							className={'col-md-2'}
							margin="normal"
							type="text"
							value={this.state.transferAmount ? this.payFormat(this.state.transferAmount) : ''}
						/>
					</div>

					<div className={'row'}>
						<span className={'col-md-4'} style={{ textAlign: 'left', marginTop: '20px' }}>
							입금계좌
						</span>
						<TextField
							disabled
							className={'col-md-2'}
							margin="normal"
							type="text"
							value={
								this.state.place
									? (this.state.place['bankName'] || '') +
									  ' ' +
									  (this.state.place['accountNum'] || '계좌없음') +
									  (this.state.place['depositor'] && ' (예금주 : ' + this.state.place['depositor'] + ')')
									: '정보없음'
							}
						/>
					</div>

					<div className={'row'} style={{ marginTop: '12px', marginBottom: '12px' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							입금일
						</span>
						<TextField
							className={'col-md-2'}
							id="date"
							type="date"
							value={this.state.transferDate}
							onChange={this.handleChange('transferDate')}
						/>
					</div>
				</div>
			)
		} else {
			return (
				<div>
					<div className={'row'} style={{ width: '600px' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							정산기간
						</span>
						<TextField
							disabled
							className={'col-md-4'}
							margin="normal"
							type="text"
							value={this.state.startDate + ' ~ ' + this.state.endDate}
						/>
					</div>

					<div className={'row'} style={{ width: '600px' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
							정산금액
						</span>
						<TextField
							disabled
							className={'col-md-4'}
							margin="normal"
							type="text"
							value={this.state.transferAmount ? this.payFormat(this.state.transferAmount) : ''}
						/>
					</div>

					<div className={'row'} style={{ width: '600px' }}>
						<span className={'col-md-4'} style={{ textAlign: 'left', marginTop: '20px' }}>
							입금계좌
						</span>
						<TextField
							disabled
							className={'col-md-10'}
							margin="normal"
							type="text"
							value={
								this.state.place
									? (this.state.place['bankName'] || '') +
									  ' ' +
									  (this.state.place['accountNum'] || '계좌없음') +
									  (this.state.place['depositor'] && ' (예금주 : ' + this.state.place['depositor'] + ')')
									: '정보없음'
							}
						/>
					</div>

					<div className={'row'} style={{ width: '600px', marginTop: '20px' }}>
						<span className={'col-md-2'} style={{ textAlign: 'left' }}>
							상태
						</span>
						<TextField
							disabled
							className={'col-md-4'}
							value={this.state.transferStatus && kindData.find(k => k.value === this.state.transferStatus).label}
						></TextField>

						<span className={'col-md-2'} style={{ textAlign: 'left' }}>
							입금일
						</span>
						<TextField
							className={'col-md-4'}
							id="date"
							type="date"
							value={this.state.transferDate}
							onChange={this.handleChange('transferDate')}
						/>
					</div>
				</div>
			)
		}
	}

	render() {
		const devMode = () => {
			if (process.env.NODE_ENV !== 'production') {
				return (
					<Button variant="outlined" onClick={this.handleSend({ transferStatus: 'wait' })} color="secondary" autoFocus>
						개발용(wait)
					</Button>
				)
			} else {
				return null
			}
		}
		return (
			<div>
				<CustomDialog
					title={'상태 변경'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="detailDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>{this.isMobileCheck()}</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
							취소
						</Button>
						{devMode()}
						<Button variant="outlined" onClick={this.handleSend({ transferStatus: 'deny' })} color="secondary" autoFocus>
							거절
						</Button>
						<Button variant="outlined" onClick={this.handleSend({ transferStatus: 'ready' })} color="primary" autoFocus>
							계산서 확인
						</Button>
						<Button variant="outlined" onClick={this.handleSend({ transferStatus: 'paid' })} color="primary" autoFocus>
							지급완료
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
