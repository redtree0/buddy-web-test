import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table'
import Button from '@material-ui/core/Button'
import MobileDetect from 'mobile-detect'
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
			cashHistory: []
		}
	}

	openDialogReweighing = async () => {
		this.setState({ stateDialogReweighing: true })
		setTimeout(() => {
			if (!this.props.userSeq) return
			axios
				.get('/cash', {
					params: {
						perPage: 100,
						userSeq: this.props.userSeq
					}
				})
				.then((res) => {
					const cashHistory =
						res.data.list &&
						res.data.list.map((el) => {
							return {
								...el,
								typeStr:
									el.type == 'charge'
										? '충전'
										: el.type == 'use'
										? '사용'
										: el.type == 'cancel'
										? '이용취소'
										: el.type == 'refund'
										? '환불'
										: el.type == 'admin'
										? '조정'
										: el.type == 'recharge'
										? '재충전'
										: '-',
								name: el.user && el.user.name,
								phone: el.user && el.user.phone,
								imp_uid: el.payment && el.payment.imp_uid,
								receipt_url: el.payment && el.payment.receipt_url,
								wdate: moment(el.wdate).format('YYYY/MM/DD HH:mm'),
								contents:
									el.type == 'admin'
										? '관리자페이지 조정'
										: el.product
										? el.product.name + ' 구매'
										: el.roomUsageSeq
										? '스터디룸 예약'
										: el.lockerUsageSeq
										? '락커 이용권 구매'
										: el.deskUsageSeq
										? '좌석 실시간권 이용'
										: el.payment
										? el.payment.pg_provider == 'kakaopay'
											? '카카오페이'
											: el.payment.pay_method == 'phone'
											? '휴대폰결제'
											: el.payment.pay_method == 'trans'
											? '계좌이체'
											: el.payment.pay_method == 'vbank'
											? '무통장입금'
											: el.payment.pay_method == 'cardNum'
											? '(비인증) ' + el.payment.card_name
											: el.payment.card_name || el.payment.pay_method
										: ''
							}
						})
					this.setState({ cashHistory, listTotal: res.data.total })
				})
				.catch((error) => console.error(error))
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, cashHistory: [] })
		this.customDialog.handleClose()
	}

	amountFormat(cell) {
		return cell != null ? Number(cell).toLocaleString() + '원' : '-'
	}

	linkFormatter(cell, row) {
		return (
			cell && (
				<div>
					<a href={cell} target="_blank">
						{row.imp_uid}
					</a>
				</div>
			)
		)
	}

	pcPage = () => {
		return (
			<div>
				<div className={'row'} style={{ width: '800px' }}>
					<BootstrapTable data={this.state.cashHistory}>
						<TableHeaderColumn dataField="seq" isKey width="60px">
							Seq
						</TableHeaderColumn>
						<TableHeaderColumn dataField="typeStr" width="80px">
							타입
						</TableHeaderColumn>
						<TableHeaderColumn dataField="amount" width="80px" dataFormat={this.amountFormat.bind(this)}>
							금액
						</TableHeaderColumn>
						<TableHeaderColumn dataField="balance" width="80px" dataFormat={this.amountFormat.bind(this)}>
							잔액
						</TableHeaderColumn>
						<TableHeaderColumn dataField="contents" width="*">
							내용
						</TableHeaderColumn>
						<TableHeaderColumn dataField="receipt_url" width="*" dataFormat={this.linkFormatter}>
							영수증
						</TableHeaderColumn>
						<TableHeaderColumn dataField="wdate" width="120px">
							발생일
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div>
				<CustomDialog
					title={'캐시내역'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={
						<InsertButton id="cashHistoryDialog_btn" btnText="캐시내역" btnContextual="btn-warning" className="hidden_" />
					}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>{this.pcPage()}</DialogContent>

					<DialogActions>
						<Button
							variant="outlined"
							style={{ margin: md.mobile() ? '0px' : null }}
							onClick={this.closeDialogReweighing}
							color="default"
						>
							닫기
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
