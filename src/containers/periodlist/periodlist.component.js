import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './periodlist.theme.style'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import AddDialog from './addDialog'
import EditDialog from './editDialog'
import RefundDialog from './refundDialog'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import scss from './periodlist.module.scss'
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent)

function Loading({ visible }) {
	if (!visible) return null

	return (
		<div
			style={{
				position: 'absolute',
				display: 'flex',
				width: '100%',
				height: '100%',
				top: 0,
				left: 0,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgba(0,0,0,0.4)'
			}}
		>
			<span
				style={{
					fontSize: '1.5rem',
					color: 'white'
				}}
			>
				Loading...
			</span>
		</div>
	)
}

function TabContainer(props) {
	const { children, dir } = props

	return (
		<Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
			{children}
		</Typography>
	)
}

class PeriodList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			tabIndex: 0,
			periodList_free: [],
			periodList_day: [],
			periodList_char: [],
			memberInfo: null,
			timeType: 'free',

			activePage1: 1,
			listTotal1: 0,
			sizePerPage1: 10,
			searchValue1: '',
			searchData1: '',
			defaultOrder1: 'seq',
			order1: 'desc',
			includeAllUsage1: false,

			activePage2: 1,
			listTotal2: 0,
			sizePerPage2: 10,
			searchValue2: '',
			searchData2: '',
			defaultOrder2: 'seq',
			order2: 'desc',
			includeAllUsage2: false,

			activePage3: 1,
			listTotal3: 0,
			sizePerPage3: 10,
			searchValue3: '',
			searchData3: '',
			defaultOrder3: 'seq',
			order3: 'desc',
			includeAllUsage3: false
		}
	}

	componentDidMount = () => {
		this.loadData()
	}

	loadData = async (searchValue) => {
		let _search = ''
		searchValue ? await this.setState({ activePage: 1 }) : null
		if (this.state.timeType === 'free') {
			_search = this.state.searchData1 ? this.state.searchData1 : null
		} else if (this.state.timeType === 'day') {
			_search = this.state.searchData2 ? this.state.searchData2 : null
		} else if (this.state.timeType === 'char') {
			_search = this.state.searchData3 ? this.state.searchData3 : null
		}

		this.setState({ loading: true })
		let url = this.state.timeType === 'char' ? '/desk/usage/char/list' : '/desk/usage/period/list'
		axios
			.get(url, {
				headers: { 'Content-type': 'application/json' },
				params: {
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
					timeType: this.state.timeType,
					page:
						this.state.timeType === 'free'
							? this.state.activePage1
							: this.state.timeType === 'day'
							? this.state.activePage2
							: this.state.timeType === 'char'
							? this.state.activePage3
							: null,
					perPage:
						this.state.timeType === 'free'
							? this.state.sizePerPage1
							: this.state.timeType === 'day'
							? this.state.sizePerPage2
							: this.state.timeType === 'char'
							? this.state.sizePerPage3
							: null,
					search: _search,
					orderBy:
						this.state.timeType === 'free'
							? this.state.defaultOrder1
							: this.state.timeType === 'day'
							? this.state.defaultOrder2
							: this.state.timeType === 'char'
							? this.state.defaultOrder3
							: null,
					align:
						this.state.timeType === 'free'
							? this.state.order1
							: this.state.timeType === 'day'
							? this.state.order2
							: this.state.timeType === 'char'
							? this.state.order3
							: null,
					isAllUsage:
						this.state.timeType === 'free'
							? this.state.includeAllUsage1 || ''
							: this.state.timeType === 'day'
							? this.state.includeAllUsage2 || ''
							: this.state.timeType === 'char'
							? this.state.includeAllUsage3 || ''
							: null
				}
			})
			.then((res) => {
				let _periodList = res.data.list // && res.data.list.filter(data => data.product !== null)
				const periodList =
					_periodList &&
					_periodList.map((el) => {
						return {
							...el,
							memberName: el.member.name,
							memberPhone: el.member.phone,
							productName: el.product ? el.product.name : '????????????',
							roomName: el.room ? el.room.name : ''
						}
					})
				if (this.state.timeType === 'free') {
					this.setState({ periodList_free: periodList, listTotal1: res.data.total })
				} else if (this.state.timeType === 'char') {
					this.setState({ periodList_char: periodList, listTotal3: res.data.total })
				} else {
					this.setState({ periodList_day: periodList, listTotal2: res.data.total })
				}
			})
			.catch((error) => {
				console.error(error)
			})
			.finally(() => {
				this.setState({ loading: false })
			})
	}

	xslDownload = async () => {
		if (this.state.firstDate === '' || this.state.firstDate === null || this.state.lastDate === '' || this.state.lastDate === null) {
			this.alertMessage('??????', '????????? ??????????????????.', 'danger')
			return
		}
		let _search = ''
		if (this.state.timeType === 'free') {
			_search = this.state.searchData1 ? this.state.searchData1 : null
		} else if (this.state.timeType === 'day') {
			_search = this.state.searchData2 ? this.state.searchData2 : null
		} else if (this.state.timeType === 'char') {
			_search = this.state.searchData3 ? this.state.searchData3 : null
		}

		const FILEPATH =
			'/desk/usage/period/xls' +
			'?placeSeq=' +
			JSON.parse(localStorage.getItem('manager_place')).seq +
			'&timeType=' +
			this.state.timeType
		'&search=' + _search
		await axios
			.get(FILEPATH, { responseType: 'blob' })
			.then((res) => {
				const url = window.URL.createObjectURL(new Blob([res.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', `${FILEPATH}` + '.xls')
				document.body.appendChild(link)
				link.click()
				link.remove()
			})
			.catch((error) => console.error(error))
	}

	sendGroupSMS = (list = []) => {
		if (!md.mobile()) {
			alert('?????????????????? ????????? ???????????????.')
			return
		} else if (!list || list.length == 0) {
			alert('?????? ????????? ????????????.')
			return
		}
		const agent = window.navigator.userAgent.toLowerCase()
		let link = 'sms:'
		if (agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) {
			link += '//open?addresses='
		}
		list.forEach((el) => {
			link += el.member ? el.member.phone + ',' : ''
		})
		window.location.href = link
	}

	changeSizePerPage = (n) => {
		if (this.state.timeType === 'free') {
			this.setState({ activePage1: 1, sizePerPage1: n })
		} else if (this.state.timeType === 'day') {
			this.setState({ activePage2: 1, sizePerPage2: n })
		} else if (this.state.timeType === 'char') {
			this.setState({ activePage3: 1, sizePerPage3: n })
		}
		setTimeout(() => {
			this.loadData()
		}, 100)
	}

	handlePageChange(pageNumber) {
		if (this.state.timeType === 'free') {
			this.setState({ activePage1: pageNumber })
		} else if (this.state.timeType === 'day') {
			this.setState({ activePage2: pageNumber })
		} else if (this.state.timeType === 'char') {
			this.setState({ activePage3: pageNumber })
		}
		setTimeout(() => {
			this.loadData()
		}, 100)
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	handleChangeTab = async (event, value, key = null) => {
		this.setState({ tabIndex: value })
		if (value == 0) {
			await this.setState({ timeType: 'free' })
			if (this.state.periodList_free.length === 0) this.loadData()
		} else if (value == 1) {
			await this.setState({ timeType: 'day' })
			if (this.state.periodList_day.length === 0) this.loadData()
		} else if (value == 2) {
			await this.setState({ timeType: 'char' })
			if (this.state.periodList_char.length === 0) this.loadData()
		}
	}

	checkedChange = (name) => (event) => {
		this.setState({
			[name]: event.target.checked
		})
		setTimeout(() => {
			this.loadData()
		}, 100)
	}

	handleChangeIndex = (index) => {
		this.setState({ tabIndex: index })
	}

	//Dialog Close Event
	closeEvent = (data, message) => {
		if (!data) return
		else if (data === 'check') {
			this.alertMessage('??????', '???????????? ?????? ?????? 0?????? ??????????????????.', 'danger')
		} else if (data === 'refund') {
			this.alertMessage('??????', '?????? ???????????????', 'success')
			this.loadData()
		} else if (data === 'edit') {
			this.alertMessage('??????', '?????? ???????????????', 'success')
			this.loadData()
		} else if (data === 'finish') {
			this.alertMessage('??????', '???????????? ???????????????', 'success')
			this.loadData()
		} else if (data === 'deskUse') {
			this.alertMessage('??????', '?????? ???????????????', 'success')
			this.loadData()
		} else {
			this.alertMessage('??????', message, 'danger')
		}
	}

	//?????? ??????
	addNewPeriod = () => {
		document.getElementById('addDialog_btn').click() //??? ?????? ??????
	}

	//?????? ?????? Click Event
	onClickEdit(row) {
		if (this.state.timeType === 'free') {
			this.setState({ memberInfo: this.state.periodList_free.filter((data) => data.seq === row['seq']) })
		} else if (this.state.timeType === 'day') {
			this.setState({ memberInfo: this.state.periodList_day.filter((data) => data.seq === row['seq']) })
		} else if (this.state.timeType === 'char') {
			this.setState({ memberInfo: this.state.periodList_char.filter((data) => data.seq === row['seq']) })
		}
		document.getElementById('editDialog_btn').click()
	}

	//?????? ?????? Click Event
	onClickRefund(row) {
		if (this.state.timeType === 'free') {
			this.setState({ memberInfo: this.state.periodList_free.filter((data) => data.seq === row['seq']) })
		} else if (this.state.timeType === 'day') {
			this.setState({ memberInfo: this.state.periodList_day.filter((data) => data.seq === row['seq']) })
		} else if (this.state.timeType === 'char') {
			this.setState({ memberInfo: this.state.periodList_char.filter((data) => data.seq === row['seq']) })
		}
		document.getElementById('refundDialog_btn').click()
	}

	cellButton(cell, row, enumObject, rowIndex) {
		return !row.endDT || moment(row.endDT).hour(23).minute(59).isAfter(moment()) ? (
			<div className={scss.button_div}>
				<Button variant="outlined" color="primary" className={scss.detail_btn} onClick={() => this.onClickEdit(row)}>
					??????
				</Button>
				{row.salesHistory ? (
					<Button variant="outlined" color="secondary" className={scss.detail_btn} onClick={() => this.onClickRefund(row)}>
						{row.salesHistory.payMethod === 'service' ? '????????????' : '??????'}
					</Button>
				) : (
					''
				)}
			</div>
		) : (
			''
		)
	}

	//Message ??????
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
		if (this.state.timeType === 'free') {
			await this.setState({ searchData1: this.state.searchValue1, activePage1: 1 })
			await this.loadData(this.state.searchValue1 ? this.state.searchValue1 : 'clear')
		} else if (this.state.timeType === 'day') {
			await this.setState({ searchData2: this.state.searchValue2, activePage2: 1 })
			await this.loadData(this.state.searchValue2 ? this.state.searchValue2 : 'clear')
		} else if (this.state.timeType === 'char') {
			await this.setState({ searchData3: this.state.searchValue3, activePage3: 1 })
			await this.loadData(this.state.searchValue3 ? this.state.searchValue3 : 'clear')
		}
	}

	dataSort = async (dataField) => {
		if (this.state.timeType === 'free') {
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
		} else if (this.state.timeType === 'day') {
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
		} else if (this.state.timeType === 'char') {
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
		}
		this.loadData()
	}

	orderCheck = (value) => {
		if (this.state.timeType === 'free') {
			if (value === this.state.defaultOrder1) {
				return (
					<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '??????'
							: value === 'member.phone'
							? '????????????'
							: value === 'product.name'
							? '?????????'
							: value === 'startDT'
							? '?????????'
							: value === 'endDT'
							? '?????????'
							: value}
						<span className={classNames('order', this.state.order1 === 'asc' ? 'dropup' : '')}>
							<span className="caret" style={{ margin: '10px 5px' }}></span>
						</span>
					</div>
				)
			} else {
				return (
					<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '??????'
							: value === 'member.phone'
							? '????????????'
							: value === 'product.name'
							? '?????????'
							: value === 'startDT'
							? '?????????'
							: value === 'endDT'
							? '?????????'
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
		} else if (this.state.timeType === 'day') {
			if (value === this.state.defaultOrder2) {
				return (
					<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '??????'
							: value === 'member.phone'
							? '????????????'
							: value === 'product.name'
							? '?????????'
							: value === 'deskNo'
							? '????????????'
							: value === 'startDT'
							? '?????????'
							: value === 'endDT'
							? '?????????'
							: value}
						<span className={classNames('order', this.state.order2 === 'asc' ? 'dropup' : '')}>
							<span className="caret" style={{ margin: '10px 5px' }}></span>
						</span>
					</div>
				)
			} else {
				return (
					<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '??????'
							: value === 'member.phone'
							? '????????????'
							: value === 'product.name'
							? '?????????'
							: value === 'deskNo'
							? '????????????'
							: value === 'startDT'
							? '?????????'
							: value === 'endDT'
							? '?????????'
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
		} else if (this.state.timeType === 'char') {
			if (value === this.state.defaultOrder3) {
				return (
					<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '??????'
							: value === 'member.phone'
							? '????????????'
							: value === 'product.name'
							? '?????????'
							: value === 'startDT'
							? '????????????'
							: value === 'endDT'
							? '????????????'
							: value === 'validEndDate'
							? '????????????'
							: value}
						<span className={classNames('order', this.state.order3 === 'asc' ? 'dropup' : '')}>
							<span className="caret" style={{ margin: '10px 5px' }}></span>
						</span>
					</div>
				)
			} else {
				return (
					<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
						{value === 'seq'
							? 'Seq'
							: value === 'member.name'
							? '??????'
							: value === 'member.phone'
							? '????????????'
							: value === 'product.name'
							? '?????????'
							: value === 'startDT'
							? '????????????'
							: value === 'endDT'
							? '????????????'
							: value === 'validEndDate'
							? '????????????'
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
		const periodList_free = this.state.periodList_free
		const periodList_day = this.state.periodList_day
		const periodList_char = this.state.periodList_char
		const options = {
			defaultSortName: 'seq', // default sort column name
			// defaultSortOrder: 'desc', // default sort order
			// clearSearch: true,
			// clearSearchBtn: this.createCustomClearButton,
			// searchField: this.createCustomSearchField,
			// sizePerPageDropDown: this.renderSizePerPageDropDown,
			// insertBtn: this.createCustomInsertButton,
			noDataText: '????????? ??????'
		}
		return (
			<div
				id="main"
				className={scss.main}
				style={{ minWidth: md.mobile() ? '100%' : null, maxWidth: md.tablet() ? '700px' : null, margin: md.mobile() ? '0' : null }}
			>
				<ReactNotifications />
				<div>
					<AppBar position="static" color="default">
						<Tabs
							value={this.state.tabIndex}
							onChange={this.handleChangeTab}
							indicatorColor="primary"
							textColor="primary"
							fullWidth
						>
							<Tab label="?????????" />
							<Tab label="?????????" />
							<Tab label="?????????" />
						</Tabs>
					</AppBar>
					<SwipeableViews
						disabled={true}
						axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
						index={this.state.tabIndex}
						onChangeIndex={this.handleChangeIndex}
					>
						<TabContainer dir={theme.direction}>
							<div className="row">
								<div className="col-xs-6 col-sm-3 col-md-3 col-lg-7">
									<div className="btn-group btn-group-sm" role="group">
										<Button variant="outlined" size="small" onClick={() => this.xslDownload()}>
											?????? ????????????
										</Button>
										<Button
											variant="outlined"
											size="small"
											className={scss.xslBtn}
											style={{ marginLeft: '10px' }}
											onClick={() => this.sendGroupSMS(this.state.periodList_free)}
										>
											????????????
										</Button>
									</div>
								</div>
								<div className="col-xs-6 col-sm-3 col-md-3 col-lg-2" style={{ marginTop: '-10px' }}>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.includeAllUsage1}
												onChange={this.checkedChange('includeAllUsage1')}
												name="includeAllUsage1"
												color="primary"
											/>
										}
										label="???????????? ??????"
									/>
								</div>
								<div className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
									<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
										<input
											className="form-control "
											type="text"
											placeholder={md.mobile() ? '?????? & ????????????' : '????????????, ????????? ????????????'}
											value={this.state.searchValue1}
											onChange={this.handleChange('searchValue1')}
											onKeyDown={(event) => this.onKeyDown(event)}
											style={{ zIndex: '0' }}
										></input>
										<span className="input-group-btn">
											<button className="btn btn-default" onClick={this.onSearch.bind(this)}>
												??????
											</button>
										</span>
									</div>
								</div>
							</div>
							<BootstrapTable
								data={periodList_free}
								options={options}
								// insertRow={true}
								// search
								// keyBoardNav
								// pagination
								hover
								className="study_place_bs"
							>
								<TableHeaderColumn dataField="seq" isKey={true} width="50px" dataAlign="center">
									{this.orderCheck('seq')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="memberName" width="60px">
									{this.orderCheck('member.name')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="memberPhone"
									width="110px"
									dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
								>
									{this.orderCheck('member.phone')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="productName" width="200px" dataAlign="center">
									{/* ????????? */}
									{this.orderCheck('product.name')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="startDT"
									width="100px"
									// dataSort
									searchable={false}
									dataFormat={(cell, row) => moment(row.startDT).format('YYYY/MM/DD')}
								>
									{/* ????????? */}
									{this.orderCheck('startDT')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="endDT"
									width="100px"
									// dataSort
									searchable={false}
									dataFormat={(cell, row) => moment(row.endDT).format('YYYY/MM/DD')}
								>
									{/* ????????? */}
									{this.orderCheck('endDT')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="recentDate"
									width="100px"
									searchable={false}
									dataFormat={(cell, row) =>
										row.deskUsage && row.deskUsage.recentDate
											? moment(row.deskUsage.recentDate).format('YYYY/MM/DD')
											: ''
									}
								>
									???????????????
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="extendCount"
									width="60px"
									searchable={false}
									dataFormat={(cell, row) => (row.extendCount ? row.extendCount + '???' : '-')}
								>
									????????????
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="button"
									width="120px"
									dataFormat={this.cellButton.bind(this)}
									style={{ padding: '0px' }}
								></TableHeaderColumn>
							</BootstrapTable>
							<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
								{[10, 20, 50, 100].map((n, idx) => {
									const isActive = n === this.state.sizePerPage1 ? 'active' : null
									return (
										<button
											key={idx}
											type="button"
											style={{ margin: md.mobile() ? '10px 0 0' : '20px 0' }}
											className={`btn ${isActive}`}
											onClick={() => this.changeSizePerPage(n)}
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
										onChange={(event) => this.handlePageChange(event)}
									/>
								</div>
							</div>
							<div className="text-center">
								<Button
									variant="raised"
									size="large"
									color="primary"
									style={{ color: 'white' }}
									onClick={this.addNewPeriod}
								>
									?????? ??????
								</Button>
							</div>
						</TabContainer>
						<TabContainer dir={theme.direction}>
							<div className="row">
								<div className="col-xs-6 col-sm-3 col-md-3 col-lg-7">
									<div className="btn-group btn-group-sm" role="group">
										<Button variant="outlined" size="small" onClick={() => this.xslDownload()}>
											?????? ????????????
										</Button>
										<Button
											variant="outlined"
											size="small"
											className={scss.xslBtn}
											style={{ marginLeft: '10px' }}
											onClick={() => this.sendGroupSMS(this.state.periodList_day)}
										>
											????????????
										</Button>
									</div>
								</div>
								<div className="col-xs-6 col-sm-3 col-md-3 col-lg-2" style={{ marginTop: '-10px' }}>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.includeAllUsage2}
												onChange={this.checkedChange('includeAllUsage2')}
												name="includeAllUsage2"
												color="primary"
											/>
										}
										label="???????????? ??????"
									/>
								</div>
								<div className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
									<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
										<input
											className="form-control "
											type="text"
											placeholder={md.mobile() ? '?????? & ????????????' : '????????????, ????????? ????????????'}
											value={this.state.searchValue2}
											onChange={this.handleChange('searchValue2')}
											onKeyDown={(event) => this.onKeyDown(event)}
											style={{ zIndex: '0' }}
										></input>
										<span className="input-group-btn">
											<button className="btn btn-default" onClick={this.onSearch.bind(this)}>
												??????
											</button>
										</span>
									</div>
								</div>
							</div>
							<BootstrapTable
								data={periodList_day}
								options={options}
								// insertRow={true}
								// search
								// keyBoardNav
								// pagination
								hover
								className={'study_place_bs'}
							>
								<TableHeaderColumn dataField="seq" isKey={true} width="70px" dataAlign="center">
									{this.orderCheck('seq')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="memberName" width="70px">
									{this.orderCheck('member.name')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="memberPhone"
									width="110px"
									dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
								>
									{this.orderCheck('member.phone')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="productName" width="140px" dataAlign="center">
									{/* ????????? */}
									{this.orderCheck('product.name')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="deskNo" width="80px" dataAlign="center">
									{/* ????????? */}
									{this.orderCheck('deskNo')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="startDT"
									width="100px"
									// dataSort
									searchable={false}
									dataFormat={(cell, row) => moment(row.startDT).format('YYYY/MM/DD')}
								>
									{/* ????????? */}
									{this.orderCheck('startDT')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="endDT"
									width="100px"
									// dataSort
									searchable={false}
									dataFormat={(cell, row) => moment(row.endDT).format('YYYY/MM/DD')}
								>
									{/* ????????? */}
									{this.orderCheck('endDT')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="extendCount"
									width="60px"
									searchable={false}
									dataFormat={(cell, row) => (row.extendCount ? row.extendCount + '???' : '-')}
								>
									????????????
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="button"
									width="120px"
									dataFormat={this.cellButton.bind(this)}
									style={{ padding: '0px' }}
								></TableHeaderColumn>
							</BootstrapTable>
							<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
								{[10, 20, 50, 100].map((n, idx) => {
									const isActive = n === this.state.sizePerPage2 ? 'active' : null
									return (
										<button
											key={idx}
											type="button"
											style={{ margin: md.mobile() ? '10px 0 0' : '20px 0' }}
											className={`btn ${isActive}`}
											onClick={() => this.changeSizePerPage(n)}
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
										onChange={(event) => this.handlePageChange(event)}
									/>
								</div>
							</div>
							<div className="text-center">
								<Button
									variant="raised"
									size="large"
									color="primary"
									style={{ color: 'white' }}
									onClick={this.addNewPeriod}
								>
									?????? ??????
								</Button>
							</div>
						</TabContainer>
						<TabContainer dir={theme.direction}>
							<div className="row">
								<div className="col-xs-6 col-sm-3 col-md-3 col-lg-7">
									<div className="btn-group btn-group-sm" role="group">
										<Button variant="outlined" size="small" onClick={() => this.xslDownload()}>
											?????? ????????????
										</Button>
										<Button
											variant="outlined"
											size="small"
											className={scss.xslBtn}
											style={{ marginLeft: '10px' }}
											onClick={() => this.sendGroupSMS(this.state.periodList_char)}
										>
											????????????
										</Button>
									</div>
								</div>
								<div className="col-xs-6 col-sm-3 col-md-3 col-lg-2" style={{ marginTop: '-10px' }}>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.includeAllUsage3}
												onChange={this.checkedChange('includeAllUsage3')}
												name="includeAllUsage3"
												color="primary"
											/>
										}
										label="???????????? ??????"
									/>
								</div>
								<div className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
									<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
										<input
											className="form-control "
											type="text"
											placeholder={md.mobile() ? '?????? & ????????????' : '????????????, ????????? ????????????'}
											value={this.state.searchValue3}
											onChange={this.handleChange('searchValue3')}
											onKeyDown={(event) => this.onKeyDown(event)}
											style={{ zIndex: '0' }}
										></input>
										<span className="input-group-btn">
											<button className="btn btn-default" onClick={this.onSearch.bind(this)}>
												??????
											</button>
										</span>
									</div>
								</div>
							</div>
							<BootstrapTable
								data={periodList_char}
								options={options}
								// insertRow={true}
								// search
								// keyBoardNav
								// pagination
								hover
								className={'study_place_bs'}
							>
								<TableHeaderColumn dataField="seq" isKey={true} width="50px" dataAlign="center">
									{this.orderCheck('seq')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="memberName" width="60px">
									{this.orderCheck('member.name')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="memberPhone"
									width="90px"
									dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
								>
									{this.orderCheck('member.phone')}
								</TableHeaderColumn>
								<TableHeaderColumn dataField="productName" width="130px" dataAlign="center">
									{/* ????????? */}
									{this.orderCheck('product.name')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="startDT"
									width="100px"
									searchable={false}
									dataFormat={(cell, row) => moment(row.startDT).format('YY/M/D HH:mm')}
								>
									{/* ????????? */}
									{this.orderCheck('startDT')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="endDT"
									width="100px"
									searchable={false}
									dataFormat={(cell, row) => (row.endDT ? moment(row.endDT).format('YY/M/D HH:mm') : '-')}
								>
									{/* ????????? */}
									{this.orderCheck('endDT')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="validEndDate"
									width="80px"
									searchable={false}
									dataFormat={(cell, row) => (row.validEndDate ? moment(row.validEndDate).format('YY/MM/DD') : '-')}
								>
									{/* ???????????? */}
									{this.orderCheck('validEndDate')}
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="recentDate"
									width="70px"
									searchable={false}
									dataFormat={(cell, row) =>
										row.deskUsage && row.deskUsage.recentDate
											? moment(row.deskUsage.recentDate).format('YY/MM/DD')
											: '-'
									}
								>
									???????????????
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="registDate"
									width="70px"
									searchable={false}
									dataFormat={(cell, row) => {
										const total = +row.totalHour
										return (
											(row.totalHour >= 1 ? Math.floor(row.totalHour) + '??????' : '') +
											((row.totalHour * 100) % 100 > 0
												? Math.round(((row.totalHour * 100) % 100) * 0.6) + '???'
												: '') +
											(row.deskUsage && row.deskUsage.sumExtendCount > 0
												? `(${row.deskUsage.sumExtendCount}?????????)`
												: '')
										)
									}}
								>
									????????????
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="usedHour"
									width="70px"
									searchable={false}
									dataFormat={(cell, row) => {
										const minute = Math.round(((row.usedHour * 100) % 100) * 0.6)
										const hour = row.usedHour >= 1 ? Math.floor(row.usedHour) + '??????' : ''
										return hour ? hour + (minute === 0 ? '' : minute + '???') : minute ? minute + '???' : '-'
									}}
								>
									????????????
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="leftHour"
									width="70px"
									searchable={false}
									dataFormat={(cell, row) => {
										const time = +(row.totalHour - row.usedHour).toFixed(2)
										const generateTime = (time) => {
											const hour = Math.floor(time)
											const minute = Math.round(((time * 100) % 100) * 0.6)
											if (time > 0) {
												if (minute) {
													return `${hour}?????? ${minute}???`
												}
												return `${hour}??????`
											}
											if (minute === 0) {
												return '-'
											}
											return minute + '???'
										}
										return generateTime(time)
									}}
								>
									????????????
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="isCanceled"
									width="60px"
									searchable={false}
									dataFormat={(cell, row) =>
										row.usedHour * 1 >= row.totalHour * 1
											? '??????'
											: row.validEndDate && moment(row.validEndDate).isBefore(moment(), 'date')
											? '????????????'
											: row.endDT
											? '??????'
											: '?????????'
									}
								>
									??????
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="button"
									width="100px"
									dataFormat={this.cellButton.bind(this)}
									style={{ padding: '0px' }}
								></TableHeaderColumn>
							</BootstrapTable>
							<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
								{[10, 20, 50, 100].map((n, idx) => {
									const isActive = n === this.state.sizePerPage3 ? 'active' : null
									return (
										<button
											key={idx}
											type="button"
											style={{ margin: md.mobile() ? '10px 0 0' : '20px 0' }}
											className={`btn ${isActive}`}
											onClick={() => this.changeSizePerPage(n)}
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
										onChange={(event) => this.handlePageChange(event)}
									/>
								</div>
							</div>
							<div className="text-center">
								<Button
									variant="raised"
									size="large"
									color="primary"
									style={{ color: 'white' }}
									onClick={this.addNewPeriod}
								>
									?????? ??????
								</Button>
							</div>
						</TabContainer>
					</SwipeableViews>
				</div>
				<div className="hidden_">
					<AddDialog timeType={this.state.timeType} onClose={this.closeEvent} />
					<EditDialog
						className="hidden_"
						memberInfo={this.state.memberInfo}
						timeType={this.state.timeType}
						onClose={this.closeEvent}
					/>
					<RefundDialog
						className="hidden_"
						memberInfo={this.state.memberInfo}
						timeType={this.state.timeType}
						onClose={this.closeEvent}
					/>
				</div>
				<Loading visible={this.state.loading} />
			</div>
		)
	}
}

PeriodList.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(PeriodList)
