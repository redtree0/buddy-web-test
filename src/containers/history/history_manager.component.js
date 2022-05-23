import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications, Store } from 'react-notifications-component'

import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import scss from './history.module.scss'
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent)

class HistoryManager extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			historyData: [],
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
			alert('날짜를 선택해주세요')
			return
		}
		searchValue ? await this.setState({ activePage: 1 }) : null
		await axios
			.get('/history/manager', {
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
				let _data = []
				for (let i = 0; i < data.length; i++) {
					let push_data = {
						no: data[i].no,
						seq: data[i].seq,
						placeName: data[i].place ? data[i].place.name : '',
						managerName: data[i].manager ? data[i].manager.username : '',
						memberName: data[i].member ? data[i].member.name || '이름없음' : '',
						memberPhone: data[i].member ? data[i].member.phone : '',
						action: data[i].action,
						memo: data[i].memo,
						wdate: moment(data[i].wdate).format('M/D HH:mm')
					}
					_data.push(push_data)
				}
				this.setState({ historyData: _data, listTotal: res.data.total })
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

	//상품선택 => 시간 지정
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
						? 'No'
						: value === 'placeName'
						? '공간'
						: value === 'managerName'
						? '관리자'
						: value === 'memberName'
						? '회원명'
						: value === 'memberPhone'
						? '전화번호'
						: value === 'action'
						? '행동'
						: value === 'memo'
						? '내용'
						: value === 'wdate'
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
						: value === 'placeName'
						? '공간'
						: value === 'managerName'
						? '관리자'
						: value === 'memberName'
						? '회원명'
						: value === 'memberPhone'
						? '전화번호'
						: value === 'action'
						? '행동'
						: value === 'memo'
						? '내용'
						: value === 'wdate'
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
		const historyData = this.state.historyData
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
			<div className={scss.main} style={{ minWidth: md.mobile() ? '100%' : null, margin: md.mobile() ? '5% 0' : null }}>
				<ReactNotifications />

				<div
					className={'row'}
					style={{ height: '60px', verticalAlign: 'middle', padding: '0px 20px', margin: md.mobile() ? '0' : null }}
				>
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
					<div className="row" style={{ margin: md.mobile() ? '0' : null }}>
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
					<div style={{ margin: md.mobile() ? '5%' : null }}>
						<BootstrapTable
							data={historyData}
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
							<TableHeaderColumn dataField="placeName" width="120px" dataAlign="center">
								{/* 유저 */}
								{this.orderCheck('placeName')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="managerName" width="80px" dataAlign="center">
								{/* 유저 */}
								{this.orderCheck('managerName')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="memberName" width="80px" dataAlign="center">
								{/* 유저 */}
								{this.orderCheck('memberName')}
							</TableHeaderColumn>
							<TableHeaderColumn
								dataField="memberPhone"
								width="94px"
								dataAlign="center"
								dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
							>
								{/* 전화번호 */}
								{this.orderCheck('memberPhone')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="action" width="110px" dataAlign="center">
								{/* 행동 */}
								{this.orderCheck('action')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="memo" width="200px" dataAlign="center">
								{/* 내용 */}
								{this.orderCheck('memo')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="wdate" width="100px" dataAlign="center">
								{/* 발생시간 */}
								{this.orderCheck('wdate')}
							</TableHeaderColumn>
						</BootstrapTable>
					</div>
					<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0 5%' : null }}>
						{[10, 25, 50].map((n, idx) => {
							const isActive = n === this.state.sizePerPage ? 'active' : null
							return (
								<button
									key={idx}
									type="button"
									style={{ margin: md.mobile() ? '0' : '20px 0' }}
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
			</div>
		)
	}
}

export default HistoryManager
