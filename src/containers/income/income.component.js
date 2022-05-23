import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './income.theme.style'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import DetailDialog from './detailDialog'
import InvoiceRegist from './invoiceRegist'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import scss from './income.module.scss'
import MobileDetect from 'mobile-detect'
import { debounce } from '../../utils'

import SearchIcon from '@material-ui/icons/Search'

const md = new MobileDetect(window.navigator.userAgent)

class Income extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			incomeList: [],
			newData: null,
			placeInfo: null,
			activePage: 1,
			listTotal: 0,
			sizePerPage: 10,
			defaultOrder: 'seq',
			order: 'desc'
		}
	}
	componentDidMount = () => {
		this.loadData()
	}

	loadData = async (searchValue) => {
		try {
			const res = await axios.get('/income/list', {
				headers: { 'Content-type': 'application/json' },
				params: {
					page: this.state.activePage,
					perPage: this.state.sizePerPage,
					orderBy: this.state.defaultOrder,
					align: this.state.order,
					search: searchValue ? searchValue : this.state.searchValue || ''
				}
			})
			if (!res.data.list) {
				throw new Error('No Data Found')
			}
			res.data.list.forEach((el) => {
				el.placeName = el.place ? el.place.name : '-'
				el.period = el.startDate ? moment(el.startDate).format('YY/M/D') + ' ~ ' + moment(el.endDate).format('D') : ''
			})
			this.setState({ incomeList: res.data.list, listTotal: res.data.total })
		} catch (error) {
			console.error(error)
		}
	}

	changeSizePerPage = async (n) => {
		await this.setState({ activePage: 1, sizePerPage: n })
		await this.loadData()
	}

	async handlePageChange(pageNumber) {
		await this.setState({ activePage: pageNumber })
		await this.loadData()
	}

	handleChange = (event) => {
		const searchValue = event.target.value
		this.setState({ searchValue })
		debounce(() => this.loadData(searchValue), 500)
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
	onClickEdit(row, domId) {
		// console.log(row)
		this.setState({ placeInfo: this.state.incomeList.filter((data) => data.seq === row['seq']) })
		const hiddenBtn = document.getElementById(domId)
		if (hiddenBtn) {
			hiddenBtn.click()
		}
	}

	//금액 Format
	payFormat = (value) => {
		let str = ''
		str = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'
		return str
	}

	cellButton(cell, row, enumObject, rowIndex) {
		return this._cellButton(cell, row, enumObject, rowIndex, {
			buttonText: '변경',
			buttonColor: `${row.transferStatus !== 'deny' && row.transferStatus !== 'paid' ? 'primary' : 'default'}`,
			clickedDomId: 'detailDialog_btn',
			disabled: row.transferStatus === 'deny' || row.transferStatus === 'paid'
		})
	}

	cellButtonInvoice(cell, row, enumObject, rowIndex) {
		// console.log(row)
		return this._cellButton(
			cell,
			row,
			enumObject,
			rowIndex,
			// 대기중 일때 발급 아닐 때 확인
			{
				buttonText: `${row.transferStatus !== 'wait' ? '상세' : '발급'}`,
				buttonColor: `${row.transferStatus !== 'wait' || row.place.taxPayer !== '1' ? 'default' : 'secondary'}`,
				clickedDomId: 'invoiceRegist_btn'
			}
		)
	}

	_cellButton(cell, row, enumObject, rowIndex, options) {
		const { buttonText, buttonColor, clickedDomId, disabled = false } = options
		return (
			<div className={scss.button_div}>
				<Button
					className={scss.detail_btn}
					variant="outlined"
					color={buttonColor}
					disabled={disabled}
					onClick={() => this.onClickEdit(row, clickedDomId)}
				>
					{buttonText}
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
						: value === 'startDate'
						? '기간'
						: value === 'place.name'
						? '공간명'
						: value === 'incomeTotal'
						? '수익'
						: value === 'costTotal'
						? '비용'
						: value === 'transferAmount'
						? '정산금액'
						: value === 'transferStatus'
						? '상태'
						: value === 'transferDate'
						? '입금일'
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
						: value === 'startDate'
						? '기간'
						: value === 'place.name'
						? '공간명'
						: value === 'incomeTotal'
						? '수익'
						: value === 'costTotal'
						? '비용'
						: value === 'transferAmount'
						? '정산금액'
						: value === 'transferStatus'
						? '상태'
						: value === 'transferDate'
						? '입금일'
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

	updateAllPaid = async () => {
		if (window.confirm('정말 현재 지급 대기중 상태의 모든 내역을 지급완료 상태로 변경하시겠습니까?')) {
			const res = await axios.post('/income/update/all/paid')
			if (res.data.result === 'success') {
				this.closeEvent({ flag: 'edit', message: '일괄 변경되었습니다.' })
			} else {
				this.closeEvent({ flag: 'fail', message: res.data.message })
			}
		}
	}

	downloadExcel() {
		axios
			.get('/income/xls/transfer', { responseType: 'blob' })
			.then((res) => {
				const url = window.URL.createObjectURL(new Blob([res.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', `대량이체_${moment(new Date()).format('YYYYMMDD')}.xlsx`)
				document.body.appendChild(link)
				link.click()
				link.remove()
			})
			.catch((error) => console.error(error))
	}

	handleSubmit = (e) => {
		e.preventDefault()
		const params = this.state.searchValue
		this.loadData(params)
	}

	render() {
		const incomeList = this.state.incomeList
		const handleSubmit = this.handleSubmit
		const handleChange = this.handleChange
		const permission = Number(sessionStorage.getItem('manager_permission'))
		// const inputHander = event => debounce(handleChange(event), 100)
		const options = {
			defaultSortName: 'seq', // default sort column name
			// defaultSortOrder: 'desc', // default sort order
			// clearSearch: true,
			// clearSearchBtn: this.createCustomClearButton,
			// searchField: this.createCustomSearchField,
			// sizePerPageDropDown: this.renderSizePerPageDropDown,
			// insertBtn: this.createCustomInsertButton,
			noDataText: '데이터 없음'
		}
		return (
			<div
				id="main"
				className={scss.main}
				style={{ minWidth: md.mobile() ? '100%' : '1030px', margin: md.mobile() ? '5% 0' : null, fontSize: '0.8rem' }}
			>
				<ReactNotifications />
				<div className={`btn-group btn-group-sm ${scss['income-toolbar']}`} role="group">
					<div>
						<Button variant="outlined" onClick={this.downloadExcel} color="default" autoFocus>
							대량이체파일생성
						</Button>
						{permission === 9 && (
							<Button variant="outlined" onClick={this.updateAllPaid} color="default" autoFocus style={{ marginLeft: '8px' }}>
								일괄지급처리
							</Button>
						)}
					</div>
					<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
						<input
							type="text"
							className="form-control "
							name=""
							id=""
							placeholder="공간명"
							onChange={handleChange}
							value={this.state.searchValue ? this.state.searchValue : ''}
							style={{ borderRadius: '3px' }}
						/>
					</div>
				</div>
				<div style={{ margin: md.mobile() ? '5%' : null }}>
					<BootstrapTable
						data={incomeList}
						options={options}
						// insertRow={true}
						// search
						// keyBoardNav
						// pagination
						hover
						className={'study_place_bs'}
					>
						<TableHeaderColumn dataField="seq" isKey={true} width="50px" searchable={false} dataAlign="center">
							{this.orderCheck('seq')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="period" width="100px" dataAlign="center">
							{this.orderCheck('startDate')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="placeName" width="220px">
							{this.orderCheck('place.name')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="incomeTotal" dataFormat={this.payFormat} width="100px">
							{this.orderCheck('incomeTotal')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="costTotal" dataFormat={this.payFormat} width="100px">
							{this.orderCheck('costTotal')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="transferAmount" dataFormat={this.payFormat} width="100px">
							{this.orderCheck('transferAmount')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="transferStatus"
							dataFormat={(cell, row) =>
								cell === 'wait'
									? row.place.taxPayer === '2'
										? '영수증 발급 전'
										: '계산서 발급 전'
									: cell === 'billed'
									? '승인대기'
									: cell === 'ready'
									? '지급 대기중'
									: cell === 'paid'
									? '지급완료'
									: cell === 'deny'
									? '거부'
									: cell
							}
							width="110px"
						>
							{this.orderCheck('transferStatus')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="transferDate"
							width="100px"
							// dataSort
							searchable={false}
							dataFormat={(cell, row) =>
								row.transferDate !== null && row.transferDate !== '' ? moment(row.transferDate).format('YYYY-MM-DD') : ''
							}
						>
							{/* 가입일 */}
							{this.orderCheck('transferDate')}
						</TableHeaderColumn>
						{permission === 9 && (
							<TableHeaderColumn
								dataField="button"
								width="80px"
								dataFormat={this.cellButtonInvoice.bind(this)}
								style={{ padding: '0px' }}
							>
								세금계산서
							</TableHeaderColumn>
						)}
						{permission === 9 && (
							<TableHeaderColumn
								dataField="button"
								width="80px"
								dataFormat={this.cellButton.bind(this)}
								style={{ padding: '0px' }}
							>
								지급
							</TableHeaderColumn>
						)}
					</BootstrapTable>
					<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
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
				{Number(window.sessionStorage.getItem('manager_permission')) === 9 && (
					<div className="hidden_">
						<DetailDialog className="hidden_" placeInfo={this.state.placeInfo} onClose={this.closeEvent} />
						<InvoiceRegist className="hidden_" placeInfo={this.state.placeInfo} onClose={this.closeEvent} />
					</div>
				)}
			</div>
		)
	}
}

Income.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(Income)
