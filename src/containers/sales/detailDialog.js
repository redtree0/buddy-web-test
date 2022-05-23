import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import RefundCheckDialog from './refundcheckDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import classNames from 'classnames'
import axios from '../../wrapper/axios'
import moment from 'moment'
import CloseIcon from './images/closeIcon.png'
import MobileDetect from 'mobile-detect'

const styles = theme => ({
	sapnStyle: {
		textAlign: 'left',
		marginTop: '8px',
		marginBottom: '8px',
		width: '320px',
		fontSize: '14px',
		fontWeight: '600',
		borderBottom: 'solid 1px #d8d8d8',
		paddingBottom: '6px'
	}
})

const md = new MobileDetect(window.navigator.userAgent)

class DetailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,
			refundcheckisOpen: false,
			detailData: null,
			seq: null,
			amount: '',
			name: '',
			phone: '',
			payMethod: '',
			type: '',
			product_name: '',
			wdate: '',
			usageType: '',
			no: '',
			startDT: '',
			endDT: '',
			totalHour: '',
			memo: ''
		}
	}

	init = () => {
		this.setState({
			detailData: null,
			seq: null,
			amount: '',
			name: '',
			phone: '',
			payMethod: '',
			type: '',
			product_name: '',
			wdate: '',
			usageType: '',
			no: '',
			startDT: '',
			endDT: '',
			totalHour: '',
			memo: ''
		})
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			axios
				.get('/sales/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/view/' + this.props.detailData['seq'])
				.then(res => {
					const detailData = res.data
					this.setState({
						detailData: detailData,
						seq: detailData['seq'],
						amount: detailData['amount'] ? detailData['amount'].toLocaleString() : 0,
						name: detailData['member'] && detailData['member'].name ? detailData['member'].name : '이름없음',
						phone: detailData['member'] && detailData['member'].phone ? detailData['member'].phone : '',
						payMethod: detailData['payMethod'] || '',
						type: detailData['type'] || '',
						product_name: detailData['product'] ? detailData['product'].name : '실시간',
						wdate: detailData['wdate'] || '',
						usageType: detailData['deskFreeUsage']
							? 'free'
							: detailData['deskCharUsage']
							? 'char'
							: detailData['deskUsage']
							? 'desk'
							: detailData['lockerUsage']
							? 'locker'
							: detailData['roomUsage']
							? 'room'
							: '',
						no:
							detailData['deskFreeUsage'] || detailData['deskCharUsage']
								? detailData['deskUsage'] && detailData['deskUsage'].deskNo
								: detailData['deskUsage']
								? detailData['deskUsage'].deskNo
								: detailData['lockerUsage']
								? detailData['lockerUsage'].lockerNo
								: detailData['roomUsage']
								? detailData['roomUsage'].room.name
								: '',
						startDT: detailData['deskFreeUsage']
							? detailData['deskFreeUsage'].startDT
							: detailData['deskCharUsage']
							? detailData['deskCharUsage'].startDT
							: detailData['deskUsage']
							? detailData['deskUsage'].startDT
							: detailData['lockerUsage']
							? detailData['lockerUsage'].startDT
							: detailData['roomUsage']
							? detailData['roomUsage'].startDT
							: '',
						endDT: detailData['deskFreeUsage']
							? detailData['deskFreeUsage'].endDT
							: detailData['deskCharUsage']
							? detailData['deskCharUsage'].endDT
							: detailData['deskUsage']
							? detailData['deskUsage'].endDT
							: detailData['lockerUsage']
							? detailData['lockerUsage'].endDT
							: detailData['roomUsage']
							? detailData['roomUsage'].endDT
							: '',
						totalHour: detailData['deskCharUsage'] ? detailData['deskCharUsage'].totalHour : ''
					})
				})
				.catch(error => console.error(error))
		}, 0)
	}

	closeDialogReweighing = () => {
		this.init()
		this.customDialog.handleClose()
	}

	DialogOpen = () => {
		this.setState({ refundcheckisOpen: true })
	}

	//ExtensionDialog Close Event
	closeEvent = async (data, isRefund) => {
		this.setState({ refundcheckisOpen: false })
		if (!data) return

		//환불처리
		if (data === 'refund') {
			axios
				.post('/sales/refund', {
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
					salesHistorySeq: this.state.seq
				})
				.then(res => {
					this.props.onClose('refund')
					this.closeDialogReweighing()
				})
				.catch(error => console.error(error))
		}
	}

	payFormat = () => {
		let str = ''
		if (this.state.type === 'refund' || this.state.type === 'cancel') {
			str = <p style={{ color: 'red', display: 'inline-block', margin: '0px' }}>{this.state.amount}</p>
		} else {
			str = <p style={{ color: 'black', display: 'inline-block', margin: '0px' }}>{this.state.amount}</p>
		}
		return str
	}

	render() {
		const { classes } = this.props
		return (
			<div>
				<RefundCheckDialog open={this.state.refundcheckisOpen} title={'환불'} onClose={this.closeEvent} />
				<CustomDialog
					className={'detailDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="detailDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px', padding: md.mobile() ? '0px' : '0 24px 24px' }}>
						<img src={CloseIcon} className="dialogCancle" onClick={this.closeDialogReweighing} alt="" />
						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<span
								className={'col-md-12'}
								style={{ textAlign: 'left', width: '250px', fontSize: '26px', fontWeight: '700' }}
							>
								{'매출 상세'}
							</span>
						</div>

						<div
							className={'row'}
							style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '10px 0' : null, marginTop: '10px' }}
						>
							<span className={classNames('col-md-2', classes.sapnStyle)} style={{ fontSize: '14px' }}>
								{this.state.name + ' ( ' + this.state.phone + ' )'}
							</span>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<span
								className={classNames('col-md-2', classes.sapnStyle)}
								style={{ width: '110px', display: 'inline-block', marginRight: '10px' }}
							>
								{'구분'}
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ width: '200px', wordBreak: 'keep-all' }}>
								{this.state.type
									? this.state.type === 'buy'
										? '구매'
										: this.state.type === 'refund'
										? '환불'
										: this.state.type === 'book'
										? '예약'
										: this.state.type === 'cancel'
										? '예약취소'
										: ''
									: ''}
							</span>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<span
								className={classNames('col-md-2', classes.sapnStyle)}
								style={{ width: '110px', display: 'inline-block', marginRight: '10px' }}
							>
								{'상품명'}
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ width: '200px', wordBreak: 'keep-all' }}>
								{this.state.product_name}
							</span>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<span
								className={classNames('col-md-2', classes.sapnStyle)}
								style={{ width: '110px', display: 'inline-block', marginRight: '10px' }}
							>
								{'결제수단'}
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ width: '200px', wordBreak: 'keep-all' }}>
								{this.state.payMethod
									? this.state.payMethod === 'cash'
										? '현장결제-현금'
										: this.state.payMethod === 'card'
										? '현장결제-카드'
										: this.state.payMethod === 'app'
										? '앱-캐시'
										: this.state.payMethod === 'admin'
										? '관리자-캐시'
										: '-'
									: ''}
							</span>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<span
								className={classNames('col-md-2', classes.sapnStyle)}
								style={{ width: '110px', display: 'inline-block', marginRight: '10px' }}
							>
								{'금액'}
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ width: '200px', wordBreak: 'keep-all' }}>
								{this.payFormat()}
								<p style={{ display: 'inline-block', margin: '0px' }}>{'원'}</p>
							</span>
						</div>

						{this.state.usageType && (
							<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
								<span
									className={classNames('col-md-2', classes.sapnStyle)}
									style={{ width: '110px', display: 'inline-block', marginRight: '10px' }}
								>
									{this.state.usageType === 'free' || this.state.usageType === 'char'
										? '좌석번호'
										: this.state.usageType === 'desk'
										? '좌석번호'
										: this.state.usageType === 'locker'
										? '락커번호'
										: this.state.usageType === 'room'
										? '스터디룸'
										: '-'}
								</span>
								<span className={classNames('col-md-2', classes.sapnStyle)} style={{ width: '200px' }}>
									{this.state.no ? this.state.no : '-'}
								</span>
							</div>
						)}

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<span
								className={classNames('col-md-2', classes.sapnStyle)}
								style={{ width: '110px', display: 'inline-block', marginRight: '10px' }}
							>
								{'이용시간'}
							</span>
							<span className={classNames('col-md-2', classes.sapnStyle)} style={{ width: '200px' }}>
								{this.state.startDT ? moment(this.state.startDT).format('M/D HH:mm') : ''}
								{this.state.startDT && this.state.endDT ? ' ~ ' : '-'}
								{this.state.endDT ? moment(this.state.endDT).format('M/D HH:mm') : ''}
								{this.state.totalHour ? this.state.totalHour + '시간' : ''}
							</span>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '320px', margin: md.mobile() ? '0' : null }}>
							<span
								className={classNames('col-md-2', classes.sapnStyle)}
								style={{ width: '110px', display: 'inline-block', marginRight: '10px' }}
							>
								비고
							</span>
							<span className={classNames('col-md-2', classes.sapnStyle)} style={{ width: '200px' }}>
								{this.state.memo || '-'}
							</span>
						</div>

						<div
							className={'row'}
							style={{
								width: md.mobile() ? '100%' : '320px',
								margin: md.mobile() ? '0' : null,
								marginTop: '10px',
								textAlign: 'center'
							}}
						>
							{this.props.detailData && !this.props.detailData.refSalesHistorySeq && (
								<Button
									variant="outlined"
									onClick={this.DialogOpen.bind(this, 'extension')}
									color="secondary"
									style={{ width: '130px', margin: '10px' }}
								>
									환불
								</Button>
							)}
							<Button variant="outlined" onClick={this.closeDialogReweighing} style={{ width: '130px', margin: '10px' }}>
								닫기
							</Button>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(DetailDialog)
