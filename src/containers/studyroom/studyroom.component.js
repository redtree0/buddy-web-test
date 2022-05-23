import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import MobileDetect from 'mobile-detect'
import axios from '../../wrapper/axios'
import moment from 'moment'
import ReserveDialog from './reserveDialog'
import EmptyDialog from './emptyDialog'
import { ReactNotifications, Store } from 'react-notifications-component'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import 'react-notifications-component/dist/theme.css'
import styles from './studyroom.theme.style'
import './calendar.css'
import { connect } from 'react-redux'
import { fetchRooms, setRooms } from 'reducers/room.reducer'
import withNavigation from 'components/withNavigation'

let today = new Date(),
	month = today.getMonth() + 1,
	year = today.getFullYear(),
	date = today.getDate(),
	days = ['일', '월', '화', '수', '목', '금', '토'],
	getToday = year + '-' + (String(month).length < 2 ? '0' + month : month) + '-' + (String(date).length < 2 ? '0' + date : date)

const md = new MobileDetect(window.navigator.userAgent)
const isEdge = window.navigator.userAgent.indexOf('Edge') != -1
const isIE = window.navigator.userAgent.indexOf('Trident') != -1 && !isEdge

class Studyroom extends React.Component {
	constructor(props) {
		super(props)
		this.scrollTopDiv = React.createRef()
		this.scrollDiv = React.createRef()

		this.state = {
			autoRefresh: false,
			updateTime: moment().format('H시 m분'),

			now: today,
			thisYear: year,
			thisMonth: month,
			thisDates: [],

			//API Data
			monthUsedCnt: null, //이번달 이용횟수
			monthUsedHour: null, //이번달 이용시간
			remainReservedCnt: null, //잔여 예약수
			remainReservedHour: null, //잔여 예약시간합계
			monthAllUsageByTime: [], //이번달 예약내역
			rooms: [], //시간표용 스터디룸A, 스터디룸B ...

			clickDate: null, //캘린더 날짜 클릭시 해당 날짜 저장용
			timeTalbleData: [], //시간표 세팅용 array
			reserveData: null, //Dialog 넘겨줄 예약 내용 저장용
			reserveRoomName: null, //Dialog 넘겨줄 스터디룸 name 저장용
			chargeType: null,
			minPerson: null,
			selectedTime: 0.5
		}
	}

	componentDidMount() {
		//로그인 여부 체크
		if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
			window.location.href = '/login'
			return
		}

		this._get_month()

		//오늘 날짜 기본 클릭
		setTimeout(() => {
			try {
				document.getElementsByClassName('today')[0].click()
			} catch (e) {
				console.log(e)
			}
		}, 1000)
	}

	componentDidUpdate() {
		//Update 될 때, .today, .click을 다시 찾아주지 않으면 기존에 있던 자리에 그대로 남아있게 된다.
		this._find_today()
		// this._click_date()
	}

	componentWillUnmount = () => {
		if (this.state.autoRefresh) {
			clearInterval(this.timer)
		}
	}

	//자동갱신 버튼 event
	SetautoRefresh = () => {
		if (this.state.autoRefresh) {
			this.setState({ autoRefresh: false })
			clearInterval(this.timer)
		} else {
			this.setState({
				autoRefresh: true,
				updateTime: moment().format('H시 m분')
			})
			this.timer = setInterval(this.startRefresh, 600000) //10분
		}
	}

	startRefresh = () => {
		this.loadData(this.state.thisYear, this.addZero(this.state.thisMonth))
		this.setState({
			updateTime: this.addZero(new Date().getHours(), 2) + ':' + this.addZero(new Date().getMinutes(), 2)
		})
	}

	FullScreen = () => {
		var doc = window.document
		var docEl = doc.getElementById('fullscreen_view')

		var requestFullScreen =
			docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
		var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

		if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl)
		} else {
			cancelFullScreen.call(doc)
		}
	}

	/**
	 * 설정 클릭 => Room Data local에 저장 후 설정 화면 이동
	 */
	roomSetting = async (url) => {
		await localStorage.setItem('rooms', JSON.stringify(this.state.rooms))
		this.props.navigate(`../${url}`)
	}

	/**
	 * Dialog Close Event
	 */
	closeEvent = (data) => {
		this.setState({ reserveData: null, reserveRoomName: null, chargeType: null, minPerson: null })
		if (!data) return
		else if (data.success) {
			this.alertMessage('알림.', '예약 되었습니다.', 'success')
			this.loadData(year, this.addZero(month))
			setTimeout(() => {
				document.getElementsByClassName('click')[0].click()
			}, 1000)
		} else if (data === 'cancel') {
			this.alertMessage('알림', '예약 취소 되었습니다.', 'success')
			this.loadData(year, this.addZero(month))
			setTimeout(() => {
				document.getElementsByClassName('click')[0].click()
			}, 1000)
		} else if (data.fail) {
			this.alertMessage('알림', data.msg || '에러가 발생하였습니다', 'danger')
		} else if (data === 'memberNmChk') {
			this.alertMessage('알림', '회원이름과 전화번호를 확인해주세요.', 'danger')
		} else if (data === 'message') {
			this.props.history.push('/chat/member')
		}
	}

	/**
	 * 예약석 클릭 => 예약 내용 Dialog
	 */
	reserveClick = (value) => {
		const roomFilter = this.state.rooms.filter((room) => room.seq === value.roomSeq)
		this.setState({ reserveData: value, reserveRoomName: roomFilter[0].name })
		document.getElementById('reserveDialog_btn').click()
	}

	/**
	 * 빈칸 클릭 => 예약 등록 Dialog
	 */
	emptyClick = (value) => {
		const roomFilter = this.state.rooms.filter((room) => room.seq === value.roomSeq)
		const { name, chargeType, timeUnit, minPerson } = roomFilter[0]
		this.setState({ reserveData: value, reserveRoomName: name, chargeType, minPerson, selectedTime: 0.5, timeUnit })
		document.getElementById('emptyDialog_btn').click()
	}

	/**
	 * Message 출력 용
	 */
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

	/**
	 * 캘린더 월 기준 데이터 load
	 */
	loadData = async (year, month) => {
		const placeSeq = JSON.parse(localStorage.getItem('manager_place')).seq
		// this.setState({
		//     monthUsedCnt : mock.monthUsedCnt,
		//     monthUsedHour: mock.monthUsedHour,
		//     remainReservedCnt : mock.remainReservedCnt,
		//     remainReservedHour : mock.remainReservedHour,
		//     monthAllUsageByTime : mock.monthAllUsageByTime,
		//     rooms : mock.rooms
		// })
		await axios
			.get('/room/' + placeSeq + '/usage/' + year + '/' + month)
			.then((res) => {
				this.props.setRooms(res.data.rooms)
				this.setState({
					monthUsedCnt: res.data.monthUsedCnt,
					monthUsedHour: res.data.monthUsedHour,
					remainReservedCnt: res.data.remainReservedCnt,
					remainReservedHour: res.data.remainReservedHour,
					monthAllUsageByTime: res.data.monthAllUsageByTime,
					rooms: res.data.rooms
				})
			})
			.catch((error) => console.error(error))
	}

	/**
	 * 캘린더 날짜 세팅
	 */
	_get_month = () => {
		const first = new Date(year, month - 1, 1),
			last = new Date(year, month, 0),
			dates = [],
			first_day = first.getDay(),
			last_day = last.getDay(),
			firstDate =
				first.getFullYear().toString() +
				'-' +
				this.addZero((first.getMonth() + 1).toString()) +
				'-' +
				this.addZero(first.getDate().toString()),
			lastDate =
				last.getFullYear().toString() +
				'-' +
				this.addZero((last.getMonth() + 1).toString()) +
				'-' +
				this.addZero(last.getDate().toString())
		// this.setState({
		// 	firstDate: firstDate,
		// 	lastDate: lastDate
		// })

		this.loadData(year, this.addZero(month))

		for (var be = first_day; be > 0; be--) {
			//첫째 주 이전 달 부분
			const be_newDate = new Date(year, month - 1, 1 - be),
				be_month = be_newDate.getMonth() + 1,
				be_date = be_newDate.getDate(),
				be_fulldate = year + '-' + this.addZero(be_month) + '-' + this.addZero(be_date)
			dates.push({ month: be_month, date: be_date, fulldate: be_fulldate })
		}
		for (var i = 1; i <= last.getDate(); i++) {
			// 이번달 부분
			const this_newDate = new Date(year, month - 1, i),
				this_month = this_newDate.getMonth() + 1,
				this_date = this_newDate.getDate(),
				this_fulldate = year + '-' + this.addZero(this_month) + '-' + this.addZero(this_date)
			dates.push({ month: this_month, date: this_date, fulldate: this_fulldate, include: true })
		}
		for (var af = 1; af < 7 - last_day; af++) {
			// 마지막 주 다음달 부분
			const af_newDate = new Date(year, month, af),
				af_month = af_newDate.getMonth() + 1,
				af_date = af_newDate.getDate(),
				af_fulldate = year + '-' + this.addZero(af_month) + '-' + this.addZero(af_date)
			dates.push({ month: af_month, date: af_date, fulldate: af_fulldate })
		}
		this.setState({
			thisYear: year,
			thisMonth: month,
			thisDates: dates,
			firstDate: firstDate,
			lastDate: lastDate
		})
	}

	/**
	 * 이전 달로 <
	 */
	_prev_month = () => {
		today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
		month = today.getMonth() + 1
		year = today.getFullYear()
		this._get_month()
		const list = document.querySelectorAll('.dates')
		for (var i = 0; i < list.length; i++) {
			list[i].classList.remove('click')
		}
	}

	/**
	 * 다음 달로 >
	 */
	_next_month = () => {
		today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
		month = today.getMonth() + 1
		year = today.getFullYear()
		this._get_month()
		const list = document.querySelectorAll('.dates')
		for (var i = 0; i < list.length; i++) {
			list[i].classList.remove('click')
		}
	}

	/**
	 * 이번 달로 다시 돌아가기 용
	 */
	_back_today = () => {
		today = new Date()
		month = today.getMonth() + 1
		year = today.getFullYear()
		this._get_month()
	}

	/**
	 * 오늘 날짜 Find
	 */
	_find_today = () => {
		const list = document.querySelectorAll('.dates')
		for (var i = 1; i < list.length; i++) {
			list[i].classList.remove('today')
			if (moment(list[i].dataset.fulldate).format('YYYY-MM-DD') === moment(new Date(getToday)).format('YYYY-MM-DD')) {
				list[i].classList.add('today')
			}
		}
	}

	/**
	 * 캘린더 날짜 클릭시
	 */
	_click_date = async (e, x) => {
		const list = document.querySelectorAll('.dates')
		for (var i = 0; i < list.length; i++) {
			list[i].classList.remove('click')
		}

		if (e) {
			list[x].classList.add('click')
			if (md.mobile()) {
				this.scrollDiv.current.scrollIntoView({ behavior: 'smooth' })
			}
			const clickDate = e.target.dataset.fulldate
			setTimeout(() => {
				//클릭한 날짜로 예약 내역 필터링
				let date = this.state.monthAllUsageByTime
					? this.state.monthAllUsageByTime[moment(new Date(clickDate)).format('YYYY-MM-DD')]
					: ''
				date
					? this.setState({ timeTalbleData: date, clickDate: clickDate })
					: this.setState({ timeTalbleData: [], clickDate: clickDate })
			}, 0)
		}
	}

	/**
	 * 날짜 0 추가용
	 */
	addZero = (n) => {
		let zero = ''
		n = n.toString()
		if (n.length < 2) {
			for (let i = 0; i < 2 - n.length; i++) zero += '0'
		}
		return zero + n
	}

	/**
	 * 시간표에 출력할 데이터 JSON형태로 세팅 후 table 형태로 return
	 */
	timeTableSet = (roomSeq, roomKey, placeSeq, managerSeq, canReserve = true, timeUnit = 60) => {
		// const getTime = new Date().toLocaleString();
		let returnData = []
		let dataPush = false

		const timeList =
			timeUnit == 30
				? Array(48)
						.fill()
						.map((element, index) => index / 2)
				: Array(24)
						.fill()
						.map((element, index) => index)

		timeList.forEach((x) => {
			for (let y = 0; y < Object.keys(this.state.timeTalbleData).length; y++) {
				let keys = Object.keys(this.state.timeTalbleData)[y]
				let data = this.state.timeTalbleData[keys]
				// console.log(keys)
				// console.log(data)

				for (let z = 0; z < data.length; z++) {
					// console.log(`${keys} === ${x}`)
					if (data[z].roomSeq === roomSeq && parseFloat(keys, 10) === parseFloat(x, 10)) {
						if (!dataPush) {
							// 예약된 방
							returnData.push({
								seq: data[z].seq,
								placeSeq: data[z].placeSeq,
								roomKey: data[z].roomKey,
								roomSeq: data[z].roomSeq,
								startDT: data[z].startDT,
								endDT: data[z].endDT,
								originalEndDT: data[z].originalEndDT,
								hour: parseFloat(x, 10),
								extendCount: data[z].extendCount,
								headCount: data[z].headCount,
								isCanceled: data[z].isCanceled,
								isExit: data[z].isExit,
								isUsed: data[z].isUsed,
								userSeq: data[z].userSeq,
								memberSeq: data[z].memberSeq,
								member_name: data[z]['member.name'],
								member_phone: data[z]['member.phone'],
								managerSeq: data[z].managerSeq,
								// canReserve: true
								canReserve: canReserve === true ? !data[z].notOpTime : canReserve
							})
							dataPush = true
						}
					}
				}
			}
			if (!dataPush) {
				// 빈 방
				returnData.push({
					hour: parseFloat(x, 10),
					endDT: null,
					extendCount: null,
					headCount: null,
					isCanceled: null,
					isExit: null,
					isUsed: null,
					managerSeq: managerSeq,
					member_name: null,
					member_phone: null,
					memberSeq: null,
					originalEndDT: null,
					placeSeq: placeSeq,
					roomKey: roomKey,
					roomSeq: roomSeq,
					seq: null,
					startDT: null,
					userSeq: null,
					canReserve
				})
			}
			dataPush = false
		})

		const TimeRow = ({ children, dataKey = 0 }) => {
			return <Fragment key={dataKey}>{children}</Fragment>
		}

		const roomTimeUnits = this.state.rooms.reduce((ac, room) => {
			ac[room.seq] = room.timeUnit || 60
			return ac
		}, {})

		const timeUnitRowSpan = ({ roomSeq }) => {
			if (this.maxTimeUnit() == 60) {
				return 1
			}
			if (roomTimeUnits) {
				const timeUnit = roomTimeUnits[roomSeq] || 60
				return timeUnit == 60 ? 2 : 1
			}
			return 1
		}

		return returnData.map((value, i) => {
			const rowSpan = timeUnitRowSpan(value)
			return moment(getToday).isAfter(this.state.clickDate) ? ( //과거
				value['member_phone'] ? (
					<tr
						key={i}
						data-id={0}
						className={'t_pointer'}
						style={{ backgroundColor: '#DAECF9' }}
						onClick={this.reserveClick.bind(this, value)}
					>
						<td rowSpan={rowSpan}>
							{value['member_name'] ? value['member_name'] : value['member_phone']}{' '}
							{value.headCount > 1 && `(${value.headCount}명)`}
						</td>
					</tr> //과거 이용칸
				) : (
					<tr key={i} data-id={1} style={{ backgroundColor: '#ABABAB' }}>
						<td rowSpan={rowSpan}></td>
					</tr>
				) //과거 미이용칸
			) : !value.canReserve ? (
				<tr key={i} data-id={2} style={{ backgroundColor: '#999999' }}>
					<td rowSpan={rowSpan}></td>
				</tr> //예약불가 스터디룸
			) : moment(getToday).isBefore(this.state.clickDate) ? ( //미래
				value['member_name'] !== null || value['member_phone'] !== null ? (
					<tr
						key={i}
						data-id={3}
						className={'t_pointer'}
						style={{ backgroundColor: '#DAECF9' }}
						onClick={this.reserveClick.bind(this, value)}
					>
						<td rowSpan={rowSpan}>
							{value['member_name'] ? value['member_name'] : value['member_phone']}{' '}
							{value.headCount > 1 && `(${value.headCount}명)`}
						</td>
					</tr> //예약칸
				) : (
					<tr
						key={i}
						data-id={4}
						className={'t_pointer'}
						style={{ backgroundColor: 'white' }}
						onClick={this.emptyClick.bind(this, value)}
					>
						<td rowSpan={rowSpan}></td>
					</tr>
				) //미예약칸
			) : value['hour'] < moment(new Date().getTime()).format('HH') ? ( //현재
				value['member_name'] !== null || value['member_phone'] !== null ? (
					<tr
						key={i}
						data-id={5}
						className={'t_pointer'}
						style={{ backgroundColor: '#DAECF9' }}
						onClick={this.reserveClick.bind(this, value)}
					>
						<td rowSpan={rowSpan}>
							{value['member_name'] ? value['member_name'] : value['member_phone']}{' '}
							{value.headCount > 1 && `(${value.headCount}명)`}
						</td>
					</tr> //시간 지난 이용칸
				) : (
					<tr key={i} data-id={6} style={{ backgroundColor: '#ABABAB' }}>
						<td rowSpan={rowSpan}></td>
					</tr>
				) //시간 지난 미예약칸
			) : value['member_name'] !== null || value['member_phone'] !== null ? (
				<tr
					key={i}
					data-id={7}
					className={'t_pointer'}
					style={{ backgroundColor: '#DAECF9' }}
					onClick={this.reserveClick.bind(this, value)}
				>
					<td rowSpan={rowSpan}>
						{value['member_name'] ? value['member_name'] : value['member_phone']}{' '}
						{value.headCount > 1 && `(${value.headCount}명)`}
					</td>
				</tr> //시간 안지난 예약칸
			) : (
				<tr
					key={i}
					data-id={8}
					className={'t_pointer'}
					style={{ backgroundColor: 'white' }}
					onClick={this.emptyClick.bind(this, value)}
				>
					<td rowSpan={rowSpan}></td>
				</tr>
			) //시간 안지난 미예약칸
		})
	}

	/**
	 * 캘린더 출력용 예약 갯수
	 */
	getCnt = (date) => {
		let cnt = 0
		for (let y = 0; y < Object.keys(date).length; y++) {
			let hour = Object.keys(date)[y]
			let list = date[hour]
			cnt += list.filter((el) => !el.notOpTime).length
		}
		return cnt
	}

	mobileChk = () => {
		if (md.mobile() === null) {
			return 'none'
		}
	}

	scrollTop = () => {
		this.scrollTopDiv.current.scrollIntoView({ behavior: 'smooth' })
	}

	maxTimeUnit = () => {
		const room = this.state.rooms.find(({ timeUnit = 60 }) => timeUnit == 30)
		const timeUnit = room && room.timeUnit ? room.timeUnit : 60
		return timeUnit
	}

	render() {
		const permission = Number(sessionStorage.getItem('manager_permission'))
		const { classes } = this.props
		const monthAllUsageByTime = this.state.monthAllUsageByTime
		const rooms = this.state.rooms
		console.log('렌더링 ====== ', rooms)
		return (
			<div id="studyroom" className={classes.portalDashboardPageWrapper}>
				<ReactNotifications />
				<Grid item xs={12}>
					<Grid container justify="center" spacing={16}>
						<Grid key={1} item xs={12} sm={12} md={12} className={classNames(classes.portalWidget)} style={{ height: '10%' }}>
							<div ref={this.scrollTopDiv}>
								<Card className={classes.card}>
									<CardContent>
										<div className={'row'} style={{ height: '40px', verticalAlign: 'middle' }}>
											<Typography
												className={'col-md-4'}
												variant="subheading"
												component="p"
												style={{ paddingTop: '0px' }}
											>
												잔여 예약 : {this.state.remainReservedCnt || '0'}건 ({this.state.remainReservedHour || '0'}
												시간)
											</Typography>
											<Typography className={'col-md-4'} variant="subheading" component="p">
												{this.state.thisMonth}월 : {this.state.monthUsedCnt || '0'}건 (
												{this.state.monthUsedHour || '0'}시간)
											</Typography>
											{permission > 1 && (
												<Button
													variant="outlined"
													size="medium"
													color="primary"
													className={classNames(classes.button)}
													onClick={this.roomSetting.bind(this, './roomsetting')}
												>
													설정
												</Button>
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						</Grid>

						<Grid
							id="seat_layout"
							key={3}
							item
							xs={12}
							sm={12}
							md={12}
							className={classNames(classes.portalWidget)}
							style={{ height: '90%' }}
						>
							<div className="row" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
								<div className="col-md-12 col-lg-6" style={{ overflow: 'hidden' }}>
									<div className={'CalendarDiv'}>
										<div className="Calendar" style={{ display: 'inline-block', width: isIE ? '400px' : '100%' }}>
											<header>
												<nav>
													<button className="btn prevBtn" onClick={this._prev_month}>
														{' '}
														&lt;{' '}
													</button>
													<p className="btn todayBtn">
														{' '}
														{this.state.thisYear}년 {this.state.thisMonth}월{' '}
													</p>
													<button className="btn nextBtn" onClick={this._next_month}>
														{' '}
														&gt;{' '}
													</button>
												</nav>
											</header>
											<section>
												<div className="days">
													{days.map((value, i) => {
														return (
															<span className="day" key={i}>
																{value}
															</span>
														)
													})}
												</div>
												<div className="main">
													{this.state.thisDates.map((value, i) => {
														let cnt = 0
														let date = monthAllUsageByTime
															? monthAllUsageByTime[moment(new Date(value['fulldate'])).format('YYYY-MM-DD')]
															: ''
														date ? (cnt = this.getCnt(date)) : (cnt = 0)

														if (value.include) {
															//해당 달에 날짜가 포함
															if (moment(getToday).isAfter(value['fulldate'])) {
																//과거
																if (cnt > 0) {
																	//이용내역이 있는 경우 선택 가능
																	return (
																		<div
																			className={'dates include c_after c_pointer'}
																			data-fulldate={value.fulldate}
																			data-month={value.month}
																			onClick={(event) => this._click_date(event, i)}
																			key={i}
																		>
																			<p
																				className={'c_date'}
																				data-fulldate={value.fulldate}
																				data-month={value.month}
																			>
																				{value.date}
																			</p>
																			{cnt > 0 ? (
																				<span
																					className={'c_txt'}
																					data-fulldate={value.fulldate}
																					data-month={value.month}
																				>
																					이용:
																				</span>
																			) : (
																				''
																			)}
																			{cnt > 0 ? (
																				<p
																					className={'b_cnt'}
																					data-fulldate={value.fulldate}
																					data-month={value.month}
																				>
																					{cnt}
																				</p>
																			) : (
																				''
																			)}
																			{cnt > 0 ? (
																				<span
																					className={'c_txt'}
																					data-fulldate={value.fulldate}
																					data-month={value.month}
																				>
																					시간
																				</span>
																			) : (
																				''
																			)}
																		</div>
																	)
																} else {
																	//이용내역이 없는 경우 선택 불가능
																	return (
																		<div
																			className={'dates include c_after'}
																			data-fulldate={value.fulldate}
																			data-month={value.month}
																			key={i}
																		>
																			<p
																				className={'c_date'}
																				data-fulldate={value.fulldate}
																				data-month={value.month}
																			>
																				{value.date}
																			</p>
																		</div>
																	)
																}
															} else {
																//현재~~
																return (
																	<div
																		className={'dates include c_pointer'}
																		data-fulldate={value.fulldate}
																		data-month={value.month}
																		onClick={(event) => this._click_date(event, i)}
																		key={i}
																	>
																		<p
																			className={'c_date c_before'}
																			data-fulldate={value.fulldate}
																			data-month={value.month}
																		>
																			{value.date}
																		</p>
																		{cnt > 0 ? (
																			<span
																				className={'c_txt'}
																				data-fulldate={value.fulldate}
																				data-month={value.month}
																			>
																				예약:
																			</span>
																		) : (
																			''
																		)}
																		{cnt > 0 ? (
																			<p
																				className={'c_cnt'}
																				data-fulldate={value.fulldate}
																				data-month={value.month}
																			>
																				{cnt}
																			</p>
																		) : (
																			''
																		)}
																		{cnt > 0 ? (
																			<span
																				className={'c_txt'}
																				data-fulldate={value.fulldate}
																				data-month={value.month}
																			>
																				시간
																			</span>
																		) : (
																			''
																		)}
																	</div>
																)
															}
														} else {
															//해당 달에 날짜가 미포함
															return (
																<div
																	className={'dates others'}
																	data-fulldate={value.fulldate}
																	data-month={value.month}
																	key={i}
																>
																	<p
																		className={'c_date'}
																		data-fulldate={value.fulldate}
																		data-month={value.month}
																	>
																		{/* {value.date} */}
																	</p>
																</div>
															)
														}
													})}
												</div>
											</section>
										</div>
									</div>
								</div>

								<div
									ref={this.scrollDiv}
									id="fullscreen_view"
									className={`col-md-12 ${this.state.rooms.length > 5 ? '' : 'col-lg-6'}`}
									style={{ overflow: 'hidden', marginTop: '10px', width: 'fit-content' }}
								>
									<div className={'timeTalbleDiv'}>
										<div className={'timeTalble'} style={{ display: 'flex' }}>
											{rooms &&
												rooms.map((value, i) => {
													return (
														<React.Fragment key={i}>
															{i == 0 && (
																<table style={{ marginTop: md.mobile() ? '16px' : 0 }}>
																	<tbody>
																		<tr>
																			<td style={{ paddingLeft: '2px', paddingRight: '2px' }}>
																				시간대
																			</td>
																		</tr>
																		{[
																			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
																			18, 19, 20, 21, 22, 23
																		].map((val, i) => {
																			if (this.maxTimeUnit() == 30) {
																				const hour = val.toString().padStart(2, '0')
																				const nextHour = (val + 1).toString().padStart(2, '0')
																				return (
																					<Fragment key={i}>
																						<tr>
																							<td
																								style={{
																									paddingLeft: '2px',
																									paddingRight: '2px'
																								}}
																							>
																								{hour}:00~{hour}:30
																							</td>
																						</tr>
																						<tr>
																							<td
																								style={{
																									paddingLeft: '2px',
																									paddingRight: '2px'
																								}}
																							>
																								{hour}:30~{nextHour}:00
																							</td>
																						</tr>
																					</Fragment>
																				)
																			} else {
																				return (
																					<tr key={i}>
																						<td>
																							{val}시~{val + 1}시
																						</td>
																					</tr>
																				)
																			}
																		})}
																	</tbody>
																</table>
															)}
															<table style={{ marginTop: md.mobile() ? '16px' : 0 }}>
																<tbody>
																	<tr>
																		<td>{value['name']}</td>
																	</tr>
																	{this.timeTableSet(
																		value['seq'],
																		value['key'],
																		value['placeSeq'],
																		value['managerSeq'],
																		value.canReserve,
																		this.maxTimeUnit()
																	)}
																</tbody>
															</table>
														</React.Fragment>
													)
												})}
										</div>
										<p className="only_fullscreen" style={{ textAlign: 'right' }}>
											{this.state.updateTime} 기준
										</p>
									</div>
								</div>
							</div>
						</Grid>
					</Grid>
				</Grid>
				<div style={{ display: 'block', textAlign: 'center', margin: '30px' }}>
					<Button
						variant="outlined"
						size="large"
						color="primary"
						style={{ margin: '6px' }}
						className={classNames(classes.button)}
						onClick={this.FullScreen}
					>
						<FullscreenIcon className={classes.leftIcon} />
						전체화면
					</Button>
					<Button
						variant="outlined"
						size="large"
						color="secondary"
						style={{ margin: '6px' }}
						className={classes.button}
						onClick={this.SetautoRefresh}
					>
						<AutorenewIcon className={classes.leftIcon} />
						{this.state.autoRefresh === true ? '자동갱신중' : '자동갱신켜기'}
					</Button>
					<p style={{ padding: '8px' }}>{this.state.updateTime} 업데이트됨</p>
				</div>
				<div className={classes.scrollTop} style={{ display: this.mobileChk() }} onClick={this.scrollTop}></div>
				<ReserveDialog
					reserveData={this.state.reserveData}
					reserveRoomName={this.state.reserveRoomName}
					onClose={this.closeEvent}
					timeUnit={this.state.timeUnit}
				/>
				<EmptyDialog
					clickDate={this.state.clickDate}
					reserveData={this.state.reserveData}
					reserveRoomName={this.state.reserveRoomName}
					chargeType={this.state.chargeType}
					minPerson={this.state.minPerson}
					onClose={this.closeEvent}
					timeUnit={this.state.timeUnit}
				/>
			</div>
		)
	}
}

Studyroom.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

const mapStateToProps = (state) => ({
	rooms: state.rooms
})

const mapDispatchToProps = (dispatch) => {
	return {
		fetchRooms: ({ placeSeq, year, month }) => dispatch(fetchRooms({ placeSeq, year, month })),
		setRooms: (rooms) => dispatch(setRooms(rooms))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withNavigation(Studyroom)))
