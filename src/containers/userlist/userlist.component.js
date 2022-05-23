import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './userlist.theme.style'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import AddEventDialog from './addEventDialog'
import DetailDialog from './detailDialog'
import axios from '../../wrapper/axios'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import MobileDetect from 'mobile-detect'
import withNavigation from 'components/withNavigation'

import scss from './userlist.module.scss'

const md = new MobileDetect(window.navigator.userAgent)

class UserList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			users: [],
			newData: null,
			userInfo: null,
			activePage: 1,
			listTotal: 0,
			sizePerPage: 10,
			searchValue: '',
			searchData: '',
			defaultOrder: 'seq',
			order: 'desc'
		}
	}

	componentDidMount = () => {
		if (parseInt(sessionStorage.getItem('manager_seq'), 10) === 1) {
			setTimeout(() => {
				this.loadData()
			}, 200)
		} else {
			this.props.navigate(-1)
		}
	}

	loadData = async (searchValue) => {
		searchValue ? await this.setState({ activePage: 1 }) : null
		axios
			.get('/user', {
				headers: { 'Content-type': 'application/json' },
				params: {
					page: this.state.activePage,
					perPage: this.state.sizePerPage,
					search: this.state.searchData ? this.state.searchData : null,
					orderBy: this.state.defaultOrder,
					align: this.state.order,
					incCash: true,
					incRecentPlace: true
				}
			})
			.then((res) => {
				const users =
					res.data.list &&
					res.data.list.map((el) => {
						return {
							...el,
							parent: el.parentNotice ? '동의(' + (el.parentPhone || '번호없음') + ')' : '',
							cash: el.usersCash && el.usersCash.cash ? Number(el.usersCash.cash).toLocaleString() + '원' : '-',
							recentPlace: el.salesHistory && el.salesHistory.place ? el.salesHistory.place.name : ''
						}
					})
				this.setState({ users, listTotal: res.data.total })
			})
			.catch((error) => console.error(error))
		return
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
		if (!data) return
		else if (data === 'check') {
			this.alertMessage('경고', '이름 & 전화번호를 입력해주세요.', 'danger')
		} else if (data === 'add') {
			this.alertMessage('알림', '등록 되었습니다', 'success')
			this.loadData()
		} else if (data === 'edit') {
			this.alertMessage('알림', '수정 되었습니다', 'success')
			this.loadData()
		} else if (data === 'delete') {
			this.alertMessage('알림', '삭제 되었습니다', 'success')
			this.loadData()
		} else if (data === 'message') {
			this.props.history.push('/chat/member')
		}
	}

	//상세보기 버튼 Click Event
	onClickEdit(cell, row, rowIndex) {
		this.setState({ userInfo: this.state.users.filter((data) => data.seq === row['seq']) })
		document.getElementById('detailDialog_btn').click()
	}

	cellButton(cell, row, enumObject, rowIndex) {
		const { classes } = this.props
		return (
			<div className={scss.button_div}>
				<Button
					variant="outlined"
					color="default"
					className={scss.detail_btn}
					onClick={() => this.onClickEdit(cell, row, rowIndex)}
				>
					수정
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
						: value === 'name'
						? '이름'
						: value === 'phone'
						? '전화번호'
						: value === 'parentNotice'
						? '보호자'
						: value === 'recentPlace'
						? '최근이용'
						: value === 'cash'
						? '보유캐시'
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
						: value === 'name'
						? '이름'
						: value === 'phone'
						? '전화번호'
						: value === 'parentNotice'
						? '보호자'
						: value === 'recentPlace'
						? '최근이용'
						: value === 'cash'
						? '보유캐시'
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
		const users = this.state.users
		const options = {
			defaultSortName: 'seq', // default sort column name
			// defaultSortOrder: 'desc', // default sort order
			// clearSearch: true,
			// clearSearchBtn: this.createCustomClearButton,
			// sizePerPageDropDown: this.renderSizePerPageDropDown,
			// insertBtn: this.createCustomInsertButton,
			noDataText: '데이터 없음'
		}
		return (
			<div
				id="main"
				className={scss.main}
				style={{
					minWidth: md.mobile() ? '100%' : null,
					maxWidth: md.mobile() ? '600px' : null,
					margin: md.mobile() ? '5% 0' : null,
					fontSize: '0.8rem'
				}}
			>
				<ReactNotifications />
				<div>
					<div className="row" style={{ margin: md.mobile() ? '0 5%' : null }}>
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-9" style={{ padding: md.mobile() ? '0' : null }}>
							<div className="btn-group btn-group-sm" role="group">
								<div>
									<div>
										<AddEventDialog onClose={this.closeEvent} />
									</div>
								</div>
							</div>
						</div>
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-3" style={{ padding: md.mobile() ? '0' : null }}>
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
					<div style={{ margin: md.mobile() ? '2% 5%' : null }}>
						<BootstrapTable
							data={users}
							options={options}
							// insertRow={true}
							// search
							// keyBoardNav
							// pagination
							hover
							className={'study_place_bs'}
						>
							<TableHeaderColumn dataField="seq" isKey width="60px">
								{/* Seq */}
								{this.orderCheck('seq')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="name" width="76px">
								{/* 이름 */}
								{this.orderCheck('name')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="phone" width="120px">
								{/* 전화번호 */}
								{this.orderCheck('phone')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="parent" width="140px">
								{/* 보호자 */}
								{this.orderCheck('parentNotice')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="recentPlace" columnTitle={() => this.orderCheck('recentPlace')} width="170px">
								{/* 최근이용 */}
								{this.orderCheck('recentPlace')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="memo" width="100px">
								메모
							</TableHeaderColumn>
							<TableHeaderColumn dataField="cash" width="100px">
								{/* 보유캐시 */}
								{this.orderCheck('cash')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="button" width="90px" dataFormat={this.cellButton.bind(this)}></TableHeaderColumn>
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
				<div className="hidden_">
					<DetailDialog className="hidden_" userInfo={this.state.userInfo} onClose={this.closeEvent} />
				</div>
			</div>
		)
	}
}

UserList.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(withNavigation(UserList))
