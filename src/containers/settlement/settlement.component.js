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
			this.alertMessage('????????? ??????????????????.', '????????? ??????????????????.', 'danger')
		} else if (data === 'depositorChk') {
			this.alertMessage('?????? ????????? ??????????????????.', '?????? ????????? ??????????????????.', 'danger')
		} else if (data === 'accountNumChk') {
			this.alertMessage('????????? ??????????????????.', '????????? ??????????????????.', 'danger')
		} else if (data === 'success') {
			this.alertMessage('??????', '?????????????????????.', 'success')
		}
	}

	//Message ??????
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

	//?????? ??????
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
						<h4>{'?????? ??????'}</h4>
						<span>
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>
								{'?????? ????????? ????????? ????????? ???????????? ?????? ?????????????????? ????????? ?????? 5??? ?????? ???????????? ????????? ??????????????????.'}
							</p>
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>
								{'???????????? ??? '}
								<a href="https://www.barobill.co.kr/" target="_blank">
									?????????
								</a>
								{'??? ?????? ?????????????????? ????????? ?????????, ???????????? ????????? ???????????????. '}
							</p>
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>
								{'??????????????? ????????? ???????????? ???????????????, ????????? ???????????? ??????????????? ??? ???????????? ????????????.'}
							</p>
							{/* <p style={{ margin: '0 0 4px', fontSize: '12px' }}>{'??? ??????????????? ???????????? ??????, ????????? ?????? ?????????????????? ?????? ?????????????????? ?????????.'}</p> */}
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>{'??? ?????????, ???????????? ????????? ????????? ???????????? ????????????.'}</p>
							<p style={{ margin: '0 0 4px', fontSize: '12px' }}>
								{'??? ??????????????? ??????????????? ???????????? ????????? ????????? ?????? ????????? ?????? ????????????.'}
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
							????????????
						</Button>
					</div> */}
				</div>

				{!this.state.periodList || !this.state.periodList.length ? (
					<div style={{ marginTop: '40px' }}>?????? ????????? ????????? ????????????.</div>
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
								<p>{this.state.period || '' + ' ????????????'}</p>
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
									??????
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
												{el.type == 'refund' ? '(??????) ' : el.type == 'cancel' ? '(??????) ' : ''}
												{el.productName}
												{'   :: ' + el.count + '???'}
												{el.productName == '??????????????????' ? '' : ' X ' + el.unitPrice.toLocaleString() + '???'}
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
												{el.totalPrice.toLocaleString() + '???'}
											</p>
										</span>
									) : (
										''
									)
								})}
								{/* <span style={style.li}>
								<p style={{ display: 'inline-block' }}>{'2????????? ?????? 148??? X 3,000???'}</p>
								<p style={{ float: 'right', display: 'inline-block' }}>{'12312312'}</p>
							</span>
							<span style={style.li}>
								<p style={{ display: 'inline-block' }}>{'????????????A(4??????) 88?????? X 6,000???'}</p>
								<p style={{ float: 'right', display: 'inline-block' }}>{'12312312'}</p>
							</span> */}

								<div style={{ height: '1px', background: 'black', marginBottom: '10px' }}></div>

								<span style={style.li}>
									<p style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}>{'??????'}</p>
									<p
										style={{
											float: 'right',
											display: 'inline-block',
											width: md.mobile() ? '100px' : null,
											position: md.mobile() ? 'absolute' : null,
											textAlign: md.mobile() ? 'right' : null
										}}
									>
										{data.incomeTotal ? data.incomeTotal.toLocaleString() + '???' : '-'}
									</p>
								</span>
								<hr />
								{data.feePaymentRate && (
									<span style={style.li}>
										<p
											style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}
										>{`PG??? ??????????????? ${data.feePaymentRate}%`}</p>
										<p
											style={{
												float: 'right',
												display: 'inline-block',
												width: md.mobile() ? '100px' : null,
												position: md.mobile() ? 'absolute' : null,
												textAlign: md.mobile() ? 'right' : null
											}}
										>
											{data.feePayment ? data.feePayment.toLocaleString() + '???' : '-'}
										</p>
									</span>
								)}

								<span style={style.li}>
									<p style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}>{`??????????????? ??????????????? ${
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
										{data.feeSales ? data.feeSales.toLocaleString() + '???' : '0??? (??????)'}
									</p>
								</span>

								{data.costMsgPerUnit && (
									<span style={style.li}>
										<p
											style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}
										>{`????????? ????????? ${data.countMsg}??? x ${data.costMsgPerUnit}???/???`}</p>
										<p
											style={{
												float: 'right',
												display: 'inline-block',
												width: md.mobile() ? '100px' : null,
												position: md.mobile() ? 'absolute' : null,
												textAlign: md.mobile() ? 'right' : null
											}}
										>
											{data.costMsg ? data.costMsg.toLocaleString() + '???' : '-'}
										</p>
									</span>
								)}
								<div style={{ height: '1px', background: 'black', marginBottom: '10px' }}></div>
								<span style={style.li}>
									<p style={{ display: 'inline-block', width: md.mobile() ? '190px' : null }}>{'??????'}</p>
									<p
										style={{
											float: 'right',
											display: 'inline-block',
											width: md.mobile() ? '100px' : null,
											position: md.mobile() ? 'absolute' : null,
											textAlign: md.mobile() ? 'right' : null
										}}
									>
										{data.costAmount ? data.costAmount.toLocaleString() + '???' : '-'}
									</p>
								</span>
								<hr />
							</div>
						</div>
						<div className={'col-md-6'}>
							<div className={'col-md-12'} style={{ display: 'inline-block', width: '100%', background: '#f6f6f6' }}>
								<span style={style.summaryText}>
									<p style={{ display: 'inline-block' }}>{'??????'}</p>
									<p style={{ ...style.summaryTextSub, display: 'inline-block' }}>{' (VAT ??????)'}</p>
									<p style={{ float: 'right', display: 'inline-block' }}>
										+ {data.incomeTotal ? data.incomeTotal.toLocaleString() + '???' : '??????'}
									</p>
								</span>
								{data.place && data.place.taxPayer == '2' && (
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'??????????????? ?????? ??????'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											- {data.incomeVat ? <s>{data.incomeVat.toLocaleString()}???</s> : '??????'}
										</p>
									</span>
								)}
								<span style={style.summaryText}>
									<p style={{ display: 'inline-block' }}>{'??????'}</p>
									<p style={{ float: 'right', display: 'inline-block' }}>
										- {data.costAmount ? data.costAmount.toLocaleString() + '???' : '??????'}
									</p>
								</span>
								<span style={style.summaryTextSub}>
									<p style={{ display: 'inline-block' }}>{'?????? VAT'}</p>
									<p style={{ float: 'right', display: 'inline-block' }}>
										- {data.costVat ? data.costVat.toLocaleString() + '???' : '??????'}
									</p>
								</span>

								<div style={{ height: '1px', background: 'black', marginBottom: '10px' }}></div>

								<span style={style.summaryText}>
									<p style={{ display: 'inline-block' }}>{'??????????????????'}</p>
									<p style={{ float: 'right', display: 'inline-block' }}>
										{data.transferAmount ? data.transferAmount.toLocaleString() + '???' : '-'}
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
									{data.transferDate ? moment(data.transferDate).format('YYYY??? M??? D???') : ''}
									{data.transferStatus == 'paid'
										? '????????????'
										: data.transferStatus == 'ready'
										? '?????? ?????????'
										: data.transferStatus == 'billed'
										? '??????????????? ?????? ???'
										: data.transferStatus == 'wait'
										? data.place.taxPayer == '2'
											? '??????????????? ?????? ?????????'
											: '??????????????? ?????? ?????????'
										: data.transferStatus == 'deny'
										? '????????? ?????????????????????. ??????????????? ??????????????? ????????????.'
										: '?????????'}
								</p>
							</span>

							{data.transferStatus == 'wait' && data.place.taxPayer == '2' && (
								<div className={'col-md-12'} style={{ display: 'inline-block', width: '100%', background: '#f6f6f6' }}>
									<span style={style.summaryText}>
										<p style={{ display: 'inline-block' }}>??????????????? ????????????</p>
									</span>
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'??? ????????????'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											{data.incomeTotal ? data.incomeTotal.toLocaleString() + '???' : '-'}
										</p>
									</span>
								</div>
							)}
							{data.transferStatus == 'wait' && data.place.taxPayer != '2' && (
								<div className={'col-md-12'} style={{ display: 'inline-block', width: '100%', background: '#f6f6f6' }}>
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'????????????'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											{data.incomeTotal ? data.incomeTotal.toLocaleString() + '???' : '-'}
										</p>
									</span>
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'????????????'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											{data.incomeTotal && data.incomeVat
												? (data.incomeTotal - data.incomeVat).toLocaleString() + '???'
												: '-'}
										</p>
									</span>
									<span style={style.summaryTextSub}>
										<p style={{ display: 'inline-block' }}>{'?????????'}</p>
										<p style={{ float: 'right', display: 'inline-block' }}>
											{data.incomeVat ? data.incomeVat.toLocaleString() + '???' : '-'}
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
