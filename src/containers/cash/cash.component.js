import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './cash.theme.style'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import AddEventDialog from './addEventDialog'
import moment from 'moment'
import axios from '../../wrapper/axios'
import { ReactNotifications, Store } from 'react-notifications-component'

import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import MobileDetect from 'mobile-detect'

import scss from './cash.module.scss'
import withNavigation from 'components/withNavigation'

const md = new MobileDetect(window.navigator.userAgent)
let sortFlag = false

class Cash extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			cashHistory: [],
			newData: null,
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
		if (parseInt(sessionStorage.getItem('manager_seq')) === 1) {
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
			.get('/cash', {
				params: {
					page: this.state.activePage,
					perPage: this.state.sizePerPage,
					search: this.state.searchData ? this.state.searchData : null,
					orderBy: this.state.defaultOrder,
					align: this.state.order
				}
			})
			.then((res) => {
				const cashHistory =
					res.data.list &&
					res.data.list.map((el) => {
						return {
							...el,
							typeStr:
								el.type == 'charge'
									? '충전'
									: el.type == 'use'
									? '사용'
									: el.type == 'cancel'
									? '이용취소'
									: el.type == 'refund'
									? '환불'
									: el.type == 'admin'
									? '조정'
									: '-',
							name: el.user && el.user.name,
							phone: el.user && el.user.phone,
							imp_uid: el.payment && el.payment.imp_uid,
							receipt_url: el.payment && el.payment.receipt_url,
							wdate: moment(el.wdate).format('YYYY/MM/DD HH:mm'),
							contents:
								el.type == 'admin'
									? '관리자페이지 조정'
									: el.product
									? el.product.name + ' 구매'
									: el.roomUsageSeq
									? '스터디룸 예약'
									: el.lockerUsageSeq
									? '락커 이용권 구매'
									: el.deskUsageSeq
									? '좌석 실시간권 이용'
									: el.payment
									? el.payment.pg_provider == 'kakaopay'
										? '카카오페이'
										: el.payment.pay_method == 'phone'
										? '휴대폰결제'
										: el.payment.pay_method == 'trans'
										? '계좌이체'
										: el.payment.pay_method == 'vbank'
										? '무통장입금'
										: el.payment.pay_method == 'cardNum'
										? '(비인증) ' + el.payment.card_name
										: el.payment.card_name || el.payment.pay_method
									: ''
						}
					})
				this.setState({ cashHistory, listTotal: res.data.total })
			})
			.catch((error) => console.error(error))
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber })
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	changeSizePerPage = (n) => {
		// props.changeSizePerPage(n);
		this.setState({ activePage: 1, sizePerPage: n })
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	amountFormat(cell) {
		return cell != null ? Number(cell).toLocaleString() + '원' : '-'
	}

	linkFormatter(cell, row) {
		return (
			cell && (
				<div>
					<a href={cell} target="_blank">
						{row.imp_uid}
					</a>
				</div>
			)
		)
	}

	// //Search 오른쪽 버튼 Custom
	// createCustomClearButton = onClick => {
	// 	return (
	// 		<button className="btn btn-default" onClick={onClick}>
	// 			초기화
	// 		</button>
	// 	)
	// }
	// //페이지당 Row 갯수 설정
	// renderSizePerPageDropDown = props => {
	// 	return (
	// 		<div className="btn-group">
	// 			{[10, 25, 50].map((n, idx) => {
	// 				const isActive = n === props.currSizePerPage ? 'active' : null
	// 				return (
	// 					<button
	// 						key={idx}
	// 						type="button"
	// 						className={`btn ${isActive}`}
	// 						onClick={() =>
	// 							this.changeSizePerPage(props, n)
	// 						}
	// 					>
	// 						{n}
	// 					</button>
	// 				)
	// 			})}
	// 		</div>
	// 	)
	// }
	// //신규 등록 버튼 Custom
	// createCustomInsertButton = onClick => {
	// 	return <AddEventDialog onClose={this.closeEvent} />
	// }

	//Dialog Close Event
	closeEvent = (data) => {
		if (!data) return
		else if (data === 'add') {
			this.alertMessage('알림', '등록 되었습니다', 'success')
			this.loadData()
		} else if (data === 'check') {
			this.alertMessage('알림', '모두 입력해주세요', 'danger')
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

	sortFunc = async (valueA, valueB, order, dataField, rowA, rowB, value) => {
		if (!sortFlag && (!this.state.searchValue || this.state.searchValue.length == 0)) {
			sortFlag = true
			await this.setState({ defaultOrder: value, order: order })

			this.loadData()
			setTimeout(() => {
				sortFlag = false
			}, 200)
		}
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
						: value === 'type'
						? '타입'
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
						: value === 'type'
						? '타입'
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
		const { classes } = this.props
		const cashHistory = this.state.cashHistory
		const options = {
			defaultSortName: 'seq', // default sort column name
			// defaultSortOrder: this.state.order, // default sort order
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
					minWidth: md.mobile() ? '100%' : '800px',
					maxWidth: md.mobile() ? '700px' : null,
					margin: md.mobile() ? '5% 0' : null,
					fontSize: '0.8rem'
				}}
			>
				<ReactNotifications />
				<div>
					<div className="row" style={{ margin: md.mobile() ? '0 5%' : null }}>
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-8" style={{ padding: md.mobile() ? '0' : null }}>
							<div className="btn-group btn-group-sm" role="group">
								<div>
									<div>
										<AddEventDialog
											onClose={this.closeEvent}
											searchUser={
												this.state.searchData && this.state.cashHistory[0] && this.state.cashHistory[0].user
											}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-4" style={{ padding: md.mobile() ? '0' : null }}>
							<div className="form-group form-group-sm input-group input-group-sm">
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
							data={cashHistory}
							options={options}
							// insertRow={true}
							// search
							// keyBoardNav
							// pagination
							hover
							className={'study_place_bs'}
						>
							<TableHeaderColumn
								dataField="seq"
								isKey
								width="60px"
								// dataSort
								// sortFunc={(valueA , valueB , order , dataField , rowA , rowB) => this.sortFunc(valueA , valueB , order , dataField , rowA , rowB, 'seq')}
							>
								{this.orderCheck('seq')}
								{/* Seq */}
							</TableHeaderColumn>
							<TableHeaderColumn
								dataField="name"
								width="76px"
								// dataSort
								// sortFunc={(valueA , valueB , order , dataField , rowA , rowB) => this.sortFunc(valueA , valueB , order , dataField , rowA , rowB, 'user.name')}
							>
								{/* 이름 */}
								{this.orderCheck('user.name')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="phone" width="100px">
								{this.orderCheck('user.phone')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="typeStr" width="80px">
								{this.orderCheck('type')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="amount" width="70px" dataFormat={this.amountFormat.bind(this)}>
								금액
							</TableHeaderColumn>
							<TableHeaderColumn dataField="balance" width="70px" dataFormat={this.amountFormat.bind(this)}>
								잔액
							</TableHeaderColumn>
							<TableHeaderColumn dataField="contents" width="*">
								내용
							</TableHeaderColumn>
							<TableHeaderColumn dataField="receipt_url" width="*" dataFormat={this.linkFormatter}>
								영수증
							</TableHeaderColumn>
							<TableHeaderColumn dataField="wdate" width="120px">
								발생일
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

Cash.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(withNavigation(Cash))
