import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './memberlist.theme.style'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import AddEventDialog from './addEventDialog'
import ExcelDialog from './excelDialog'
import DetailDialog from './detailDialog'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import scss from './memberlist.module.scss'
import MobileDetect from 'mobile-detect'
import withNavigation from 'components/withNavigation'

const md = new MobileDetect(window.navigator.userAgent)

class MemberList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			members: [],
			newData: null,
			memberInfo: null,
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
		this.loadData()
	}

	loadData = async (searchValue) => {
		searchValue ? await this.setState({ activePage: 1 }) : null
		axios
			.get('/member/all', {
				headers: { 'Content-type': 'application/json' },
				params: {
					page: this.state.activePage,
					perPage: this.state.sizePerPage,
					search: this.state.searchData ? this.state.searchData : null,
					orderBy: this.state.defaultOrder,
					align: this.state.order
				}
			})
			.then((res) => {
				this.setState({ members: res.data.list.map((e) => ({ ...e, placeName: e.place.name })), listTotal: res.data.total })
			})
			.catch((error) => console.error(error))

		return
	}

	downloadExcel = async () => {
		await axios
			.get('/member/all/xls', {
				responseType: 'blob',
				params: {
					search: this.state.searchData ? this.state.searchData : null
				}
			})
			.then((res) => {
				const url = window.URL.createObjectURL(new Blob([res.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', '통합회원목록_' + moment(new Date()).format('YYYYMMDD') + '.xlsx')
				document.body.appendChild(link)
				link.click()
				link.remove()
			})
			.catch((error) => console.error(error))
	}

	sendGroupSMS = () => {
		if (!md.mobile()) {
			alert('스마트폰에서 가능한 기능입니다.')
			return
		}
		const agent = window.navigator.userAgent.toLowerCase()
		let link = 'sms:'
		if (agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) {
			link += '//open?addresses='
		}
		this.state.members.forEach((m) => {
			link += m.phone + ','
		})
		window.location.href = link
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

	closeEvent = (data, message) => {
		if (!data) return
		else if (data === 'check') {
			this.alertMessage('경고', '이름 & 전화번호를 입력해주세요', 'danger')
			return
		} else if (data === 'nofile') {
			this.alertMessage('경고', '업로드할 파일을 선택해주세요', 'danger')
			return
		} else if (data === 'add') {
			this.alertMessage('알림', '등록 되었습니다', 'success')
		} else if (data === 'edit') {
			this.alertMessage('알림', '수정 되었습니다', 'success')
		} else if (data === 'leave') {
			this.alertMessage('알림', '탈퇴 되었습니다', 'success')
		} else if (message) {
			this.alertMessage('알림', message, 'danger')
			return
		}
		this.loadData()
	}

	//상세보기 버튼 Click Event
	onClickEdit(row) {
		this.setState({ memberInfo: this.state.members.filter((data) => data.seq === row['seq']) })
		document.getElementById('detailDialog_btn').click()
	}

	//메시지
	hrefMessage = (row) => {
		if (row.userSeq) {
			const data = {
				userSeq: row.userSeq,
				userName: row.name,
				userPhone: row.phone,
				newMsgCnt: 0,
				image: 'assets/images/avatars/admin.png'
			}
			localStorage.setItem('message_user', JSON.stringify(data))
			this.props.navigate('/chat/member')
		} else {
			this.alertMessage('알림', '앱 사용자가 아니어서 채팅 할 수 없습니다', 'danger')
		}
	}

	onClickUsageButton(row) {
		axios
			.get('/place/' + row.place.seq + '/connect')
			.then((res) => {
				if (res.data.result === 'success') {
					localStorage.setItem('manager_place', JSON.stringify({ key: row.place.key, seq: row.place.seq, name: row.place.name }))
					localStorage.setItem('access_token', res.data.access_token)
					axios.defaults.headers.common['access_token'] = res.data.access_token

					this.props.navigate('/usage', { state: { member: row } })
				}
			})

			.catch((error) => console.error(error))
	}

	cellButton(cell, row, enumObject, rowIndex) {
		return (
			<div className={scss.button_div}>
				<Button
					variant="outlined"
					color="primary"
					style={{ width: '60px' }}
					className={scss.detail_btn}
					onClick={() => this.onClickUsageButton(row)}
				>
					상세
				</Button>
				<Button variant="outlined" color="default" className={scss.detail_btn} onClick={() => this.onClickEdit(row)}>
					수정
				</Button>
				<Button variant="outlined" color="default" className={scss.detail_btn} onClick={() => this.hrefMessage(row)}>
					채팅
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
						? 'No'
						: value === 'placeName'
						? '공간'
						: value === 'name'
						? '이름'
						: value === 'phone'
						? '전화번호'
						: value === 'regMethod'
						? '가입경로'
						: value === 'wdate'
						? '가입일'
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
						: value === 'name'
						? '이름'
						: value === 'phone'
						? '전화번호'
						: value === 'regMethod'
						? '가입경로'
						: value === 'wdate'
						? '가입일'
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

	formatVaccInfo = (user) => {
		if (!user) return ''
		else if (user.vaccPass) return '관리자확인'
		else if (user.vaccDegree > 0) {
			const vaccKindStr =
				user.vaccKind == 'az'
					? 'AZ'
					: user.vaccKind == 'pfi'
					? '화이자'
					: user.vaccKind == 'mod'
					? '모더나'
					: user.vaccKind == 'yan'
					? '얀센'
					: user.vaccKind == 'etc'
					? '기타'
					: ''
			return `${vaccKindStr} ${user.vaccDegree}차 접종<br/>(${user.vaccDate})`
		} else if (moment().year() - user.birthYear <= 18) return '미성년자'
		else if (user.vaccDegree == 0) return '미접종'
		else return '-'
	}

	render() {
		const members = this.state.members
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
				style={{
					minWidth: md.mobile() ? '100%' : '880px',
					maxWidth: md.mobile() ? '600px' : null,
					margin: md.mobile() ? '5% 0' : null,
					fontSize: '0.8rem'
				}}
			>
				<ReactNotifications />
				<div style={{ width: '100%' }}>
					<div className="row" style={{ margin: md.mobile() ? '0 5%' : null }}>
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-9" style={{ padding: md.mobile() ? '0' : null }}>
							<div className="btn-group btn-group-sm" role="group">
								{!window.location.pathname.includes('/all') && (
									<div style={{ float: 'left', marginRight: '10px' }}>
										<AddEventDialog onClose={this.closeEvent} />
									</div>
								)}
								<Button
									variant="outlined"
									size="small"
									className={scss.xslBtn}
									style={{ marginRight: '10px' }}
									onClick={this.downloadExcel}
								>
									엑셀 다운로드
								</Button>
								{!window.location.pathname.includes('/all') && (
									<div style={{ float: 'left', marginRight: '10px' }}>
										<ExcelDialog onClose={this.closeEvent} />
									</div>
								)}
								<Button
									variant="outlined"
									size="small"
									className={scss.xslBtn}
									style={{ marginRight: '10px' }}
									onClick={this.sendGroupSMS}
								>
									단체문자
								</Button>
							</div>
						</div>
						<div className="col-xs-6 col-sm-6 col-md-6 col-lg-3" style={{ padding: md.mobile() ? '0' : null }}>
							<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
								<input
									className="form-control "
									type="text"
									placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, '}
									value={this.state.searchValue}
									onChange={this.handleChange('searchValue')}
									onKeyDown={(event) => this.onKeyDown(event)}
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
							data={members}
							options={options}
							// insertRow={true}
							// search
							// keyBoardNav
							// pagination
							hover
							className={'study_place_bs'}
						>
							<TableHeaderColumn dataField="seq" isKey={true} hidden={true} searchable={false} dataAlign="center">
								Seq
							</TableHeaderColumn>
							<TableHeaderColumn dataField="no" width="50px" dataAlign="center">
								{this.orderCheck('seq')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="placeName" width="160px">
								{this.orderCheck('placeName')}
							</TableHeaderColumn>
							<TableHeaderColumn
								dataField="name"
								dataFormat={(cell, row) =>
									row.isBlack ? `<font style="background-color: lightgrey; color: red;">${cell}</font>` : cell
								}
								width="80px"
							>
								{this.orderCheck('name')}
							</TableHeaderColumn>
							<TableHeaderColumn dataField="phone" width="100px" dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}>
								{this.orderCheck('phone')}
							</TableHeaderColumn>
							<TableHeaderColumn
								dataField="regMethod"
								width="60px"
								// dataSort
								searchable={false}
								dataFormat={(cell, row) => (cell === 'app' ? '앱' : cell === 'admin' ? '관리자' : cell)}
							>
								{/* 경로 */}
								{this.orderCheck('regMethod')}
							</TableHeaderColumn>
							<TableHeaderColumn
								dataField="cash"
								width="80px"
								searchable={false}
								dataFormat={(cell, row) =>
									Number(row.user && row.user.usersCash && row.user.usersCash.cash).toLocaleString()
								}
							>
								보유캐시
							</TableHeaderColumn>
							<TableHeaderColumn
								dataField="regMethod"
								width="80px"
								// dataSort
								searchable={false}
								dataFormat={(cell, row) => moment(row.wdate).format('YYYY/MM/DD')}
							>
								{/* 가입일 */}
								{this.orderCheck('wdate')}
							</TableHeaderColumn>
							<TableHeaderColumn
								dataField="vaccDegree"
								width="100px"
								searchable={false}
								dataFormat={(cell, row) => this.formatVaccInfo(row.user)}
							>
								백신접종
							</TableHeaderColumn>
							<TableHeaderColumn
								dataField="button"
								width="100px"
								dataFormat={this.cellButton.bind(this)}
								style={{ padding: '0px' }}
							></TableHeaderColumn>
						</BootstrapTable>
					</div>
					<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0 5%' : null }}>
						{[10, 20, 50, 100, 1000].map((n, idx) => {
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
					<DetailDialog className="hidden_" memberInfo={this.state.memberInfo} onClose={this.closeEvent} />
				</div>
			</div>
		)
	}
}

MemberList.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(withNavigation(MemberList))
