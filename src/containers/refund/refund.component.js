import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './refund.theme.style'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import DetailDialog from './detailDialog'
import CashHistoryDialog from './cashHistoryDialog'
// eslint-disable-next-line import/no-unresolved
import axios from '../../wrapper/axios'
import moment from 'moment'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import scss from './refund.module.scss'
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent)

class Refund extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			firstDate: '',
			lastDate: '',
			refundList: [],
			refundInfo: null,
			selectedUserSeq: null,
			activePage: 1,
			listTotal: 0,
			sizePerPage: 10,
			defaultOrder: 'seq',
			order: 'desc',
			searchValue: '',
			searchData: ''
		}
	}

	componentDidMount = () => {
		setTimeout(() => {
			this.setState({
				firstDate: moment().date(1).format('YYYY-MM-DD'),
				lastDate: moment().add('months', 1).date(0).format('YYYY-MM-DD')
			})
			this.loadData()
		}, 200)
	}

	loadData = async (searchValue) => {
		searchValue ? await this.setState({ activePage: 1 }) : null
		axios
			.get('/cash/refund/list', {
				headers: { 'Content-type': 'application/json' },
				params: {
					from: this.state.firstDate,
					to: this.state.lastDate,
					page: this.state.activePage,
					perPage: this.state.sizePerPage,
					orderBy: this.state.defaultOrder,
					align: this.state.order,
					search: this.state.searchData ? this.state.searchData : null
				}
			})
			.then((res) => {
				res.data.list &&
					res.data.list.forEach((el, i) => {
						el.no = i + 1
						el.userName = el.user ? el.user.name : '-'
						el.userPhone = el.user ? el.user.phone : '-'
						el.usersCash = el.usersCash ? el.usersCash.cash : '-'
					})
				this.setState({ refundList: res.data.list, listTotal: res.data.total })
			})
			.catch((error) => console.error(error))
	}

	changeSizePerPage = (n) => {
		this.setState({ activePage: 1, sizePerPage: n })
		setTimeout(() => {
			this.loadData()
		}, 100)
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber })
		setTimeout(() => {
			this.loadData()
		}, 100)
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	//Dialog Close Event
	closeEvent = (data) => {
		if (!data || !data.flag) return
		else if (data.flag === 'edit') {
			this.alertMessage('완료', data.message, 'success')
			this.loadData()
			return
		} else if (data.flag === 'fail') {
			this.alertMessage('저장실패', data.message, 'danger')
			return
		} else if (data.flag === 'error') {
			this.alertMessage('에러', data.message, 'danger')
			return
		}
	}

	//상세보기 버튼 Click Event
	onClickEdit(row) {
		this.setState({ refundInfo: this.state.refundList.filter((data) => data.seq === row['seq']) })
		document.getElementById('detailDialog_btn').click()
	}
	//캐시내역보기 버튼 Click Event
	onClickHistory(row) {
		this.setState({ selectedUserSeq: row.userSeq })
		document.getElementById('cashHistoryDialog_btn').click()
	}

	nameFormat = (cell, row) => {
		const isDuplicated = this.state.refundList.filter((el) => !el.rejectReason && el.user.phone == row.user.phone).length > 1
		if (isDuplicated) return `<font style="background-color: lightgrey">${cell}</font>`
		return cell
	}

	//금액 Format
	payFormat = (cell, row) => {
		let str = ''
		str = cell ? cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'
		if (!row.rejectReason && !row.refundAmount && row.amount != row.usersCash) str = `<font color="red">${str}</font>`
		return str
	}

	formatEditButton(cell, row) {
		return (
			<div className={scss.button_div}>
				<Button variant="outlined" color="primary" className={scss.detail_btn} onClick={() => this.onClickEdit(row)}>
					변경
				</Button>
				<Button
					variant="outlined"
					color="default"
					className={scss.detail_btn}
					style={{ width: '74px' }}
					onClick={() => this.onClickHistory(row)}
				>
					캐시내역
				</Button>
			</div>
		)
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

	updateFirstDate = (e) => {
		this.setState({ firstDate: e.target.value })
	}
	updateLastDate = (e) => {
		this.setState({ lastDate: e.target.value })
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
						: value === 'user.name'
						? '이름'
						: value === 'user.phone'
						? '전화번호'
						: value === 'amount'
						? '신청금액'
						: value === 'usersCash.cash'
						? '보유캐시'
						: value === 'refundAmount'
						? '지급액'
						: value === 'refundReason'
						? '환불사유'
						: value === 'isAccept'
						? '승인여부'
						: value === 'processedTime'
						? '처리시간'
						: value === 'wdate'
						? '등록일'
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
						: value === 'user.name'
						? '이름'
						: value === 'user.phone'
						? '전화번호'
						: value === 'amount'
						? '신청금액'
						: value === 'usersCash.cash'
						? '보유캐시'
						: value === 'refundAmount'
						? '지급액'
						: value === 'refundReason'
						? '환불사유'
						: value === 'isAccept'
						? '승인여부'
						: value === 'processedTime'
						? '처리시간'
						: value === 'wdate'
						? '등록일'
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
		const refundList = this.state.refundList
		const options = {
			defaultSortName: 'seq', // default sort column name
			noDataText: '데이터 없음'
		}
		return (
			<div
				id="main"
				className={scss.main}
				style={{
					padding: '20px',
					minWidth: md.mobile() ? '100%' : '1400px',
					maxWidth: md.tablet() ? '700px' : null,
					margin: md.mobile() ? '5% 0' : null,
					fontSize: '0.8rem'
				}}
			>
				<ReactNotifications />

				<div className={'row'} style={{ height: '60px', verticalAlign: 'middle', padding: '0px 20px' }}>
					<TextField
						id="date"
						type="date"
						style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
						className={'sales_dateselect'}
						InputLabelProps={{
							shrink: true
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

					<Button variant="outlined" color="default" className={'sales_datebtn'} onClick={() => this.loadData()}>
						조회
					</Button>
				</div>
				<div>
					<div className="row">
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-9">
							<div className="btn-group btn-group-sm" role="group">
								<div>
									<div>{/* <AddEventDialog onClose={this.closeEvent} /> */}</div>
								</div>
							</div>
						</div>
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-3">
							<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
								<input
									className="form-control "
									type="text"
									placeholder="회원이름, 없을시 전화번호"
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
						data={refundList}
						options={options}
						// insertRow={true}
						// search
						// keyBoardNav
						// pagination
						hover
						className={'study_place_bs'}
					>
						<TableHeaderColumn dataField="no" width="50px" searchable={false} dataAlign="center">
							No.
						</TableHeaderColumn>
						<TableHeaderColumn dataField="seq" isKey={true} width="50px" searchable={false} dataAlign="center">
							{this.orderCheck('seq')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="userName" dataFormat={this.nameFormat} width="76px" dataAlign="center">
							{this.orderCheck('user.name')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="userPhone" width="120px" dataAlign="center">
							{this.orderCheck('user.phone')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="usersCash" dataFormat={this.payFormat} width="110px">
							{this.orderCheck('usersCash.cash')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="amount" dataFormat={this.payFormat} width="110px">
							{this.orderCheck('amount')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="refundAmount" dataFormat={this.payFormat} width="110px">
							{this.orderCheck('refundAmount')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="refundReason" width="*">
							{this.orderCheck('refundReason')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="isAccept"
							dataFormat={(cell, row) =>
								cell === true ? '<font color="blue">승인</font>' : cell === false ? row.rejectReason : cell
							}
							width="100px"
						>
							{this.orderCheck('isAccept')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="processedTime"
							width="130px"
							// dataSort
							searchable={false}
							dataFormat={(cell, row) =>
								row.processedTime !== null && row.processedTime !== ''
									? moment(row.processedTime).format('YYYY-MM-DD HH:mm:ss')
									: ''
							}
						>
							{this.orderCheck('processedTime')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="wdate"
							width="100px"
							// dataSort
							searchable={false}
							dataFormat={(cell, row) =>
								row.wdate !== null && row.wdate !== '' ? moment(row.wdate).format('YYYY-MM-DD') : ''
							}
						>
							{this.orderCheck('wdate')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="button"
							width="160px"
							dataFormat={this.formatEditButton.bind(this)}
							style={{ padding: '0px' }}
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
					<DetailDialog className="hidden_" refundInfo={this.state.refundInfo} onClose={this.closeEvent} />
					<CashHistoryDialog className="hidden_" userSeq={this.state.selectedUserSeq} />
				</div>
			</div>
		)
	}
}

Refund.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(Refund)
