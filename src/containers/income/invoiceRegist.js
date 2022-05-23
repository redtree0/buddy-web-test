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
			seq: '',
			place: '', // 공간정보
			year: '', // 년
			month: '', // 월
			startDate: '', // 시작일
			endDate: '', // 종료일
			transferAmount: '', // 정산금액
			costVat: '', // 수수료
			costTotal: '', // 비용
			incomeTotal: '', // 수익 합계
			incomeVat: '', // 수익 공급가액
			transferStatus: '', // 상태
			transferDate: '', // 입금일
			companyName: '', // 회사명
			taxPayer: '', // 과세자 구분
			registDate: moment().format('YYYY-MM-DD')
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		const self = this
		setTimeout(async () => {
			if (this.props.placeInfo) {
				const data = this.props.placeInfo[0]

				this.setState({
					seq: data.seq,
					place: data.place, // 공간정보
					year: data.year, // 년
					month: data.month, // 월
					startDate: data.startDate, // 시작일
					endDate: data.endDate, // 종료일
					transferAmount: data.transferAmount, // 정산금액
					costAmount: data.costAmount, // 수수료
					costVat: data.costVat, // 수수료
					costTotal: data.costTotal, // 비용
					incomeTotal: data.incomeTotal, // 수익
					transferStatus: data.transferStatus, // 상태
					registDate: moment().format('YYYY-MM-DD'), // 정발행일
					registDateReverse: moment().format('YYYY-MM-DD'), // 역발행일
					incomeVat: data.incomeVat, // 수익 공급가액
					taxPayer: data.place && data.place.taxPayer // 과세자 구분
				})
				if (data.seq) {
					console.log(data.seq)
					const list = await this.getInvoiceStatus(data.seq)
					if (list) {
						let invoiceForward, invoiceReverse
						list.forEach((el) => {
							if (el.invoiceType == '1') invoiceForward = el
							else if (el.invoiceType == '2') invoiceReverse = el
						})
						this.setState({
							invoiceForward,
							invoiceReverse
						})
					}
				}
			}
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, invoiceForward: null, invoiceReverse: null })
		this.customDialog.handleClose()
	}

	//저장
	handleSend = (param) => async (e) => {
		const { addPath } = param
		try {
			const { startDate, endDate, place, transferStatus, registDate } = this.state
			if (transferStatus === 'paid') {
				throw new Error('이미 발급된 계산서입니다.')
			}

			const { seq } = place
			const res = await axios.post(`/invoice/regist${addPath}`, {
				headers: { 'Content-type': 'application/json' },
				startDate,
				endDate,
				registDate,
				placeSeq: seq
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

	getInvoiceStatus = async (seq) => {
		try {
			const { data } = await axios.get(`/invoice/${seq}`, {
				headers: { 'Content-type': 'application/json' }
			})
			if (data.result === 'success') {
				return data.list
			} else {
				return null
			}
		} catch (error) {
			this.props.onClose({ flag: 'error', message: String(error.message) })
			console.error(error)
			return null
		}
	}

	//기본
	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	//금액 Format
	payFormat = (value) => {
		let str = ''
		str = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'
		return str
	}

	renderPage = () => {
		if (md.mobile()) {
			return this.mobilePage()
		} else {
			return this.pcPage()
		}
	}

	// 모바일 화면
	mobilePage = () => {
		return (
			<div className={'row'} style={{ width: '240px', margin: '0px' }}>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						회사명
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['companyName'] : ''}
					/>
				</div>

				<div className={'row'}>
					<span style={{ textAlign: 'left', marginTop: '20px', 'word-break': 'keep-all' }}>사업자번호</span>
					<TextField
						disabled
						className={'col-md-1'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['bizRegNum'] : ''}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						대표자
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['ceoName'] : ''}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						대표메일
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['bizEmail'] : ''}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						업태
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['bizType'] : ''}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						업종
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['bizClass'] : ''}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						과세 구분
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.taxPayer == '1' ? '일반과세자' : this.state.taxPayer == '2' ? '간이과세자' : '-'}
					/>
				</div>

				{/* 정발행 */}

				<div className={'row'}>
					<hr />
					<h4 className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						매입 계산서(비용)
					</h4>
					<Button
						className={'col-md-1'}
						disabled={this.isRegistInvoice()}
						variant="outlined"
						style={{ float: 'right' }}
						color="primary"
						onClick={this.handleSend({ addPath: '' })}
					>
						정발행
					</Button>
				</div>

				<div className={'row'}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '20px' }}>
						합계
					</span>
					<TextField
						disabled
						className={'col-md-1'}
						margin="normal"
						type="text"
						value={this.state.costTotal ? this.payFormat(this.state.costTotal) : ''}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'center', marginTop: '20px' }}>
						공급가
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.costAmount ? this.payFormat(this.state.costAmount) : ''}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '20px' }}>
						부가세
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.costVat ? this.payFormat(this.state.costVat) : ''}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '10px' }}>
						발급
					</span>
					<TextField
						className={'col-md-1'}
						disabled
						id="date"
						type="text"
						value={
							this.state.invoiceForward && this.state.invoiceForward.wdate
								? moment(this.state.invoiceForward.wdate).format('YYYY.MM.DD')
								: ''
						}
					/>
				</div>
				<div className={'row'}>
					<TextField
						className={'col-md-1'}
						disabled
						type="text"
						value={this.state.invoiceForward && this.state.invoiceForward.mgtNum}
					/>
				</div>

				{/* 역발행 */}

				<div className={'row'}>
					<hr />
					<h4 className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						매입 계산서(비용)
					</h4>
					<Button
						className={'col-md-1'}
						disabled={this.isRegistInvoiceReverse()}
						variant="outlined"
						style={{ float: 'right' }}
						color="secondary"
						onClick={this.handleSend({ addPath: '/reverse' })}
					>
						역발행
					</Button>
				</div>

				<div className={'row'}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '20px' }}>
						합계
					</span>
					<TextField
						disabled
						className={'col-md-1'}
						margin="normal"
						type="text"
						value={this.state.costTotal ? this.payFormat(this.state.incomeTotal) : ''}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'center', marginTop: '20px' }}>
						공급가
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={
							this.state.incomeTotal && this.state.incomeVat
								? this.payFormat(this.state.incomeTotal - this.state.incomeVat)
								: ''
						}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '20px' }}>
						부가세
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.costVat ? this.payFormat(this.state.incomeVat) : ''}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '10px' }}>
						발급
					</span>
					<TextField
						className={'col-md-1'}
						disabled
						id="reverseDate"
						type="text"
						value={
							this.state.invoiceReverse && this.state.invoiceReverse.wdate
								? moment(this.state.invoiceReverse.wdate).format('YYYY.MM.DD')
								: ''
						}
					/>
				</div>
				<div className={'row'}>
					<TextField
						className={'col-md-1'}
						disabled
						type="text"
						value={this.state.invoiceReverse && this.state.invoiceReverse.mgtNum}
					/>
				</div>
			</div>
		)
	}

	// PC 화면
	pcPage = () => {
		return (
			<div>
				<div className={'row'} style={{ width: '700px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						회사명
					</span>
					<TextField
						disabled
						className={'col-md-5'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['companyName'] : ''}
					/>

					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						사업자번호
					</span>
					<TextField
						disabled
						className={'col-md-3'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['bizRegNum'] : ''}
					/>
				</div>

				<div className={'row'} style={{ width: '600px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						대표자
					</span>
					<TextField
						disabled
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['ceoName'] : ''}
					/>

					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						대표메일
					</span>
					<TextField
						disabled
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place['bizEmail'] : ''}
					/>
				</div>

				<div className={'row'} style={{ width: '600px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						업태
					</span>
					<TextField
						disabled
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place.bizType : ''}
					/>

					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						업종
					</span>
					<TextField
						disabled
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.place ? this.state.place.bizClass : ''}
					/>
				</div>

				<div className={'row'} style={{ width: '600px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'left', marginTop: '20px' }}>
						과세 구분
					</span>
					<TextField
						disabled
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.taxPayer == '1' ? '일반과세자' : this.state.taxPayer == '2' ? '간이과세자' : '-'}
					/>
				</div>

				<div className={'row'} style={{ width: '740px' }}>
					<hr />
					<h4 className={'col-md-4'} style={{ textAlign: 'left', marginTop: '20px' }}>
						매입 계산서(비용)
					</h4>
				</div>

				<div className={'row'} style={{ width: '740px' }}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '20px' }}>
						합계
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.costTotal ? this.payFormat(this.state.costTotal) : ''}
					/>
					<span className={'col-md-1'} style={{ textAlign: 'right', marginTop: '20px' }}>
						=
					</span>
					<span className={'col-md-2'} style={{ textAlign: 'center', marginTop: '20px' }}>
						공급가액
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.costAmount ? this.payFormat(this.state.costAmount) : ''}
					/>
					<span className={'col-md-1'} style={{ textAlign: 'right', marginTop: '20px' }}>
						+
					</span>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '20px' }}>
						세액
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.costVat ? this.payFormat(this.state.costVat) : ''}
					/>
				</div>

				<div className={'row'} style={{ width: '740px' }}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '10px' }}>
						발급
					</span>
					<TextField
						className={'col-md-2'}
						disabled
						id="date"
						type="text"
						value={
							this.state.invoiceForward && this.state.invoiceForward.wdate
								? moment(this.state.invoiceForward.wdate).format('YYYY.MM.DD')
								: ''
						}
					/>
					<TextField
						className={'col-md-3'}
						disabled
						type="text"
						style={{ marginLeft: '10px' }}
						value={this.state.invoiceForward && this.state.invoiceForward.mgtNum}
					/>

					<Button
						className={'col-md-2'}
						disabled={this.isRegistInvoice()}
						variant="outlined"
						style={{ float: 'right' }}
						onClick={this.handleSend({ addPath: '' })}
						color="primary"
					>
						정발행
					</Button>
				</div>

				<div className={'row'} style={{ width: '740px' }}>
					<hr />
					<h4 className={'col-md-4'} style={{ textAlign: 'left', marginTop: '20px' }}>
						매출 계산서(수익)
					</h4>
				</div>

				<div className={'row'} style={{ width: '740px' }}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '20px' }}>
						합계
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.incomeTotal ? this.payFormat(this.state.incomeTotal) : ''}
					/>
					<span className={'col-md-1'} style={{ textAlign: 'right', marginTop: '20px' }}>
						=
					</span>
					<span className={'col-md-2'} style={{ textAlign: 'center', marginTop: '20px' }}>
						공급가액
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={
							this.state.incomeTotal && this.state.incomeVat
								? this.payFormat(this.state.incomeTotal - this.state.incomeVat)
								: ''
						}
					/>
					<span className={'col-md-1'} style={{ textAlign: 'right', marginTop: '20px' }}>
						+
					</span>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '20px' }}>
						세액
					</span>
					<TextField
						disabled
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.incomeVat ? this.payFormat(this.state.incomeVat) : ''}
					/>
				</div>

				<div className={'row'} style={{ width: '740px' }}>
					<span className={'col-md-1'} style={{ textAlign: 'left', marginTop: '10px' }}>
						발급
					</span>
					<TextField
						className={'col-md-2'}
						disabled
						id="reverseDate"
						type="text"
						value={
							this.state.invoiceReverse && this.state.invoiceReverse.wdate
								? moment(this.state.invoiceReverse.wdate).format('YYYY.MM.DD')
								: ''
						}
					/>
					<TextField
						className={'col-md-3'}
						disabled
						type="text"
						style={{ marginLeft: '10px' }}
						value={this.state.invoiceReverse && this.state.invoiceReverse.mgtNum}
					/>

					<Button
						className={'col-md-2'}
						disabled={this.isRegistInvoiceReverse()}
						variant="outlined"
						style={{ float: 'right' }}
						color="secondary"
						onClick={this.handleSend({ addPath: '/reverse' })}
					>
						역발행
					</Button>
				</div>

				<div className={'row'} style={{ width: '740px' }}>
					<hr />
				</div>
			</div>
		)
	}

	isRegistInvoice = () => {
		return this.state.invoiceForward ? true : false
		//return this.state.transferStatus !== 'wait' || this.state.invoiceForward ? true : false
	}

	isRegistInvoiceReverse = () => {
		// 역발행은 간이과세자 제외
		return this.state.taxPayer === '2' || this.state.invoiceReverse ? true : false
		// return this.state.taxPayer === '2' ||  this.state.transferStatus !== 'wait' || this.state.invoiceReverse ? true : false
	}

	render() {
		return (
			<div>
				<CustomDialog
					title={'계산서 발급'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing.bind(this)}
					dialogButton={
						<InsertButton id="invoiceRegist_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />
					}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>{this.renderPage()}</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
							닫기
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
