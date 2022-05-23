import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './usage.theme.style'
import SwipeableViews from 'react-swipeable-views'
import TextField from '@material-ui/core/TextField'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import axios from '../../wrapper/axios'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import moment from 'moment'
import scss from './usage.module.scss'
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent)

function TabContainer(props) {
	const { children, dir } = props

	return (
		<Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
			{children}
		</Typography>
	)
}
TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
	dir: PropTypes.string.isRequired
}

class UsageList extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			usageList: [],
			historyList: null,
			tabIndex: 0,

			activePage1: 1,
			listTotal1: 0,
			sizePerPage1: 10,
			defaultOrder1: 'seq',
			order1: 'desc',
			searchValue1: '',
			searchData1: '',
			firstDate1: '',
			lastDate1: '',

			activePage2: 1,
			listTotal2: 0,
			sizePerPage2: 10,
			defaultOrder2: 'seq',
			order2: 'desc',
			searchValue2: '',
			searchData2: '',
			firstDate2: '',
			lastDate2: '',

			activePage3: 1,
			listTotal3: 0,
			sizePerPage3: 10,
			defaultOrder3: 'seq',
			order3: 'desc',
			searchValue3: '',
			searchData3: '',
			firstDate3: '',
			lastDate3: '',

			activePage4: 1,
			listTotal4: 0,
			sizePerPage4: 10,
			defaultOrder4: 'seq',
			order4: 'desc',
			searchValue4: '',
			searchData4: '',
			firstDate4: '',
			lastDate4: ''
		}
	}

	handleTabChange = (event, value, key = null) => {
		this.setState({ tabIndex: value })
		if (value == 0) {
			if (!this.state.usageList.desk) this.loadData('desk', key)
		} else if (value == 1) {
			if (!this.state.usageList.room) this.loadData('room', key)
		} else if (value == 2) {
			if (!this.state.usageList.locker) this.loadData('locker', key)
		} else if (value == 3) {
			if (!this.state.historyList) this.fetchHistoryData()
		}
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	componentDidMount = () => {
		setTimeout(() => {
			this.setState({
				memberKey: this.props.location.state && this.props.location.state.member && this.props.location.state.member.key,
				firstDate1: moment().date(1).format('YYYY-MM-DD'),
				lastDate1: moment().add(1, 'months').date(0).format('YYYY-MM-DD'),
				firstDate2: moment().date(1).format('YYYY-MM-DD'),
				lastDate2: moment().add(1, 'months').date(0).format('YYYY-MM-DD'),
				firstDate3: moment().date(1).format('YYYY-MM-DD'),
				lastDate3: moment().add(1, 'months').date(0).format('YYYY-MM-DD'),
				firstDate4: moment().date(1).format('YYYY-MM-DD'),
				lastDate4: moment().add(1, 'months').date(0).format('YYYY-MM-DD')
			})

			let index = 0
			if (this.props.location.state && this.props.location.state.type) {
				if (this.props.location.state.type == 'room') index = 1
				else if (this.props.location.state.type == 'locker') index = 2
			}
			if (this.state.memberKey) {
				this.loadMemberData()
			}
			this.handleTabChange(null, index, this.props.location.state && this.props.location.state.key)
		}, 200)
	}

	loadMemberData = async () => {
		const { data } = await axios.get(`/member/${this.state.memberKey}`)
		this.setState({
			memberInfo: { ...data.member, coupon: data.coupon }
		})
	}

	fetchHistoryData = async () => {
		this.state.searchValue4 && (await this.setState({ activePage: 1 }))
		const { data } = await axios.get('/history/user', {
			params: {
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				from: this.state.firstDate4,
				to: this.state.lastDate4,
				page: this.state.activePage4,
				perPage: this.state.sizePerPage4,
				search: this.state.searchData4 || null,
				orderBy: this.state.defaultOrder4,
				align: this.state.order4,
				userSeq: this.state.searchData4 ? null : this.state.memberInfo ? this.state.memberInfo.userSeq : null
			}
		})
		this.setState({
			historyList: data.list.map((el) => ({
				no: el.no,
				seq: el.seq,
				user: el.user || '',
				userName: el.user ? el.user.name || '이름없음' : '',
				userPhone: el.user ? el.user.phone : '',
				action: el.action,
				memo: el.memo,
				wdate: moment(el.wdate).format('M/D HH:mm')
			})),
			listTotal4: data.total
		})
	}

	loadData = async (tab, key, searchValue) => {
		let _search = ''
		if (tab === 'desk') {
			searchValue ? await this.setState({ activePage1: 1 }) : null
			_search = this.state.searchData1 ? this.state.searchData1 : null
		} else if (tab === 'room') {
			searchValue ? await this.setState({ activePage2: 1 }) : null
			_search = this.state.searchData2 ? this.state.searchData2 : null
		} else if (tab === 'locker') {
			searchValue ? await this.setState({ activePage3: 1 }) : null
			_search = this.state.searchData3 ? this.state.searchData3 : null
		} else if (tab === 'history') {
			searchValue ? await this.setState({ activePage4: 1 }) : null
			_search = this.state.searchData4 ? this.state.searchData4 : null
		}

		axios
			.get(`/${tab}/usage/list`, {
				headers: { 'Content-type': 'application/json' },
				params: {
					placeSeq: localStorage.getItem('manager_place') && JSON.parse(localStorage.getItem('manager_place')).seq,
					from:
						tab === 'desk'
							? this.state.firstDate1
							: tab === 'room'
							? this.state.firstDate2
							: tab === 'locker'
							? this.state.firstDate3
							: null,
					to:
						tab === 'desk'
							? this.state.lastDate1
							: tab === 'room'
							? this.state.lastDate2
							: tab === 'locker'
							? this.state.lastDate3
							: null,
					page:
						tab === 'desk'
							? this.state.activePage1
							: tab === 'room'
							? this.state.activePage2
							: tab === 'locker'
							? this.state.activePage3
							: null,
					perPage:
						tab === 'desk'
							? this.state.sizePerPage1
							: tab === 'room'
							? this.state.sizePerPage2
							: tab === 'locker'
							? this.state.sizePerPage3
							: null,
					orderBy:
						tab === 'desk'
							? this.state.defaultOrder1
							: tab === 'room'
							? this.state.defaultOrder2
							: tab === 'locker'
							? this.state.defaultOrder3
							: null,
					align:
						tab === 'desk'
							? this.state.order1
							: tab === 'room'
							? this.state.order2
							: tab === 'locker'
							? this.state.order3
							: null,
					search: _search,
					key,
					memberKey: this.state.memberKey
				}
			})
			.then((res) => {
				const usageList =
					res.data.list &&
					res.data.list.map((el) => {
						return {
							...el,
							memberName: el.member.name,
							memberPhone: el.member.phone,
							productName: el.product ? el.product.name : el.timeType == 'real' ? '실시간' : '직접입력',
							roomName: el.room ? el.room.name : ''
						}
					})
				this.setState({ usageList: { ...this.state.usageList, [tab]: usageList } })
				if (tab === 'desk') {
					this.setState({ listTotal1: res.data.total })
				} else if (tab === 'room') {
					this.setState({ listTotal2: res.data.total })
				} else if (tab === 'locker') {
					this.setState({ listTotal3: res.data.total })
				}
			})
			.catch((error) => console.error(error))
	}

	xslDownload = async (tab, key) => {
		let FILEPATH = `/${tab}/usage/list/xls` + '?placeSeq=' + JSON.parse(localStorage.getItem('manager_place')).seq
		let _search = ''
		if (tab === 'desk') {
			FILEPATH = FILEPATH + '&from=' + this.state.firstDate1 + '&to=' + this.state.lastDate1
			_search = this.state.searchData1 ? this.state.searchData1 : null
		} else if (tab === 'room') {
			FILEPATH = FILEPATH + '&from=' + this.state.firstDate2 + '&to=' + this.state.lastDate2
			_search = this.state.searchData2 ? this.state.searchData2 : null
		} else if (tab === 'locker') {
			FILEPATH = FILEPATH + '&from=' + this.state.firstDate3 + '&to=' + this.state.lastDate3
			_search = this.state.searchData3 ? this.state.searchData3 : null
		}

		if (this.state.memberKey) {
			if (_search) {
				FILEPATH = FILEPATH + '&memberKey=' + this.state.memberKey + '&search=' + _search
			} else {
				FILEPATH = FILEPATH + '&memberKey=' + this.state.memberKey
			}
		} else {
			if (_search) FILEPATH = FILEPATH + '&search=' + _search
		}

		await axios
			.get(FILEPATH, { responseType: 'blob' })
			.then((res) => {
				const url = window.URL.createObjectURL(new Blob([res.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', `${tab}이용내역_` + moment(new Date()).format('YYYYMMDD') + '.xlsx')
				document.body.appendChild(link)
				link.click()
				link.remove()
			})
			.catch((error) => console.error(error))
	}

	handlePageChange(pageNumber, tab) {
		if (tab === 'desk') {
			this.setState({ activePage1: pageNumber })
		} else if (tab === 'room') {
			this.setState({ activePage2: pageNumber })
		} else if (tab === 'locker') {
			this.setState({ activePage3: pageNumber })
		} else if (tab === 'history') {
			this.setState({ activePage4: pageNumber })
		}

		setTimeout(() => {
			if (tab === 'history') {
				this.fetchHistoryData()
			} else {
				this.loadData(tab, this.props.location.state && this.props.location.state.key)
			}
		}, 200)
	}

	//Search 오른쪽 버튼 Custom
	createCustomClearButton = (onClick) => {
		return (
			<button className="btn" onClick={onClick}>
				초기화
			</button>
		)
	}

	//Search Custom
	createCustomSearchField = (props) => {
		return <SearchField placeholder="이름 또는 전화번호, 좌석번호" />
	}

	//페이지당 Row 갯수 설정
	renderSizePerPageDropDown = (props) => {
		return (
			<div className="btn-group">
				{[10, 25, 50].map((n, idx) => {
					const isActive = n === props.currSizePerPage ? 'active' : null
					return (
						<button key={idx} type="button" className={`btn ${isActive}`} onClick={() => props.changeSizePerPage(n)}>
							{n}
						</button>
					)
				})}
			</div>
		)
	}
	changeSizePerPage = (n, tab) => {
		// props.changeSizePerPage(n);
		if (tab === 'desk') {
			this.setState({ activePage1: 1, sizePerPage1: n })
		} else if (tab === 'room') {
			this.setState({ activePage2: 1, sizePerPage2: n })
		} else if (tab === 'locker') {
			this.setState({ activePage3: 1, sizePerPage3: n })
		} else if (tab === 'history') {
			this.setState({ activePage4: 1, sizePerPage4: n })
		}
		setTimeout(() => {
			if (tab === 'history') {
				this.fetchHistoryData()
			} else {
				this.loadData(tab, this.props.location.state && this.props.location.state.key)
			}
		}, 200)
	}

	onKeyDown = (event, tab) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopPropagation()
			this.onSearch(tab)
		}
	}

	onSearch = async (tab) => {
		if (tab === 'desk') {
			await this.setState({ searchData1: this.state.searchValue1 })
			await this.loadData(
				'desk',
				this.props.location.state && this.props.location.state.key,
				this.state.searchValue1 ? this.state.searchValue1 : 'clear'
			)
		} else if (tab === 'room') {
			await this.setState({ searchData2: this.state.searchValue2 })
			await this.loadData(
				'room',
				this.props.location.state && this.props.location.state.key,
				this.state.searchValue2 ? this.state.searchValue2 : 'clear'
			)
		} else if (tab === 'locker') {
			await this.setState({ searchData3: this.state.searchValue3 })
			await this.loadData(
				'locker',
				this.props.location.state && this.props.location.state.key,
				this.state.searchValue3 ? this.state.searchValue3 : 'clear'
			)
		} else if (tab === 'history') {
			await this.setState({ searchData4: this.state.searchValue4 })
			await this.fetchHistoryData()
		}
	}

	dataSort = async (dataField, tab) => {
		if (tab === 'desk') {
			if (this.state.defaultOrder1 !== dataField) {
				await this.setState({ defaultOrder1: dataField, order1: 'desc' })
			} else {
				this.setState({ defaultOrder1: dataField })
				if (this.state.order1 === 'desc') {
					await this.setState({ order1: 'asc' })
				} else {
					await this.setState({ order1: 'desc' })
				}
			}
		} else if (tab === 'room') {
			if (this.state.defaultOrder2 !== dataField) {
				await this.setState({ defaultOrder2: dataField, order2: 'desc' })
			} else {
				this.setState({ defaultOrder2: dataField })
				if (this.state.order2 === 'desc') {
					await this.setState({ order2: 'asc' })
				} else {
					await this.setState({ order2: 'desc' })
				}
			}
		} else if (tab === 'locker') {
			if (this.state.defaultOrder3 !== dataField) {
				await this.setState({ defaultOrder3: dataField, order3: 'desc' })
			} else {
				this.setState({ defaultOrder3: dataField })
				if (this.state.order3 === 'desc') {
					await this.setState({ order3: 'asc' })
				} else {
					await this.setState({ order3: 'desc' })
				}
			}
		} else if (tab === 'history') {
			if (this.state.defaultOrder4 !== dataField) {
				this.setState({ defaultOrder4: dataField, order3: 'desc' })
			} else {
				this.setState({ defaultOrder4: dataField, order4: this.state.order4 === 'desc' ? 'asc' : 'desc' })
			}
		}

		if (tab === 'history') {
			this.fetchHistoryData()
		} else {
			this.loadData(tab, this.props.location.state && this.props.location.state.key)
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

	orderCheck = (value, tab) => {
		if (tab === 'desk') {
			if (value === this.state.defaultOrder1) {
				return (
					<div onClick={() => this.dataSort(value, tab)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '이름'
							: value === 'member.phone'
							? '전화번호'
							: value === 'deskNo'
							? '좌석번호'
							: value === 'deskType'
							? '좌석타입'
							: value === 'timeType'
							? '이용타입'
							: value === 'product.name'
							? '이용권'
							: value === 'startDT'
							? '시작일시'
							: value === 'endDT'
							? '종료일시'
							: value === 'mdate'
							? '수정일시'
							: value}
						<span className={classNames('order', this.state.order1 === 'asc' ? 'dropup' : '')}>
							<span className="caret" style={{ margin: '10px 5px' }}></span>
						</span>
					</div>
				)
			} else {
				return (
					<div onClick={() => this.dataSort(value, tab)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '이름'
							: value === 'member.phone'
							? '전화번호'
							: value === 'deskNo'
							? '좌석'
							: value === 'deskType'
							? '좌석타입'
							: value === 'timeType'
							? '이용타입'
							: value === 'product.name'
							? '이용권'
							: value === 'startDT'
							? '시작일시'
							: value === 'endDT'
							? '종료일시'
							: value === 'mdate'
							? '수정일시'
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
		} else if (tab === 'room') {
			if (value === this.state.defaultOrder2) {
				return (
					<div onClick={() => this.dataSort(value, tab)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '이름'
							: value === 'member.phone'
							? '전화번호'
							: value === 'room.name'
							? '스터디룸'
							: value === 'startDT'
							? '시작일시'
							: value === 'endDT'
							? '종료일시'
							: value === 'mdate'
							? '수정일시'
							: value}
						<span className={classNames('order', this.state.order2 === 'asc' ? 'dropup' : '')}>
							<span className="caret" style={{ margin: '10px 5px' }}></span>
						</span>
					</div>
				)
			} else {
				return (
					<div onClick={() => this.dataSort(value, tab)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '이름'
							: value === 'member.phone'
							? '전화번호'
							: value === 'room.name'
							? '스터디룸'
							: value === 'startDT'
							? '시작일시'
							: value === 'endDT'
							? '종료일시'
							: value === 'mdate'
							? '수정일시'
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
		} else if (tab === 'locker') {
			if (value === this.state.defaultOrder3) {
				return (
					<div onClick={() => this.dataSort(value, tab)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '이름'
							: value === 'member.phone'
							? '전화번호'
							: value === 'lockerNo'
							? '락커번호'
							: value === 'product.name'
							? '이용권'
							: value === 'startDT'
							? '시작일시'
							: value === 'endDT'
							? '종료일시'
							: value === 'mdate'
							? '수정일시'
							: value}
						<span className={classNames('order', this.state.order3 === 'asc' ? 'dropup' : '')}>
							<span className="caret" style={{ margin: '10px 5px' }}></span>
						</span>
					</div>
				)
			} else {
				return (
					<div onClick={() => this.dataSort(value, tab)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '이름'
							: value === 'member.phone'
							? '전화번호'
							: value === 'lockerNo'
							? '락커번호'
							: value === 'product.name'
							? '이용권'
							: value === 'startDT'
							? '시작일시'
							: value === 'endDT'
							? '종료일시'
							: value === 'mdate'
							? '수정일시'
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
		} else if (tab === 'history') {
			if (value === this.state.defaultOrder4) {
				return (
					<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'No'
							: value === 'userName'
							? '이름'
							: value === 'userPhone'
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
							: value === 'userName'
							? '이름'
							: value === 'userPhone'
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
	}

	render() {
		const { classes, theme } = this.props
		const member = this.state.memberInfo
		const usageList = this.state.usageList
		const historyList = this.state.historyList
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
				id="main"
				className={scss.main}
				style={{
					minWidth: md.mobile() ? '100%' : null,
					maxWidth: md.tablet() ? '700px' : null,
					margin: md.mobile() ? '0' : '30px auto'
				}}
			>
				<ReactNotifications />
				<div>
					<Typography variant="title" gutterBottom>
						{this.props.location.state
							? this.props.location.state.member
								? `${this.props.location.state.member.name} 회원 이용내역`
								: this.props.location.state.no
								? `${this.props.location.state.no}번 ${
										this.props.location.state.type == 'desk'
											? '좌석'
											: this.props.location.state.type == 'locker'
											? '락커'
											: ''
								  } 이용내역`
								: ''
							: ''}
					</Typography>

					{/* 회원 상세정보 */}

					{this.props.location.state && this.props.location.state.type ? (
						''
					) : (
						<AppBar position="static" color="default">
							<Tabs
								value={this.state.tabIndex}
								onChange={this.handleTabChange}
								indicatorColor="primary"
								textColor="primary"
								fullWidth
							>
								<Tab label="좌석" />
								<Tab label="스터디룸" />
								<Tab label="락커" />
								<Tab label="기록" />
							</Tabs>
						</AppBar>
					)}
					<SwipeableViews
						disabled={true}
						axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
						index={this.state.tabIndex}
						onChangeIndex={(tabIndex) => this.setState({ tabIndex })}
					>
						<TabContainer dir={theme.direction}>
							<div className="row">
								<div className={classNames('col-xs-12 col-sm-9 col-md-9 col-lg-9', scss.date_div)}>
									<div className="btn-group btn-group-sm" role="group">
										<TextField
											id="date"
											type="date"
											style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
											className={'sales_dateselect'}
											InputLabelProps={{
												shrink: false
											}}
											value={this.state.firstDate1}
											onChange={this.handleChange('firstDate1')}
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
											value={this.state.lastDate1}
											onChange={this.handleChange('lastDate1')}
										/>
										<Button
											variant="outlined"
											color="default"
											className={classNames('sales_datebtn', scss.searchBtn)}
											onClick={() =>
												this.loadData('desk', this.props.location.state && this.props.location.state.key, 'clear')
											}
										>
											조회
										</Button>

										<Button
											variant="outlined"
											size="small"
											className={scss.xslBtn}
											onClick={() => this.xslDownload('desk', 0)}
										>
											엑셀 다운로드
										</Button>
										<div>
											<div></div>
										</div>
									</div>
								</div>
								<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
									<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
										<input
											className="form-control "
											type="text"
											placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, 없을시 전화번호'}
											value={this.state.searchValue1}
											onChange={this.handleChange('searchValue1')}
											onKeyDown={(event) => this.onKeyDown(event, 'desk')}
											style={{ zIndex: '0' }}
										></input>
										<span className="input-group-btn">
											<button className="btn btn-default" onClick={this.onSearch.bind(this, 'desk')}>
												검색
											</button>
										</span>
									</div>
								</div>
							</div>
							<BootstrapTable
								data={usageList.desk}
								options={options}
								// search
								// keyBoardNav
								// pagination
								hover
								className={'study_place_bs'}
							>
								<TableHeaderColumn dataField="seq" isKey searchable={false} width="60px">
									{/* Seq */}
									{this.orderCheck('seq', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="memberName" width="76px">
									{/* 이름 */}
									{this.orderCheck('member.name', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="memberPhone"
									width="100px"
									dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
								>
									{/* 전화번호 */}
									{this.orderCheck('member.phone', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="deskNo" width="60px">
									{/* 좌석번호 */}
									{this.orderCheck('deskNo', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="deskType"
									searchable={false}
									width="90px"
									dataFormat={(cell) =>
										cell == 'open'
											? '오픈형'
											: cell == 'semi'
											? '반폐쇄형'
											: cell == 'close'
											? '폐쇄형'
											: cell == 'round'
											? '오피스형'
											: cell == 'sofa'
											? '라운지형'
											: cell == 'dual'
											? '2인형'
											: cell
									}
								>
									{/* 좌석타입 */}
									{this.orderCheck('deskType', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="timeType"
									searchable={false}
									width="90px"
									dataFormat={(cell) =>
										cell == 'time'
											? '1회권'
											: cell == 'char'
											? '충전권'
											: cell == 'free'
											? '자유석'
											: cell == 'day'
											? '지정석'
											: cell == 'real'
											? '실시간'
											: cell
									}
								>
									{/* 이용타입 */}
									{this.orderCheck('timeType', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="productName"
									searchable={false}
									dataAlign="left"
									width="180px"
									dataFormat={(cell, row) => (row.isCanceled == true ? <s>{cell}</s> : cell)}
								>
									{/* 이용권 */}
									{this.orderCheck('product.name', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="startDT"
									searchable={false}
									width="110px"
									dataFormat={(cell) => moment(cell).format('M/D HH:mm')}
								>
									{/* 시작일시 */}
									{this.orderCheck('startDT', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="endDT"
									searchable={false}
									width="110px"
									dataFormat={(cell) => (cell ? moment(cell).format('M/D HH:mm') : '-')}
								>
									{/* 종료일시 */}
									{this.orderCheck('endDT', 'desk')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="extendCount"
									searchable={false}
									width="60px"
									dataFormat={(cell) => (cell > 0 ? cell + '회' : '')}
								>
									연장
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="isExit"
									searchable={false}
									width="60px"
									dataFormat={(cell) => (cell == true ? '퇴실' : '')}
								>
									퇴실
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="isCanceled"
									searchable={false}
									width="60px"
									dataFormat={(cell) => (cell == true ? '취소' : '')}
								>
									취소
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="mdate"
									searchable={false}
									width="94px"
									dataFormat={(cell) => moment(cell).format('M/D HH:mm')}
								>
									{/* 수정일시 */}
									{this.orderCheck('mdate', 'desk')}
								</TableHeaderColumn>
							</BootstrapTable>
							<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
								{[10, 25, 50].map((n, idx) => {
									const isActive = n === this.state.sizePerPage ? 'active' : null
									return (
										<button
											key={idx}
											type="button"
											style={{ margin: md.mobile() ? '10px 0 0' : '20px 0' }}
											className={`btn ${isActive}`}
											onClick={() => this.changeSizePerPage(n, 'desk')}
										>
											{n}
										</button>
									)
								})}
								<div
									style={{ float: 'right', width: md.mobile() ? '100%' : null, textAlign: md.mobile() ? 'right' : null }}
								>
									<Pagination
										activePage={this.state.activePage1}
										itemsCountPerPage={this.state.sizePerPage1}
										totalItemsCount={this.state.listTotal1}
										pageRangeDisplayed={5}
										onChange={(event) => this.handlePageChange(event, 'desk')}
									/>
								</div>
							</div>
						</TabContainer>
						<TabContainer dir={theme.direction}>
							<div className="row">
								<div className={classNames('col-xs-12 col-sm-9 col-md-9 col-lg-9', scss.date_div)}>
									<div className="btn-group btn-group-sm" role="group">
										<TextField
											id="date"
											type="date"
											style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
											className={'sales_dateselect'}
											InputLabelProps={{
												shrink: false
											}}
											value={this.state.firstDate2}
											onChange={this.handleChange('firstDate2')}
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
											value={this.state.lastDate2}
											onChange={this.handleChange('lastDate2')}
										/>
										<Button
											variant="outlined"
											color="default"
											className={classNames('sales_datebtn', scss.searchBtn)}
											onClick={() =>
												this.loadData('room', this.props.location.state && this.props.location.state.key, 'clear')
											}
										>
											조회
										</Button>

										<Button
											variant="outlined"
											size="small"
											className={scss.xslBtn}
											onClick={() => this.xslDownload('room', 1)}
										>
											엑셀 다운로드
										</Button>
										<div>
											<div></div>
										</div>
									</div>
								</div>
								<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
									<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
										<input
											className="form-control "
											type="text"
											placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, 없을시 전화번호'}
											value={this.state.searchValue2}
											onChange={this.handleChange('searchValue2')}
											onKeyDown={(event) => this.onKeyDown(event, 'room')}
											style={{ zIndex: '0' }}
										></input>
										<span className="input-group-btn">
											<button className="btn btn-default" onClick={this.onSearch.bind(this, 'room')}>
												검색
											</button>
										</span>
									</div>
								</div>
							</div>
							<BootstrapTable
								data={usageList.room}
								options={options}
								// search
								// keyBoardNav
								// pagination
								hover
								className={'study_place_bs'}
							>
								<TableHeaderColumn dataField="seq" isKey searchable={false} width="60px">
									{/* Seq */}
									{this.orderCheck('seq', 'room')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="memberName" width="76px">
									{/* 이름 */}
									{this.orderCheck('member.name', 'room')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="memberPhone"
									width="110px"
									dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
								>
									{/* 전화번호 */}
									{this.orderCheck('member.phone', 'room')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="roomName"
									searchable={false}
									dataAlign="left"
									width="180px"
									dataFormat={(cell, row) => (row.isCanceled == true ? <s>{cell}</s> : cell)}
								>
									{/* 스터디룸 */}
									{this.orderCheck('room.name', 'room')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="startDT"
									searchable={false}
									width="110px"
									dataFormat={(cell) => moment(cell).format('M/D HH:mm')}
								>
									{/* 시작일시 */}
									{this.orderCheck('startDT', 'room')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="endDT"
									searchable={false}
									width="110px"
									dataFormat={(cell) => moment(cell).format('M/D HH:mm')}
								>
									{/* 종료일시 */}
									{this.orderCheck('endDT', 'room')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="extendCount"
									searchable={false}
									width="60px"
									dataFormat={(cell) => (cell > 0 ? cell + '회' : '')}
								>
									연장
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="isExit"
									searchable={false}
									width="60px"
									dataFormat={(cell) => (cell == true ? '퇴실' : '')}
								>
									퇴실
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="isCanceled"
									searchable={false}
									width="60px"
									dataFormat={(cell) => (cell == true ? '취소' : '')}
								>
									취소
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="mdate"
									searchable={false}
									width="94px"
									dataFormat={(cell) => moment(cell).format('M/D HH:mm')}
								>
									{/* 수정일시 */}
									{this.orderCheck('mdate', 'room')}
								</TableHeaderColumn>
							</BootstrapTable>
							<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
								{[10, 25, 50].map((n, idx) => {
									const isActive = n === this.state.sizePerPage ? 'active' : null
									return (
										<button
											key={idx}
											type="button"
											style={{ margin: md.mobile() ? '10px 0 0' : '20px 0' }}
											className={`btn ${isActive}`}
											onClick={() => this.changeSizePerPage(n, 'room')}
										>
											{n}
										</button>
									)
								})}
								<div
									style={{ float: 'right', width: md.mobile() ? '100%' : null, textAlign: md.mobile() ? 'right' : null }}
								>
									<Pagination
										activePage={this.state.activePage2}
										itemsCountPerPage={this.state.sizePerPage2}
										totalItemsCount={this.state.listTotal2}
										pageRangeDisplayed={5}
										onChange={(event) => this.handlePageChange(event, 'room')}
									/>
								</div>
							</div>
						</TabContainer>
						<TabContainer dir={theme.direction}>
							<div className="row">
								<div className={classNames('col-xs-12 col-sm-9 col-md-9 col-lg-9', scss.date_div)}>
									<div className="btn-group btn-group-sm" role="group">
										<TextField
											id="date"
											type="date"
											style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
											className={'sales_dateselect'}
											InputLabelProps={{
												shrink: false
											}}
											value={this.state.firstDate3}
											onChange={this.handleChange('firstDate3')}
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
											value={this.state.lastDate3}
											onChange={this.handleChange('lastDate3')}
										/>
										<Button
											variant="outlined"
											color="default"
											className={classNames('sales_datebtn', scss.searchBtn)}
											onClick={() =>
												this.loadData('locker', this.props.location.state && this.props.location.state.key, 'clear')
											}
										>
											조회
										</Button>

										<Button
											variant="outlined"
											size="small"
											className={scss.xslBtn}
											onClick={() => this.xslDownload('locker', 2)}
										>
											엑셀 다운로드
										</Button>
										<div>
											<div></div>
										</div>
									</div>
								</div>
								<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
									<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
										<input
											className="form-control "
											type="text"
											placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, 없을시 전화번호'}
											value={this.state.searchValue3}
											onChange={this.handleChange('searchValue3')}
											onKeyDown={(event) => this.onKeyDown(event, 'locker')}
											style={{ zIndex: '0' }}
										></input>
										<span className="input-group-btn">
											<button className="btn btn-default" onClick={this.onSearch.bind(this, 'locker')}>
												검색
											</button>
										</span>
									</div>
								</div>
							</div>
							<BootstrapTable
								data={usageList.locker}
								options={options}
								// search
								// keyBoardNav
								// pagination
								hover
								className={'study_place_bs'}
							>
								<TableHeaderColumn dataField="seq" isKey searchable={false} width="60px">
									{/* Seq */}
									{this.orderCheck('seq', 'locker')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="memberName" width="76px">
									{/* 이름 */}
									{this.orderCheck('member.name', 'locker')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="memberPhone"
									width="100px"
									dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
								>
									{/* 전화번호 */}
									{this.orderCheck('member.phone', 'locker')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="lockerNo" width="90px">
									{/* 락커번호 */}
									{this.orderCheck('lockerNo', 'locker')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="productName"
									searchable={false}
									dataAlign="left"
									width="180px"
									dataFormat={(cell, row) => (row.isCanceled == true ? <s>{cell}</s> : cell)}
								>
									{/* 이용권 */}
									{this.orderCheck('product.name', 'locker')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="startDT"
									searchable={false}
									width="110px"
									dataFormat={(cell) => moment(cell).format('M/D HH:mm')}
								>
									{/* 시작일시 */}
									{this.orderCheck('startDT', 'locker')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="endDT"
									searchable={false}
									width="110px"
									dataFormat={(cell) => moment(cell).format('M/D HH:mm')}
								>
									{/* 종료일시 */}
									{this.orderCheck('endDT', 'locker')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="isCanceled"
									searchable={false}
									width="60px"
									dataFormat={(cell) => (cell == true ? '취소' : '')}
								>
									취소
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="mdate"
									searchable={false}
									width="94px"
									dataFormat={(cell) => moment(cell).format('M/D HH:mm')}
								>
									{/* 수정일시 */}
									{this.orderCheck('mdate', 'locker')}
								</TableHeaderColumn>
							</BootstrapTable>
							<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
								{[10, 25, 50].map((n, idx) => {
									const isActive = n === this.state.sizePerPage ? 'active' : null
									return (
										<button
											key={idx}
											type="button"
											style={{ margin: md.mobile() ? '10px 0 0' : '20px 0' }}
											className={`btn ${isActive}`}
											onClick={() => this.changeSizePerPage(n, 'locker')}
										>
											{n}
										</button>
									)
								})}
								<div
									style={{ float: 'right', width: md.mobile() ? '100%' : null, textAlign: md.mobile() ? 'right' : null }}
								>
									<Pagination
										activePage={this.state.activePage3}
										itemsCountPerPage={this.state.sizePerPage3}
										totalItemsCount={this.state.listTotal3}
										pageRangeDisplayed={5}
										onChange={(event) => this.handlePageChange(event, 'locker')}
									/>
								</div>
							</div>
						</TabContainer>
						<TabContainer dir={theme.direction}>
							<div className="row">
								<div className={classNames('col-xs-12 col-sm-9 col-md-9 col-lg-9', scss.date_div)}>
									<div className="btn-group btn-group-sm" role="group">
										<TextField
											id="date"
											type="date"
											style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
											className={'sales_dateselect'}
											InputLabelProps={{
												shrink: false
											}}
											value={this.state.firstDate4}
											onChange={this.handleChange('firstDate4')}
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
											value={this.state.lastDate4}
											onChange={this.handleChange('lastDate4')}
										/>
										<Button
											variant="outlined"
											color="default"
											className={classNames('sales_datebtn', scss.searchBtn)}
											onClick={() => this.fetchHistoryData()}
										>
											조회
										</Button>
									</div>
								</div>
								<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
									<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
										<input
											className="form-control "
											type="text"
											placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, 없을시 전화번호'}
											value={this.state.searchValue4}
											onChange={this.handleChange('searchValue4')}
											onKeyDown={(event) => this.onKeyDown(event, 'history')}
											style={{ zIndex: '0' }}
										></input>
										<span className="input-group-btn">
											<button className="btn btn-default" onClick={this.onSearch.bind(this, 'history')}>
												검색
											</button>
										</span>
									</div>
								</div>
							</div>
							<BootstrapTable data={historyList} options={options} hover className={'study_place_bs'} condensed={true}>
								<TableHeaderColumn dataField="seq" isKey={true} hidden={true} dataAlign="center">
									Seq
								</TableHeaderColumn>
								<TableHeaderColumn dataField="no" width="60px" dataAlign="center">
									{/* No */}
									{this.orderCheck('seq', 'history')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="userName" width="80px" dataAlign="center">
									{/* 유저 */}
									{this.orderCheck('userName', 'history')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="userPhone"
									width="94px"
									dataAlign="center"
									dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
								>
									{/* 전화번호 */}
									{this.orderCheck('userPhone', 'history')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="action" width="110px" dataAlign="center">
									{/* 행동 */}
									{this.orderCheck('action', 'history')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="memo" width="200px" dataAlign="center">
									{/* 내용 */}
									{this.orderCheck('memo', 'history')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="wdate" width="100px" dataAlign="center">
									{/* 발생시간 */}
									{this.orderCheck('wdate', 'history')}
								</TableHeaderColumn>
							</BootstrapTable>
							<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
								{[10, 25, 50].map((n, idx) => {
									const isActive = n === this.state.sizePerPage4 ? 'active' : null
									return (
										<button
											key={idx}
											type="button"
											style={{ margin: md.mobile() ? '10px 0 0' : '20px 0' }}
											className={`btn ${isActive}`}
											onClick={() => this.changeSizePerPage(n, 'history')}
										>
											{n}
										</button>
									)
								})}
								<div
									style={{ float: 'right', width: md.mobile() ? '100%' : null, textAlign: md.mobile() ? 'right' : null }}
								>
									<Pagination
										activePage={this.state.activePage4}
										itemsCountPerPage={this.state.sizePerPage4}
										totalItemsCount={this.state.listTotal4}
										pageRangeDisplayed={5}
										onChange={(event) => this.handlePageChange(event, 'history')}
									/>
								</div>
							</div>
						</TabContainer>
					</SwipeableViews>
				</div>
			</div>
		)
	}
}

UsageList.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(UsageList)
