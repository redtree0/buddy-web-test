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
import AddDialog from './addDialog'
import RefundDialog from './refundDialog'
import DetailDialog from './detailDialog'
import MobileDetect from 'mobile-detect'
import scss from './sales.module.scss'

const md = new MobileDetect(window.navigator.userAgent)

class Sales extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			salesData: [],
			products: [],
			firstDate: moment().date(1).format('YYYY-MM-DD'),
			lastDate: moment().add('months', 1).date(0).format('YYYY-MM-DD'),
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

	async componentDidMount() {
		await this.loadProducts()
		await this.loadData()
	}

	loadProducts = async () => {
		await axios
			.get('/product/' + JSON.parse(localStorage.getItem('manager_place')).seq)
			.then((res) => {
				this.setState({ products: res.data })
			})
			.catch((error) => console.error(error))
	}

	loadData = async (searchValue) => {
		if (this.state.firstDate === '' || this.state.firstDate === null || this.state.lastDate === '' || this.state.lastDate === null) {
			this.alertMessage('경고', '날짜를 선택해주세요.', 'danger')
			return
		}
		searchValue ? await this.setState({ activePage: 1 }) : null
		await axios
			.get('/sales/' + JSON.parse(localStorage.getItem('manager_place')).seq, {
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
				let data = res.data.list
				let _salesData = []
				for (let i = 0; i < data.length; i++) {
					let push_data = {
						...data[i],
						member: data[i].member ? data[i].member : '',
						memberName: data[i].member ? data[i].member.name || '이름없음' : '',
						memberPhone: data[i].member ? data[i].member.phone : '',
						productName: data[i].product
							? data[i].product['name']
							: data[i].roomUsageSeq
							? '스터디룸'
							: data[i].lockerUsageSeq
							? '락커'
							: data[i].deskUsage
							? data[i].deskUsage.timeType == 'real'
								? '실시간'
								: data[i].deskUsage.timeType == 'day'
								? '지정석'
								: data[i].deskUsage.timeType == 'time'
								? '1회권'
								: data[i].deskUsage.timeType == 'free'
								? '자유석'
								: data[i].deskUsage.timeType == 'char'
								? '충전권'
								: '직접설정'
							: '',
						saleDT: moment(data[i].saleDT).format('M/D HH:mm'),
						wdate: moment(data[i].wdate).format('M/D HH:mm')
					}
					_salesData.push(push_data)
				}
				this.setState({ salesData: _salesData, listTotal: res.data.total })
			})
			.catch((error) => console.error(error))
	}

	xslDownload = async () => {
		if (this.state.firstDate === '' || this.state.firstDate === null || this.state.lastDate === '' || this.state.lastDate === null) {
			this.alertMessage('경고', '날짜를 선택해주세요.', 'danger')
			return
		}

		const FILEPATH =
			'/sales/' +
			JSON.parse(localStorage.getItem('manager_place')).seq +
			'/xls?from=' +
			this.state.firstDate +
			'&to=' +
			this.state.lastDate

		await axios
			.get(FILEPATH, { responseType: 'blob' })
			.then((res) => {
				const url = window.URL.createObjectURL(new Blob([res.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', '매출내역_' + moment(new Date()).format('YYYYMMDD') + '.xlsx')
				document.body.appendChild(link)
				link.click()
				link.remove()
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

	closeEvent = (data) => {
		if (!data) return
		else if (data === 'memberSelectChk') {
			this.alertMessage('경고', '회원을 선택해주세요.', 'danger')
		} else if (data === 'memberNmChk') {
			this.alertMessage('경고', '회원 이름을 입력해주세요.', 'danger')
		} else if (data === 'salesHistoryChk') {
			this.alertMessage('경고', '이용내역을 선택해주세요.', 'danger')
		} else if (data === 'refundReasonChk') {
			this.alertMessage('경고', '환불사유를 선택해주세요.', 'danger')
		} else if (data === 'amountChk') {
			this.alertMessage('경고', '금액을 입력해주세요.', 'danger')
		} else if (data === 'saleDTChk') {
			this.alertMessage('경고', '날짜를 입력해주세요.', 'danger')
		} else if (data === 'success') {
			this.alertMessage('알림', '등록 되었습니다', 'success')
			this.loadData()
		} else if (data === 'refund') {
			this.alertMessage('알림', '환불 되었습니다', 'success')
			this.loadData()
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

	//상품선택 => 시간 지정
	updateFirstDate = (e) => {
		this.setState({ firstDate: e.target.value })
	}
	updateLastDate = (e) => {
		this.setState({ lastDate: e.target.value })
	}

	//Table 상세버튼
	cellButton(cell, row, enumObject, rowIndex) {
		return (
			<div>
				<Button variant="outlined" color="default" className={''} onClick={() => this.onDetail(cell, row, rowIndex)}>
					{row.refSalesHistorySeq ? '상세' : '상세 / 환불'}
				</Button>
			</div>
		)
	}
	//상세 버튼 Click Event
	onDetail(cell, row, rowIndex) {
		this.setState({ detailData: row })
		document.getElementById('detailDialog_btn').click()
	}

	//구분 Format
	typeFormat = (cell, row) => {
		let rm = cell === 'buy' ? '구매' : cell === 'refund' ? '환불' : cell === 'book' ? '예약' : cell === 'cancel' ? '취소' : ''
		return rm
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

	//결제수단 Format
	payMethodFormat = (cell, row) => {
		let rm =
			cell === 'app'
				? '앱-캐시'
				: cell === 'admin'
				? '관리자-캐시'
				: cell === 'service'
				? '서비스'
				: cell === 'cash'
				? '현장결제(현금)'
				: cell === 'card'
				? '현장결제(카드)'
				: ''
		return rm
	}

	// //페이지당 Row 갯수 설정
	// renderSizePerPageDropDown = props => {
	// 	return (
	// 		<div className="btn-group">
	// 			{[10, 25, 50].map((n, idx) => {
	// 				const isActive = n === props.currSizePerPage ? 'active' : null
	// 				return (
	// 					<button key={idx} type="button" className={`btn ${isActive}`} onClick={() => props.changeSizePerPage(n)}>
	// 						{n}
	// 					</button>
	// 				)
	// 			})}
	// 		</div>
	// 	)
	// }
	// //Search 오른쪽 버튼 Custom
	// createCustomClearButton = onClick => {
	// 	return (
	// 		<button className="btn btn-default" onClick={onClick}>
	// 			초기화
	// 		</button>
	// 	)
	// }
	// //Search Custom
	// createCustomSearchField = props => {
	// 	return <SearchField placeholder="회원이름, 없을시 전화번호" />
	// }

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
						? 'No'
						: value === 'memberName'
						? '회원'
						: value === 'memberPhone'
						? '전화번호'
						: value === 'type'
						? '구분'
						: value === 'productName'
						? '상품명'
						: value === 'amount'
						? '금액'
						: value === 'payMethod'
						? '결제수단'
						: value === 'saleDT'
						? '발생시간'
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
						? 'No'
						: value === 'memberName'
						? '회원'
						: value === 'memberPhone'
						? '전화번호'
						: value === 'type'
						? '구분'
						: value === 'productName'
						? '상품명'
						: value === 'amount'
						? '금액'
						: value === 'payMethod'
						? '결제수단'
						: value === 'saleDT'
						? '발생시간'
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
		const salesData = this.state.salesData
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
							onChange={this.updateFirstDate}
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
							onChange={this.updateLastDate}
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
					<div
						className={classNames('col-xs-12 col-sm-6 col-md-6 col-lg-6', scss.btn_row)}
						style={{ padding: md.mobile() ? '0' : null }}
					>
						<Button variant="outlined" onClick={() => this.xslDownload()}>
							엑셀 다운로드
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							className={''}
							style={{ marginLeft: '6px', marginRight: '6px' }}
							onClick={() => document.getElementById('refundDialog_btn').click()}
						>
							환불등록
						</Button>
						<Button
							variant="outlined"
							color="primary"
							className={''}
							onClick={() => document.getElementById('addDialog_btn').click()}
						>
							수기등록
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
									placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, 없을시 전화번호'}
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
						data={salesData}
						options={options}
						// search
						// keyBoardNav
						// pagination
						hover
						className={'study_place_bs'}
						condensed={true}
					>
						<TableHeaderColumn dataField="seq" isKey={true} hidden={true} dataAlign="center">
							Seq
						</TableHeaderColumn>
						<TableHeaderColumn dataField="no" width="70px" dataAlign="center">
							{/* No */}
							{this.orderCheck('seq')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="memberName" width="100px" dataAlign="center">
							{/* 회원 */}
							{this.orderCheck('memberName')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="memberPhone"
							width="110px"
							dataAlign="center"
							dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
						>
							{/* 회원 */}
							{this.orderCheck('memberPhone')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="type" width="80px" dataFormat={this.typeFormat} dataAlign="center">
							{/* 구분 */}
							{this.orderCheck('type')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="productName" width="180px" dataAlign="center">
							{/* 상품명 */}
							{this.orderCheck('productName')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="amount" width="110px" dataFormat={this.payFormat} dataAlign="center">
							{/* 금액 */}
							{this.orderCheck('amount')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="payMethod" width="90px" dataAlign="center" dataFormat={this.payMethodFormat}>
							{/* 결제수단 */}
							{this.orderCheck('payMethod')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="couponName" width="80px" dataAlign="center">
							쿠폰
						</TableHeaderColumn>
						<TableHeaderColumn dataField="saleDT" width="100px" dataAlign="center">
							{/* 발생시간 */}
							{this.orderCheck('saleDT')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="button"
							width="110px"
							dataAlign="center"
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
					<AddDialog products={this.state.products} onClose={this.closeEvent} />
					<RefundDialog onClose={this.closeEvent} />
					<DetailDialog detailData={this.state.detailData} onClose={this.closeEvent} />
				</div>
			</div>
		)
	}
}

export default Sales
