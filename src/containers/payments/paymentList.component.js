import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import DetailDialog from './detailDialog'
import MobileDetect from 'mobile-detect'
import scss from '../sales/sales.module.scss'

const md = new MobileDetect(window.navigator.userAgent)

class PaymentList extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			paymentList: [],
			firstDate: moment().date(1).format('YYYY-MM-DD'),
			lastDate: moment().add(1, 'months').date(0).format('YYYY-MM-DD'),
			detailData: null,
			activePage: 1,
			listTotal: 0,
			sizePerPage: 10,
			searchValue: '',
			searchData: '',
			defaultOrder: 'seq',
			order: 'desc'
		}
	}

	componentDidMount() {
		this.loadData()
	}

	loadData = async (searchValue) => {
		if (this.state.firstDate === '' || this.state.firstDate === null || this.state.lastDate === '' || this.state.lastDate === null) {
			this.alertMessage('경고', '날짜를 선택해주세요.', 'danger')
			return
		}
		searchValue ? await this.setState({ activePage: 1 }) : null
		await axios
			.get('/payment/list', {
				params: {
					from: this.state.firstDate,
					to: this.state.lastDate,
					page: this.state.activePage,
					perPage: this.state.sizePerPage,
					search: this.state.searchData ? this.state.searchData : null,
					orderBy: this.state.defaultOrder,
					align: this.state.order
				}
			})
			.then((res) => {
				const paymentList =
					res.data.list &&
					res.data.list.map((el) => ({
						...el,
						userName: el.user ? el.user.name || '이름없음' : '',
						userPhone: el.user ? el.user.phone : ''
					}))
				this.setState({ paymentList, listTotal: res.data.total })
			})
			.catch((error) => console.error(error))
	}

	changeSizePerPage = (n) => {
		// props.changeSizePerPage(n);
		this.setState({ activePage: 1, sizePerPage: n })
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber })
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	//Table 상세버튼
	cellButton(cell, row, enumObject, rowIndex) {
		return (
			<div>
				<Button variant="outlined" color="default" className={''} onClick={() => this.onDetail(cell, row, rowIndex)}>
					상세
				</Button>
				{row.receipt_url && (
					<Button
						variant="outlined"
						color="default"
						className={''}
						onClick={() => window.open(row.receipt_url, '_blank')}
						style={{ marginLeft: '6px' }}
					>
						영수증
					</Button>
				)}
			</div>
		)
	}
	//상세 버튼 Click Event
	onDetail(cell, row, rowIndex) {
		this.setState({ detailData: row })
		document.getElementById('detailDialog_btn').click()
	}

	//금액 Format
	payFormat = (cell, row) => {
		let str = ''
		if (cell && cell.toString().indexOf('-') !== -1) {
			str = <p style={{ color: 'red' }}>{cell ? cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'}</p>
		} else {
			str = <p style={{ color: 'black' }}>{cell ? cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'}</p>
		}
		return str
	}

	onKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopPropagation()
			this.onSearch()
		}
	}

	onSearch = async () => {
		await this.setState({ searchData: this.state.searchValue })
		await this.loadData(this.state.searchValue ? this.state.searchValue : 'clear')
	}

	dataSort = async (dataField) => {
		if (this.state.defaultOrder !== dataField) {
			await this.setState({ defaultOrder: dataField, order: 'desc' })
		} else {
			this.setState({ defaultOrder: dataField })
			if (this.state.order === 'desc') {
				await this.setState({ order: 'asc' })
			} else {
				await this.setState({ order: 'desc' })
			}
		}

		this.loadData()
	}

	orderCheck = (value) => {
		if (value === this.state.defaultOrder) {
			return (
				<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
					{value === 'seq'
						? 'Seq'
						: value === 'userName'
						? '이름'
						: value === 'userPhone'
						? '전화번호'
						: value === 'status'
						? '상태'
						: value === 'pay_method'
						? '결제수단'
						: value === 'pg_provider'
						? '결제종류'
						: value === 'pay_service'
						? 'PG사'
						: value}
					<span className={classNames('order', this.state.order === 'asc' ? 'dropup' : '')}>
						<span className="caret" style={{ margin: '10px 5px' }}></span>
					</span>
				</div>
			)
		} else {
			return (
				<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
					{value === 'seq'
						? 'Seq'
						: value === 'userName'
						? '이름'
						: value === 'userPhone'
						? '전화번호'
						: value === 'status'
						? '상태'
						: value === 'pay_method'
						? '결제수단'
						: value === 'pg_provider'
						? '결제종류'
						: value === 'pay_service'
						? 'PG사'
						: value}
					<span className="order">
						<span className="dropdown">
							<span className="caret" style={{ margin: '10px 0px 10px 5px', color: 'rgb(204, 204, 204)' }}></span>
						</span>
						<span className="dropup">
							<span className="caret" style={{ margin: '10px 0px', color: 'rgb(204, 204, 204)' }}></span>
						</span>
					</span>
				</div>
			)
		}
	}

	render() {
		const paymentList = this.state.paymentList
		const options = {
			defaultSortName: 'seq', // default sort column name
			// defaultSortOrder: 'desc', // default sort order
			// clearSearch: true,
			// clearSearchBtn: this.createCustomClearButton,
			// searchField: this.createCustomSearchField,
			// sizePerPageDropDown: this.renderSizePerPageDropDown,
			noDataText: '데이터 없음'
		}
		return (
			<div
				style={{
					padding: '20px',
					minWidth: md.mobile() ? '100%' : null,
					maxWidth: md.mobile() ? '600px' : '1400px',
					marginLeft: 'auto',
					marginRight: 'auto'
				}}
			>
				<ReactNotifications />

				<div className={classNames('row', scss.btn_layout)}>
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 sales_datesediv" style={{ padding: md.mobile() ? '0' : null }}>
						<TextField
							id="date"
							type="date"
							style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
							className={'sales_dateselect'}
							InputLabelProps={{
								shrink: false
							}}
							value={this.state.firstDate}
							onChange={this.handleChange('firstDate')}
						/>

						<span
							style={{
								width: md.mobile() ? '20px' : '30px',
								display: 'inline-block',
								textAlign: 'center',
								fontSize: md.mobile() ? '20px' : '30px',
								fontWeight: '400'
							}}
						>
							~
						</span>

						<TextField
							id="date"
							type="date"
							style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
							className={'sales_dateselect'}
							InputLabelProps={{
								shrink: true
							}}
							value={this.state.lastDate}
							onChange={this.handleChange('lastDate')}
						/>

						<Button
							variant="outlined"
							color="default"
							className={classNames('sales_datebtn', scss.searchBtn)}
							onClick={() => this.loadData()}
						>
							조회
						</Button>
					</div>
				</div>
				<div>
					<div className="row">
						<div className="col-xs-0 col-sm-6 col-md-6 col-lg-9">
							<div className="btn-group btn-group-sm" role="group">
								<div>
									<div></div>
								</div>
							</div>
						</div>
						<div className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
							<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
								<input
									className="form-control "
									type="text"
									placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, '}
									value={this.state.searchValue}
									onChange={this.handleChange('searchValue')}
									onKeyDown={(event) => this.onKeyDown(event)}
									style={{ zIndex: '0' }}
								></input>
								<span className="input-group-btn">
									<button className="btn btn-default" onClick={this.onSearch.bind(this)}>
										검색
									</button>
								</span>
							</div>
						</div>
					</div>
					<BootstrapTable
						data={paymentList}
						options={options}
						// search
						// keyBoardNav
						// pagination
						hover
						className={'study_place_bs'}
						condensed={true}
					>
						<TableHeaderColumn dataField="seq" isKey={true} width="50px" dataAlign="center">
							{this.orderCheck('seq')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="userName" width="70px" dataAlign="center">
							{this.orderCheck('userName')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="userPhone"
							width="90px"
							dataAlign="center"
							dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
						>
							{this.orderCheck('userPhone')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="status"
							width="80px"
							dataFormat={(c) =>
								c === 'ready'
									? '대기중'
									: c === 'paid'
									? '결제완료'
									: c === 'cancelled'
									? '환불'
									: c === 'failed'
									? '실패'
									: c
							}
							dataAlign="center"
						>
							{this.orderCheck('status')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="pay_service" width="70px" dataAlign="center">
							{this.orderCheck('pay_service')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="pg_provider"
							dataFormat={(c) => (c != 'kakaopay' ? '일반결제' : '카카오페이')}
							width="70px"
							dataAlign="center"
						>
							{this.orderCheck('pg_provider')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="pay_method"
							width="80px"
							dataFormat={(c) =>
								c === 'card'
									? '카드'
									: c === 'vbank'
									? '가상계좌'
									: c === 'point'
									? '카카오머니'
									: c === 'trans'
									? '이체'
									: c === 'phone'
									? '휴대폰'
									: c === 'ssgpay'
									? 'SSG페이'
									: c === 'cardNum'
									? '비인증'
									: c
							}
							dataAlign="center"
						>
							{this.orderCheck('pay_method')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="payAmount" width="80px" dataFormat={this.payFormat} dataAlign="center">
							결제금액
						</TableHeaderColumn>
						<TableHeaderColumn dataField="cashAmount" width="80px" dataFormat={this.payFormat} dataAlign="center">
							캐시금액
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="card_name"
							width="90px"
							dataFormat={(c, r) => r.card_name || r.vbank_name || r.bank_name}
							dataAlign="center"
						>
							카드/은행
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="paid_at"
							width="90px"
							dataFormat={(c) => c && moment(c).format('M/D HH:mm:ss')}
							dataAlign="center"
						>
							완료일시
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="wdate"
							width="110px"
							dataFormat={(c) => moment(c).format('YY/M/D HH:mm:ss')}
							dataAlign="center"
						>
							결제시작일시
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="button"
							width="140px"
							dataAlign="left"
							dataFormat={this.cellButton.bind(this)}
						></TableHeaderColumn>
					</BootstrapTable>
					<div className="btn-group" style={{ width: '100%' }}>
						{[10, 25, 50].map((n, idx) => {
							const isActive = n === this.state.sizePerPage ? 'active' : null
							return (
								<button
									key={idx}
									type="button"
									style={{ margin: md.mobile() ? '20px 0 0' : '20px 0' }}
									className={`btn ${isActive}`}
									onClick={() => this.changeSizePerPage(n)}
								>
									{n}
								</button>
							)
						})}
						<div style={{ float: 'right', width: md.mobile() ? '100%' : null, textAlign: md.mobile() ? 'right' : null }}>
							<Pagination
								activePage={this.state.activePage}
								itemsCountPerPage={this.state.sizePerPage}
								totalItemsCount={this.state.listTotal}
								pageRangeDisplayed={5}
								onChange={(event) => this.handlePageChange(event)}
							/>
						</div>
					</div>
				</div>
				<div className="hidden_">
					<DetailDialog detailData={this.state.detailData} />
				</div>
			</div>
		)
	}
}

export default PaymentList
