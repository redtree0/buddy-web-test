import React from 'react'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import AddDialog from './addDialog'
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent)

class Coupon extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			coupons: [],
			activePage: 1,
			listTotal: 0,
			perPage: 10,
			searchValue: '',
			orderBy: 'seq',
			align: 'desc'
		}
	}

	componentDidMount() {
		this.loadData()
	}

	loadData = async (searchValue) => {
		if (searchValue) this.setState({ activePage: 1 })

		try {
			const { activePage, perPage, search, orderBy, align } = this.state
			const res = await axios.get('/coupon', {
				params: {
					page: searchValue ? 1 : activePage,
					perPage,
					search,
					orderBy: orderBy == 'label' ? 'type' : orderBy == 'eventValue' ? 'discountAmount' : orderBy,
					align,
					searchValue
				}
			})
			const { rows, count } = res && res.data
			this.setState({ coupons: rows, listTotal: count })
		} catch (err) {
			console.error(err)
		}
	}

	changeperPage = (perPage) => {
		this.setState({ activePage: 1, perPage })
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	handlePageChange(page) {
		this.setState({ activePage: page })
		setTimeout(() => {
			this.loadData()
		}, 1000)
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	closeEvent = (data) => {
		if (!data) return
		else if (data === 'discountRate') {
			this.alertMessage('경고', '할인률 1~100 사이 값을 금액을 입력해주세요.', 'danger')
		} else if (data === 'fail') {
			this.alertMessage('경고', '쿠폰 등록에 실패했습니다.', 'danger')
		} else if (data === 'success') {
			this.alertMessage('알림', '등록 되었습니다', 'success')
			this.loadData()
		} else {
			this.alertMessage('경고', `쿠폰 등록에 실패했습니다. ${data}`, 'danger')
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

	//Table 상세버튼
	cellButton(cell, row, enumObject, rowIndex) {
		return (
			<div>
				<Button variant="outlined" color="default" onClick={() => this.onEdit(cell, row, rowIndex)}>
					변경
				</Button>
				<Button
					variant="outlined"
					color="secondary"
					style={{ marginLeft: '8px' }}
					onClick={() => this.onDelete(cell, row, rowIndex)}
				>
					삭제
				</Button>
			</div>
		)
	}

	onCreate(cell, row) {
		this.setState({ couponSeq: null })
		AddDialog.popup()
	}

	onEdit(cell, row) {
		this.setState({ couponSeq: row.seq })
		AddDialog.popup()
	}

	async onDelete(cell, row) {
		if (!window.confirm('쿠폰을 삭제 하시겠습니까?')) {
			// no
			return
		}

		// yes
		try {
			const res = row.seq && (await axios.delete(`/coupon/${row.seq}`))

			const { data } = res
			if (data) {
				this.alertMessage('알림', '쿠폰이 삭제 되었습니다', 'success')
				this.loadData()
			}
		} catch (err) {
			console.error(err)
		}
	}

	//금액 Format
	amountFormat = (cell, row) => {
		let str = cell
		if (row.unit === '원') {
			str = cell ? cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
		}
		return `${str} ${row.unit}`
	}

	onKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopPropagation()
			this.onSearch()
		}
	}

	onSearch = async () => {
		await this.loadData(this.state.searchValue ? this.state.searchValue : null)
	}

	orderCheck = (value) => {
		const dataSort = async (dataField) => {
			this.setState({ orderBy: dataField, align: this.state.align === 'asc' ? 'desc' : 'asc' })
			setTimeout(() => {
				this.loadData()
			}, 100)
		}
		const colMap = {
			seq: 'No',
			name: '쿠폰명',
			code: '쿠폰코드',
			label: '타입',
			eventValue: '할인',
			issuedCount: '발행수',
			enrollmentCount: '등록수',
			usedCount: '사용수',
			endDate: '유효기간',
			isActive: '사용여부'
		}

		return ((value) => {
			if (value === this.state.orderBy) {
				return (
					<div onClick={() => dataSort(value)} style={{ cursor: 'pointer' }}>
						{colMap[value] ? colMap[value] : '-'}
						<span className={classNames('order', this.state.align === 'desc' ? 'dropdown' : 'dropup')}>
							<span className="caret" style={{ margin: '10px 5px' }}></span>
						</span>
					</div>
				)
			} else {
				return (
					<div onClick={() => dataSort(value)} style={{ cursor: 'pointer' }}>
						{colMap[value] ? colMap[value] : '-'}
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
		})(value)
	}

	render() {
		const coupons = this.state.coupons
		const options = {
			defaultSortName: 'seq', // default sort column name
			// defaultSortOrder: 'desc', // default sort order
			// clearSearch: true,
			// clearSearchBtn: this.createCustomClearButton,
			// searchField: this.createCustomSearchField,
			// perPageDropDown: this.renderperPageDropDown,
			noDataText: '데이터 없음'
		}
		return (
			<div
				style={{
					padding: '20px',
					minWidth: md.mobile() ? '100%' : '1000px',
					maxWidth: '1400px',
					marginLeft: 'auto',
					marginRight: 'auto'
				}}
			>
				<ReactNotifications />

				<div>
					<div className="row">
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-9">
							<div className="btn-group btn-group-sm" role="group">
								<div>
									<div></div>
								</div>
							</div>
						</div>
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-3">
							<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
								<input
									className="form-control "
									type="text"
									placeholder={'쿠폰명 또는 쿠폰코드 입력'}
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
						data={coupons}
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
						<TableHeaderColumn dataField="no" width="60px" dataAlign="center">
							{/* No */}
							{this.orderCheck('seq')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="name" width="120px" dataAlign="center">
							{/* 쿠폰명 */}
							{this.orderCheck('name')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="code" width="120px" dataAlign="center">
							{this.orderCheck('code')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="label" width="80px" dataAlign="center">
							{/* 타입 */}
							{this.orderCheck('label')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="eventValue" width="80px" dataFormat={this.amountFormat} dataAlign="center">
							{/* 할인 */}
							{this.orderCheck('eventValue')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="issuedCount" width="80px" dataAlign="center">
							{/* 발행수 */}
							{this.orderCheck('issuedCount')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="enrollmentCount" width="80px" dataAlign="center">
							{/* 등록수 */}
							{this.orderCheck('enrollmentCount')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="usedCount" width="80px" dataAlign="center">
							{/* 사용수 */}
							{this.orderCheck('usedCount')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="endDate"
							width="200px"
							dataFormat={(cell, row) =>
								(row.startDate ? moment(row.startDate).format('YYYY-MM-DD') : '') +
								' ~ ' +
								(row.endDate ? moment(row.endDate).format('YYYY-MM-DD') : '')
							}
							dataAlign="center"
						>
							{/* 유효기간 */}
							{this.orderCheck('endDate')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="isActive"
							width="80px"
							dataFormat={(cell) => (cell ? '사용' : '미사용')}
							dataAlign="center"
						>
							{/* 사용여부 */}
							{this.orderCheck('isActive')}
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="button"
							width="120px"
							dataAlign="center"
							dataFormat={this.cellButton.bind(this)}
						></TableHeaderColumn>
					</BootstrapTable>
					<div className="btn-group" style={{ width: '100%' }}>
						{[10, 25, 50].map((n, idx) => {
							const isActive = n === this.state.perPage ? 'active' : null
							return (
								<button
									key={idx}
									type="button"
									style={{ margin: md.mobile() ? '20px 0 0' : '20px 0' }}
									className={`btn ${isActive}`}
									onClick={() => this.changeperPage(n)}
								>
									{n}
								</button>
							)
						})}
						<div style={{ float: 'right', width: md.mobile() ? '100%' : null, textAlign: md.mobile() ? 'right' : null }}>
							<Pagination
								activePage={this.state.activePage}
								itemsCountPerPage={this.state.perPage}
								totalItemsCount={this.state.listTotal}
								pageRangeDisplayed={5}
								onChange={(event) => this.handlePageChange(event)}
							/>
						</div>
					</div>
				</div>
				<div className="text-center">
					<Button variant="raised" size="large" color="primary" style={{ color: 'white' }} onClick={this.onCreate.bind(this)}>
						쿠폰발행
					</Button>
				</div>
				<div className="hidden_">
					<AddDialog couponSeq={this.state.couponSeq} onClose={this.closeEvent} />
				</div>
			</div>
		)
	}
}

export default Coupon
