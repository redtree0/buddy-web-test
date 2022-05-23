import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import styles from './seatboard.style'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import DetailDialog from './detailDialog'
import AddDialog from './addDialog'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import axios from '../../wrapper/axios'
import MobileDetect from 'mobile-detect'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './seatboard.css'

const md = new MobileDetect(window.navigator.userAgent)

class Seatboard extends React.Component {
	constructor(props) {
		super(props)
		this.notificationDOMRef = React.createRef()

		this.state = {
			autoRefresh: true,
			updateTime: null,

			seatNo: null,
			seatKey: null,
			deskType: null,
			usageSeq: null,

			placeData: null,
			products: null,
			unitTime: 0,
			initMinutes: 0,
			deskReserved: null,
			usage: null,
			roomUsage: null,
			place_layout: [],
			dayCnt: 0,
			timeCnt: 0,

			dr_copy: null,
			showMemberName: true
		}
	}

	componentDidMount() {
		if (md.mobile() !== null) {
			const mvp = document.getElementById('meta-viewport')
			mvp.setAttribute('content', 'width=800') //width=device-width, initial-scale=1, maximum-scale=1
		}
		localStorage.removeItem('place_layout')
		this.loadValue()
		this.setData()
	}

	componentWillUnmount = () => {
		if (this.state.autoRefresh) {
			this.setState({ autoRefresh: false })
			clearInterval(this.timer)
		}
		const mvp = document.getElementById('meta-viewport')
		mvp.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no')
	}

	loadValue = async () => {
		await axios
			.get('/desk/' + JSON.parse(localStorage.getItem('manager_place')).seq, { params: { all: true } })
			.then((res) => {
				if (res.status === 200) {
					let dayCnt = 0,
						timeCnt = 0,
						freeCnt = 0,
						charCnt = 0,
						realCnt = 0

					if (res.data.usage) {
						for (let i = 0; i < res.data.usage.length; i++) {
							if (res.data.usage[i].timeType === 'day') {
								dayCnt = dayCnt + 1
							} else if (res.data.usage[i].timeType === 'time') {
								timeCnt = timeCnt + 1
							} else if (res.data.usage[i].timeType === 'free') {
								freeCnt = freeCnt + 1
							} else if (res.data.usage[i].timeType === 'char') {
								charCnt = charCnt + 1
							} else if (res.data.usage[i].timeType === 'real') {
								realCnt = realCnt + 1
							}
						}
					}

					this.setState({
						placeData: res.data,
						products: res.data.products,
						unitTime: res.data.unitTime,
						initMinutes: res.data.initMinutes,
						deskReserved: res.data.deskReserved,
						usage: res.data.usage,
						roomUsage: res.data.currentRoomUsage,
						place_layout: res.data.layout ? (res.data.layout.layoutJson ? res.data.layout.layoutJson : null) : null,
						dayCnt,
						freeCnt,
						freeUsageCnt: res.data.currentDeskFreeUsage || 0,
						charCnt,
						charUsageCnt: res.data.currentDeskCharUsage || 0,
						timeCnt,
						realCnt
					})
				}
			})
			.catch((error) => console.error(error))
	}

	//자동 갱신 세팅
	setData = () => {
		this.setState({
			updateTime: this.addZero(new Date().getHours(), 2) + ':' + this.addZero(new Date().getMinutes(), 2)
		})
		this.timer = setInterval(this.startRefresh, 300000)
	}

	href = async (page) => {
		if (page === 'seat') {
			await localStorage.setItem('deskLayout_placeSeq', JSON.parse(localStorage.getItem('manager_place')).seq)
			await localStorage.setItem(
				'place_layout',
				this.state.placeData
					? this.state.placeData.layout
						? this.state.placeData.layout.layoutJson
							? JSON.stringify(this.state.placeData.layout.layoutJson)
							: ''
						: ''
					: ''
			)
			window.location.href = './seatsetting'
		} else if (page === 'prod') {
			window.location.href = './sprodsetting'
		}
	}

	//좌석 클릭 event
	deskClick = async (key, no, deskType) => {
		this.setState({
			seatKey: key,
			seatNo: no,
			deskType
		})

		let drList = []
		for (let i = 0; i < this.state.deskReserved.length; i++) {
			if (this.state.deskReserved[i].deskNo === no) {
				drList.push(this.state.deskReserved[i])
			}
		}
		this.setState({ dr_copy: drList })

		for (let i = 0; i < this.state.usage.length; i++) {
			if (this.state.usage[i].deskKey === key) {
				await this.setState({ usageSeq: this.state.usage[i].seq })
				document.getElementById('detailDialog_btn').click() //사용 중인 좌석 일때
				return
			}
		}
		console.log('ON')
		document.getElementById('addDialog_btn').click() //빈 좌석 일때
	}

	closeEvent = (data, message) => {
		if (!data) return
		else if (data === 'usage') {
			this.props.history.push({ pathname: '/usage', state: { type: 'desk', key: this.state.seatKey, no: this.state.seatNo } })
		} else if (data === 'message') {
			this.props.history.push('/chat/member')
		} else if (data === 'change') {
			setTimeout(() => {
				this.loadValue()
			}, 500)
		} else if (data == 'extension') {
			this.alertMessage('알림', '연장 적용 되었습니다', 'success')
		} else if (data == 'checkout') {
			this.alertMessage('알림', '퇴실 처리 되었습니다', 'success')
		} else if (data == 'moveDesk') {
			this.alertMessage('알림', '좌석이동 적용 되었습니다', 'success')
			setTimeout(() => {
				this.loadValue()
			}, 500)
		} else if (data == 'moveDeskFail') {
			this.alertMessage('알림', message, 'danger')
		} else if (data == 'newAdd') {
			this.alertMessage('알림', '좌석 할당 되었습니다', 'success')
		} else if (data == 'memberNmChk') {
			this.alertMessage('알림', '이름/전화번호로 회원을 검색후 선택해주세요.', 'danger')
		} else if (data == 'productChk') {
			this.alertMessage('알림', '이용권을 선택/입력해주세요.', 'danger')
		} else if (message) {
			this.alertMessage('알림', message, 'danger')
		}
	}

	//Message 출력
	alertMessage = (title, message, type) => {
		this.notificationDOMRef.current.addNotification({
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

	//자동갱신 버튼 event
	SetautoRefresh = () => {
		if (this.state.autoRefresh) {
			this.setState({ autoRefresh: false })
			clearInterval(this.timer)
		} else {
			this.setState({ autoRefresh: true })
			this.timer = setInterval(this.startRefresh, 300000)
		}
	}

	startRefresh = () => {
		this.loadValue()
		this.setState({
			updateTime: this.addZero(new Date().getHours(), 2) + ':' + this.addZero(new Date().getMinutes(), 2)
		})
	}

	FullScreen = () => {
		var doc = window.document
		var docEl = doc.getElementById('seat_view')

		docEl.addEventListener('fullscreenchange', (event) => {
			if (document.fullscreenElement) {
				this.setState({ showMemberName: false })
				console.log(`Element: ${document.fullscreenElement.id} entered fullscreen mode.`)
			} else {
				this.setState({ showMemberName: true })
				console.log('Leaving full-screen mode.')
			}
		})

		var requestFullScreen =
			docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
		var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

		if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl)
		} else {
			cancelFullScreen.call(doc)
		}
	}

	addZero = (n, digits) => {
		let zero = ''
		n = n.toString()

		if (n.length < digits) {
			for (let i = 0; i < digits - n.length; i++) zero += '0'
		}
		return zero + n
	}

	getDeskUsage = (deskKey) => {
		if (!deskKey) return null
		return this.state.usage && this.state.usage.find((el) => el.deskKey === deskKey)
	}
	getRoomUsage = (roomKey) => {
		if (!roomKey) return null
		return this.state.roomUsage && this.state.roomUsage.find((el) => el.roomKey === roomKey)
	}

	render() {
		const permission = Number(sessionStorage.getItem('manager_permission'))
		const { classes } = this.props
		const { place_layout, showMemberName } = this.state
		return (
			<div id="root_body" className="seat_body">
				<ReactNotifications />
				<div className="status_div">
					<Card className={classNames('status_card', classes.card)}>
						<CardContent>
							<div className="row status_card_div">
								<Typography className={'col-sm-6 col-md-2 status_card_txt'} variant="body2" component="p">
									총<br />
									{this.state.placeData
										? this.state.placeData.usage
											? this.state.placeData.usage.length
											: '0'
										: '0'}{' '}
									/&nbsp;
									{this.state.placeData
										? this.state.placeData.layout
											? this.state.placeData.layout.deskCount
											: 0
										: 0}{' '}
								</Typography>
								<Typography className={'col-sm-6 col-md-1 status_card_txt'} variant="body2" component="p">
									1회권+실시간
									<br />
									{this.state.timeCnt} + {this.state.realCnt}
									{this.state.placeData &&
										this.state.placeData.price &&
										this.state.placeData.price.maxDeskTimeProduct > 0 &&
										' ≤ ' + this.state.placeData.price.maxDeskTimeProduct}
								</Typography>
								<Typography className={'col-sm-6 col-md-1 status_card_txt'} variant="body2" component="p">
									충전권
									<br />
									{this.state.charCnt} / {this.state.charUsageCnt}
									{this.state.placeData &&
										this.state.placeData.price &&
										this.state.placeData.price.maxDeskCharProduct > 0 &&
										' ≤ ' + this.state.placeData.price.maxDeskCharProduct}
								</Typography>
								<Typography className={'col-sm-6 col-md-1 status_card_txt'} variant="body2" component="p">
									자유석
									<br />
									{this.state.freeCnt} / {this.state.freeUsageCnt}
									{this.state.placeData &&
										this.state.placeData.price &&
										this.state.placeData.price.maxDeskFreeProduct > 0 &&
										' ≤ ' + this.state.placeData.price.maxDeskFreeProduct}
								</Typography>
								<Typography className={'col-sm-6 col-md-1 status_card_txt'} variant="body2" component="p">
									지정석
									<br />
									{this.state.dayCnt}
									{this.state.placeData &&
										this.state.placeData.price &&
										this.state.placeData.price.maxDeskDayProduct > 0 &&
										' ≤ ' + this.state.placeData.price.maxDeskDayProduct}
								</Typography>
								{permission > 1 && (
									<Typography className={'col-sm-12 col-md-4 status_card_btn'} variant="button" component="div">
										<Button variant="outlined" size="medium" color="primary" onClick={this.href.bind(this, 'seat')}>
											배치도 에디터
										</Button>
										<Button variant="outlined" size="medium" color="secondary" onClick={this.href.bind(this, 'prod')}>
											좌석상품 설정
										</Button>
									</Typography>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				<section id="sedit_wrap" className="sedit_wrap">
					<div id="seat_view" className="seat_view">
						{place_layout ? (
							place_layout.map((p_layout, i) => (
								<div className="panel" key={i}>
									<div className="top">
										{' '}
										<span className="ribon_icon"></span>{' '}
										<span className="title">{p_layout ? p_layout.spaceName : ''}</span>
									</div>
									<div className="body">
										<div className="grid">
											<table>
												<tbody>
													{p_layout ? (
														p_layout.data ? (
															p_layout.data.map((tr_layout, x) => (
																<tr key={x}>
																	{tr_layout.map((td_layout, y) => {
																		const theDeskUsage = this.getDeskUsage(td_layout.k)
																		const theRoomUsage = this.getRoomUsage(td_layout.rk)
																		return td_layout.t ? (
																			[
																				'seat_01',
																				'seat_02',
																				'seat_03',
																				'sofa_s01',
																				'office_s01',
																				'two_s01'
																			].includes(td_layout.t) ? (
																				<td
																					key={y}
																					onClick={this.deskClick.bind(
																						this,
																						td_layout.k,
																						td_layout.n,
																						td_layout.t
																					)}
																				>
																					<div
																						className={classNames(
																							'block',
																							td_layout.t,
																							td_layout.rot ? 'rot_' + td_layout.rot : null,
																							theDeskUsage ? 'active' : null
																						)}
																					>
																						<span
																							className={classNames(
																								'number',
																								theDeskUsage && theDeskUsage.timeType
																							)}
																						>
																							{td_layout.n ? td_layout.n : ''}
																							{showMemberName && (
																								<div className="name">
																									{theDeskUsage &&
																										theDeskUsage.member &&
																										theDeskUsage.member.name}
																								</div>
																							)}
																						</span>
																					</div>
																				</td>
																			) : td_layout.t === 'etc_01' ? (
																				<td key={y}>
																					<div className={classNames('block', td_layout.t)}>
																						<span className="etclabel">
																							{td_layout.n ? td_layout.n : ''}
																						</span>
																					</div>
																				</td>
																			) : td_layout.t === 'room_s01' ? (
																				<td key={y}>
																					<div
																						className={classNames(
																							'block',
																							td_layout.t,
																							td_layout.rot ? 'rot_' + td_layout.rot : null,
																							theRoomUsage ? 'active' : null
																						)}
																					>
																						<span className="number">
																							{td_layout.n ? td_layout.n : ''}
																						</span>
																					</div>
																				</td>
																			) : ['room_1x1', 'room_1x2', 'room_2x1', 'room_2x2'].includes(
																					td_layout.t
																			  ) ? (
																				<td key={y}>
																					<div
																						className={classNames(
																							'block',
																							'room',
																							td_layout.t,
																							theRoomUsage && 'active'
																						)}
																					>
																						<span className="label">
																							{td_layout.n ? td_layout.n : ''}
																						</span>
																					</div>
																				</td>
																			) : (
																				<td key={y}>
																					<div
																						className={classNames(
																							'block',
																							td_layout.t,
																							td_layout.rot ? 'rot_' + td_layout.rot : null
																						)}
																					></div>
																				</td>
																			)
																		) : (
																			<td key={y}>
																				<div className={'blank_block'}></div>
																			</td>
																		)
																	})}
																</tr>
															))
														) : null
													) : (
														<div>좌석이 없습니다.</div>
													)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							))
						) : (
							<div>좌석이 없습니다.</div>
						)}
					</div>
				</section>

				<div className="status_footer">
					<Button
						variant="outlined"
						size="large"
						color="primary"
						className={classNames('status_footer_btn', classes.button)}
						onClick={this.FullScreen}
					>
						<FullscreenIcon className={classes.leftIcon} />
						전체화면
					</Button>
					<Button variant="outlined" size="large" color="secondary" className={classes.button} onClick={this.SetautoRefresh}>
						<AutorenewIcon className={classes.leftIcon} />
						{this.state.autoRefresh === true ? '자동갱신중' : '자동갱신켜기'}
					</Button>
					<p>{this.state.updateTime} 업데이트됨</p>
				</div>
				<div className="hidden_">
					<DetailDialog
						seatKey={this.state.seatKey}
						seatNo={this.state.seatNo}
						deskType={this.state.deskType}
						usageSeq={this.state.usageSeq}
						onClose={this.closeEvent}
						deskReserved={this.state.dr_copy}
						place_layout={this.state.place_layout}
					/>
					<AddDialog
						seatKey={this.state.seatKey}
						seatNo={this.state.seatNo}
						deskType={this.state.deskType}
						products={this.state.products}
						unitTime={this.state.unitTime}
						initMinutes={this.state.initMinutes}
						onClose={this.closeEvent}
						deskReserved={this.state.dr_copy}
					/>
				</div>
			</div>
		)
	}
}

Seatboard.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default withStyles(styles, { withTheme: true })(Seatboard)
