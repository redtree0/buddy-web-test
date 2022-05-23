import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import MenuItem from '@material-ui/core/MenuItem'
import axios from '../../wrapper/axios'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import BankSetDialog from './bankSetDialog'
import moment from 'moment'
import MobileDetect from 'mobile-detect'
import { getList } from './libs/utils'

const md = new MobileDetect(window.navigator.userAgent)

const style = {
	title: {
		display: 'block',
		textAlign: 'left',
		margin: '10px',
		fontSize: '18px',
		fontWeight: '500'
	},
	li: {
		display: 'block',
		marginTop: '6px',
		marginBottom: '6px'
	},
	summaryText: {
		display: 'block',
		textAlign: 'left',
		marginTop: '8px',
		fontSize: '16px',
		fontWeight: '500'
	},
	summaryTextSub: {
		display: 'block',
		textAlign: 'left',
		marginTop: '4px',
		fontSize: '12px',
		fontWeight: '500'
	}
}
class Settlement extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			incomeData: {},
			incomeDetail: [],
			periodList: [],
			startDate: '',
			isLoading: true
		}
	}

	componentDidMount() {
		this.getPeriodList()
	}

	getPeriodList = async () => {
		this.setState({ isLoading: true })
		await axios
			.get('/income/period/list', {
				params: {
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq
				}
			})
			.then((res) => {
				if (res.data && res.data.period) {
					this.setState({
						startDate: res.data && res.data.period ? res.data.period[0]['startDate'] : '',
						periodList: res.data.period.map((el) => ({
							value: el.startDate,
							label: moment(el.startDate).format('YYYY/M/D') + ' ~ ' + moment(el.endDate).format('D')
						}))
					})
					this.loadValue()
				} else {
					this.setState({ isLoading: false })
				}
			})
			.catch((error) => console.error(error))
	}

	loadValue = async () => {
		this.setState({ isLoading: true })
		await axios
			.get('/income/period/detail', {
				params: {
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
					startDate: this.state.startDate
				}
			})
			.then((res) => {
				this.setState({
					isLoading: false,
					incomeData: (res.data && res.data.income) || {},
					incomeDetail: (res.data && res.data.incomeDetail) || []
				})
			})
			.catch((error) => console.error(error))
	}

	closeEvent = (data) => {
		if (!data) return
		else if (data === 'bankCodeChk') {
			this.alertMessage('회원을 선택해주세요.', '회원을 선택해주세요.', 'danger')
		} else if (data === 'depositorChk') {
			this.alertMessage('회원 이름을 입력해주세요.', '회원 이름을 입력해주세요.', 'danger')
		} else if (data === 'accountNumChk') {
			this.alertMessage('상품을 선택해주세요.', '상품을 선택해주세요.', 'danger')
		} else if (data === 'success') {
			this.alertMessage('알림', '저장되었습니다.', 'success')
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

	handleChange = (prop) => (event) => {
		this.setState({ [prop]: event.target.value })
	}

	//계좌 설정
	bankSet() {
		document.getElementById('bankSetDialog_btn').click()
	}

	render() {
		const data = this.state.incomeData || {}
		return (
			<div style={{ padding: md.mobile() ? '2%' : '5%', minWidth: md.mobile() ? '100%' : '400px', maxWidth: '1280px' }}>
				<ReactNotifications />
				<div
					className={'row'}
					style={{
						margin: md.mobile() ? '0' : null,
						width: '100%',
						minHeight: '160px',
						verticalAlign: 'middle',
						background: 'white',
						border: 'solid 2px #dddddd',
						borderRadius: '12px',
						padding: '20px 20px'
					}}
				>
					<div className={'col-md-9'}>
						<h4>{'정산 안내'}</h4>
						<span>
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>
								{'해당 기간의 수익은 계산서 발행분에 한해 정산일로부터 영업일 기준 5일 뒤에 설정하신 계좌로 지급드립니다.'}
							</p>
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>
								{'자동정산 후 '}
								<a href="https://www.barobill.co.kr/" target="_blank">
									바로빌
								</a>
								{'을 통해 세금계산서를 역발행 드리며, 승인요청 메일이 전송됩니다. '}
							</p>
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>
								{'승인완료된 계산서 기준으로 지급되오니, 발행된 계산서를 확인하시고 꼭 승인처리 해주세요.'}
							</p>
							{/* <p style={{ margin: '0 0 4px', fontSize: '12px' }}>{'※ 간이과세자 사업자의 경우, 계산서 대신 현금영수증을 직접 발행해주시면 됩니다.'}</p> */}
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>{'※ 서비스, 현장결제 금액은 정산에 포함되지 않습니다.'}</p>
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>
								{'※ 정산내역은 합계금액일 뿐이므로 상세한 내용은 매출 메뉴를 참고 바랍니다.'}
							</p>
						</span>
					</div>
					{/* <div className={'col-md-3'}>
						<Button
							variant="outlined"
							color="default"
							style={{ width: '110px', height: '40px', marginTop: '20px', marginBottom: '20px' }}
							onClick={() => this.bankSet()}
						>
							계좌설정
						</Button>
					</div> */}
				</div>

				{!this.state.periodList || !this.state.periodList.length ? (
					<div style={{ marginTop: '40px' }}>아직 정산할 내역이 없습니다.</div>
				) : (
					<div
						className={'row'}
						style={{
							margin: md.mobile() ? '0' : null,
							background: 'white',
							border: 'solid 2px #dddddd',
							width: '100%',
							padding: '20px',
							marginTop: '20px',
							borderRadius: '12px'
						}}
					>
						<div className={'col-md-12'} style={{ padding: '0px' }}>
							<span style={style.title}>
								<p>{this.state.period || '' + ' 정산내역'}</p>
							</span>
							<div style={{ float: 'right', marginBottom: '8px' }}>
								<TextField
									select
									className={classNames('')}
									value={this.state.startDate}
									onChange={this.handleChange('startDate')}
								>
									{this.state.periodList.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</TextField>
								<Button variant="outlined" color="default" style={{ marginLeft: '8px' }} onClick={() => this.loadValue()}>
									조회
								</Button>
							</div>
						</div>
						<div
							className={'col-md-6'}
							style={{ display: 'inline-block', width: md.mobile() ? '100%' : null, padding: md.mobile() ? '0' : null }}
						>
							<div className={'col-md-12'} style={{ whith: '100%' }}>
								{this.state.incomeDetail.map((el) => {
									return el.totalPrice ? (
										<span style={style.li}>
											<p
												style={{
													display: 'inline-block',
													wordBreak: 'keep-all',
													width: md.mobile() ? '190px' : null
												}}
											>
												{el.type == 'refund' ? '(환불) ' : el.type == 'cancel' ? '(취소) ' : ''}
												{el.productName}
												{'   :: ' + el.count + '건'}
												{el.productName == '실시간이용권' ? '' : ' X ' + el.unitPrice.toLocaleString() + '원'}
											</p>
											<p
												style={{
													float: 'right',
													display: 'inline-block',
													width: md.mobile() ? '100px' : null,
													position: md.mobile() ? 'absolute' : null,
													textAlign: md.mobile() ? 'right' : null
												}}
											>
												{el.totalPrice.toLocaleString() + '원'}
											</p>
										</span>
									) : (
										''
									)
								})}
								{/* <span style={style.li}>
								<p style={{ display: 'inline-block' }}>{'2시간권 구매 148건 X 3,000원'}</p>
								<p style={{ float: 'right', display: 'inline-block' }}>{'12312312'}</p>
							</span>
							<span style={style.li}>
								<p style={{ display: 'inline-block' }}>{'스터디룸A(4인실) 88시간 X 6,000원'}</p>
								<p style={{ float: 'right', display: 'inline-block' }}>{'12312312'}</p>
							</span> */}

								<div style={{ height: '1px', background: 'black', marginBottom: '10px' }}></div>

								<span style={style.li}>
									<p style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}>{'수익'}</p>
									<p
										style={{
											float: 'right',
											display: 'inline-block',
											width: md.mobile() ? '100px' : null,
											position: md.mobile() ? 'absolute' : null,
											textAlign: md.mobile() ? 'right' : null
										}}
									>
										{data.incomeTotal ? data.incomeTotal.toLocaleString() + '원' : '-'}
									</p>
								</span>
								<hr />
								{data.feePaymentRate && (
									<span style={style.li}>
										<p
											style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}
										>{`PG사 결제수수료 ${data.feePaymentRate}%`}</p>
										<p
											style={{
												float: 'right',
												display: 'inline-block',
												width: md.mobile() ? '100px' : null,
												position: md.mobile() ? 'absolute' : null,
												textAlign: md.mobile() ? 'right' : null
											}}
										>
											{data.feePayment ? data.feePayment.toLocaleString() + '원' : '-'}
										</p>
									</span>
								)}

								<span style={style.li}>
									<p style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}>{`스터디모아 이용수수료 ${
										data.feeSalesRate && data.feeSalesRate > 0 ? data.feeSalesRate + '%' : ''
									}`}</p>
									<p
										style={{
											float: 'right',
											display: 'inline-block',
											width: md.mobile() ? '100px' : null,
											position: md.mobile() ? 'absolute' : null,
											textAlign: md.mobile() ? 'right' : null
										}}
									>
										{data.feeSales ? data.feeSales.toLocaleString() + '원' : '0원 (면제)'}
									</p>
								</span>

								{data.costMsgPerUnit && (
									<span style={style.li}>
										<p
											style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}
										>{`알림톡 수수료 ${data.countMsg}건 x ${data.costMsgPerUnit}원/건`}</p>
										<p
											style={{
												float: 'right',
												display: 'inline-block',
												width: md.mobile() ? '100px' : null,
												position: md.mobile() ? 'absolute' : null,
												textAlign: md.mobile() ? 'right' : null
											}}
										>
											{data.costMsg ? data.costMsg.toLocaleString() + '원' : '-'}
										</p>
									</span>
								)}
								<div style={{ height: '1px', background: 'black', marginBottom: '10px' }}></div>
								<span style={style.li}>
									<p style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}>{'비용'}</p>
									<p
										style={{
											float: 'right',
											display: 'inline-block',
											width: md.mobile() ? '100px' : null,
											position: md.mobile() ? 'absolute' : null,
											textAlign: md.mobile() ? 'right' : null
										}}
									>
										{data.costAmount ? data.costAmount.toLocaleString() + '원' : '-'}
									</p>
								</span>
								<hr />
							</div>
						</div>
						<div className={'col-md-6'}>
							<div className={'col-md-12'} style={{ display: 'inline-block', width: '100%', background: '#f6f6f6' }}>
								<span style={style.summaryText}>
									<p style={{ display: 'inline-block' }}>{'수익'}</p>
									<p style={{ ...style.summaryTextSub, display: 'inline-block' }}>{' (VAT 포함)'}</p>
									<p style={{ float: 'right', display: 'inline-block' }}>
										+ {data.incomeTotal ? data.incomeTotal.toLocaleString() + '원' : '없음'}
									</p>
								</span>
								{data.place && data.place.taxPayer == '2' && (
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'간이과세자 세액 공제'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											- {data.incomeVat ? <s>{data.incomeVat.toLocaleString()}원</s> : '없음'}
										</p>
									</span>
								)}
								<span style={style.summaryText}>
									<p style={{ display: 'inline-block' }}>{'비용'}</p>
									<p style={{ float: 'right', display: 'inline-block' }}>
										- {data.costAmount ? data.costAmount.toLocaleString() + '원' : '없음'}
									</p>
								</span>
								<span style={style.summaryTextSub}>
									<p style={{ display: 'inline-block' }}>{'비용 VAT'}</p>
									<p style={{ float: 'right', display: 'inline-block' }}>
										- {data.costVat ? data.costVat.toLocaleString() + '원' : '없음'}
									</p>
								</span>

								<div style={{ height: '1px', background: 'black', marginBottom: '10px' }}></div>

								<span style={style.summaryText}>
									<p style={{ display: 'inline-block' }}>{'정산이체금액'}</p>
									<p style={{ float: 'right', display: 'inline-block' }}>
										{data.transferAmount ? data.transferAmount.toLocaleString() + '원' : '-'}
									</p>
								</span>
							</div>

							<span
								style={{
									display: 'inline-block',
									width: '100%',
									textAlign: 'center',
									marginTop: '6px',
									marginBottom: '10px',
									fontSize: '16px',
									fontWeight: '600'
								}}
							>
								<p style={{ display: 'inline-block', color: '#154ee9', textDecoration: 'underline' }}>
									{data.transferDate ? moment(data.transferDate).format('YYYY년 M월 D일') : ''}
									{data.transferStatus == 'paid'
										? '지급완료'
										: data.transferStatus == 'ready'
										? '지급 대기중'
										: data.transferStatus == 'billed'
										? '세금계산서 승인 전'
										: data.transferStatus == 'wait'
										? data.place.taxPayer == '2'
											? '현금영수증 발급 대기중'
											: '세금계산서 발급 대기중'
										: data.transferStatus == 'deny'
										? '지급이 거절되었습니다. 관리자에게 문의주시기 바랍니다.'
										: '미정산'}
								</p>
							</span>

							{data.transferStatus == 'wait' && data.place.taxPayer == '2' && (
								<div className={'col-md-12'} style={{ display: 'inline-block', width: '100%', background: '#f6f6f6' }}>
									<span style={style.summaryText}>
										<p style={{ display: 'inline-block' }}>현금영수증 발행금액</p>
									</span>
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'총 거래금액'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											{data.incomeTotal ? data.incomeTotal.toLocaleString() + '원' : '-'}
										</p>
									</span>
								</div>
							)}
							{data.transferStatus == 'wait' && data.place.taxPayer != '2' && (
								<div className={'col-md-12'} style={{ display: 'inline-block', width: '100%', background: '#f6f6f6' }}>
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'합계금액'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											{data.incomeTotal ? data.incomeTotal.toLocaleString() + '원' : '-'}
										</p>
									</span>
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'공급가액'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											{data.incomeTotal && data.incomeVat
												? (data.incomeTotal - data.incomeVat).toLocaleString() + '원'
												: '-'}
										</p>
									</span>
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'부가세'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											{data.incomeVat ? data.incomeVat.toLocaleString() + '원' : '-'}
										</p>
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				<div className="hidden_">
					<BankSetDialog onClose={this.closeEvent} />
				</div>
			</div>
		)
	}
}

export default Settlement
