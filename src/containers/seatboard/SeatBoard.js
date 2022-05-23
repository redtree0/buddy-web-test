import React, { useEffect, useState } from 'react'
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
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './seatboard.css'
import { useNavigate } from 'react-router-dom'

const md = new MobileDetect(window.navigator.userAgent)

const SeatBoard = ({ classes }) => {
	const [state, setState] = useState({
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
	})
	const [timer, setTimer] = useState()
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()

	const alertMessage = (title, message, type) => {
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

	const loadValue = async () => {
		setIsLoading(true)
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

					setState((prev) => ({
						...prev,
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
					}))
					setIsLoading(false)
				}
			})
			.catch((error) => console.error(error))
	}

	const addZero = (n, digits) => {
		let zero = ''
		n = n.toString()

		if (n.length < digits) {
			for (let i = 0; i < digits - n.length; i++) zero += '0'
		}
		return zero + n
	}

	const startRefresh = () => {
		loadValue()
		setState((prev) => ({
			...prev,
			updateTime: addZero(new Date().getHours(), 2) + ':' + addZero(new Date().getMinutes(), 2)
		}))
	}

	const setData = () => {
		setState((prev) => ({
			...prev,
			updateTime: addZero(new Date().getHours(), 2) + ':' + addZero(new Date().getMinutes(), 2)
		}))
		setTimer(setInterval(startRefresh, 300000))
	}

	const href = async (page) => {
		if (page === 'seat') {
			await localStorage.setItem('deskLayout_placeSeq', JSON.parse(localStorage.getItem('manager_place')).seq)
			await localStorage.setItem(
				'place_layout',
				state.placeData
					? state.placeData.layout
						? state.placeData.layout.layoutJson
							? JSON.stringify(state.placeData.layout.layoutJson)
							: ''
						: ''
					: ''
			)
			navigate('/seatsetting')
		} else if (page === 'prod') {
			navigate('/sprodsetting')
		}
	}

	const deskClick = async (key, no, deskType) => {
		setState((prev) => ({
			...prev,
			seatKey: key,
			seatNo: no,
			deskType
		}))

		let drList = []
		for (let i = 0; i < state.deskReserved.length; i++) {
			if (state.deskReserved[i].deskNo === no) {
				drList.push(state.deskReserved[i])
			}
		}
		setState((prev) => ({ ...prev, dr_copy: drList }))

		for (let i = 0; i < state.usage.length; i++) {
			if (state.usage[i].deskKey === key) {
				await setState((prev) => ({ ...prev, usageSeq: state.usage[i].seq }))
				document.getElementById('detailDialog_btn').click() //사용 중인 좌석 일때
				return
			}
		}
		document.getElementById('addDialog_btn').click() //빈 좌석 일때
	}

	const closeEvent = (data, message) => {
		if (!data) return
		else if (data === 'usage') {
			navigate('/usage', { state: { type: 'desk', key: state.seatKey, no: state.seatNo } })
		} else if (data === 'message') {
			navigate('/chat/member')
		} else if (data === 'change') {
			setTimeout(() => {
				loadValue()
			}, 500)
		} else if (data == 'extension') {
			alertMessage('알림', '연장 적용 되었습니다', 'success')
		} else if (data == 'checkout') {
			alertMessage('알림', '퇴실 처리 되었습니다', 'success')
		} else if (data == 'moveDesk') {
			alertMessage('알림', '좌석이동 적용 되었습니다', 'success')
			setTimeout(() => {
				loadValue()
			}, 500)
		} else if (data == 'moveDeskFail') {
			alertMessage('알림', message, 'danger')
		} else if (data == 'newAdd') {
			alertMessage('알림', '좌석 할당 되었습니다', 'success')
		} else if (data == 'memberNmChk') {
			alertMessage('알림', '이름/전화번호로 회원을 검색후 선택해주세요.', 'danger')
		} else if (data == 'productChk') {
			alertMessage('알림', '이용권을 선택/입력해주세요.', 'danger')
		} else if (message) {
			alertMessage('알림', message, 'danger')
		}
	}

	const SetautoRefresh = () => {
		if (state.autoRefresh) {
			setState((prev) => ({ ...prev, autoRefresh: false }))
			clearInterval(timer)
		} else {
			setState((prev) => ({ ...prev, autoRefresh: true }))
			setTimer(setInterval(startRefresh, 300000))
		}
	}

	const FullScreen = () => {
		var doc = window.document
		var docEl = doc.getElementById('seat_view')

		docEl.addEventListener('fullscreenchange', (event) => {
			if (document.fullscreenElement) {
				setState((prev) => ({ ...prev, showMemberName: false }))
				console.log(`Element: ${document.fullscreenElement.id} entered fullscreen mode.`)
			} else {
				setState((prev) => ({ ...prev, showMemberName: true }))
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

	const getDeskUsage = (deskKey) => {
		if (!deskKey) return null
		return state.usage && state.usage.find((el) => el.deskKey === deskKey)
	}
	const getRoomUsage = (roomKey) => {
		if (!roomKey) return null
		return state.roomUsage && state.roomUsage.find((el) => el.roomKey === roomKey)
	}
	const permission = Number(sessionStorage.getItem('manager_permission'))
	useEffect(() => {
		if (md.mobile() !== null) {
			const mvp = document.getElementById('meta-viewport')
			mvp.setAttribute('content', 'width=800')
		}
		loadValue()
		setData()
	}, [])
	return (
		<div id="root_body" className="seat_body">
			<ReactNotifications />
			<div className="status_div">
				<Card className={classNames('status_card', classes.card)}>
					<CardContent>
						<div className="row status_card_div">
							<Typography className={'col-sm-6 col-md-2 status_card_txt'} variant="body2" component="p">
								총<br />
								{state?.placeData ? (state?.placeData.usage ? state?.placeData.usage.length : '0') : '0'} /&nbsp;
								{state?.placeData ? (state?.placeData.layout ? state?.placeData.layout.deskCount : 0) : 0}{' '}
							</Typography>
							<Typography className={'col-sm-6 col-md-1 status_card_txt'} variant="body2" component="p">
								1회권+실시간
								<br />
								{state?.timeCnt} + {state?.realCnt}
								{state?.placeData?.price?.maxDeskTimeProduct > 0 && ' ≤ ' + state?.placeData.price.maxDeskTimeProduct}
							</Typography>
							<Typography className={'col-sm-6 col-md-1 status_card_txt'} variant="body2" component="p">
								충전권
								<br />
								{state?.charCnt} / {state?.charUsageCnt}
								{state?.placeData?.price?.maxDeskCharProduct > 0 && ' ≤ ' + state?.placeData?.price?.maxDeskCharProduct}
							</Typography>
							<Typography className={'col-sm-6 col-md-1 status_card_txt'} variant="body2" component="p">
								자유석
								<br />
								{state?.freeCnt} / {state?.freeUsageCnt}
								{state?.placeData?.price?.maxDeskFreeProduct > 0 && ' ≤ ' + state.placeData.price.maxDeskFreeProduct}
							</Typography>
							<Typography className={'col-sm-6 col-md-1 status_card_txt'} variant="body2" component="p">
								지정석
								<br />
								{state?.dayCnt}
								{state?.placeData?.price?.maxDeskDayProduct > 0 && ' ≤ ' + state.placeData.price.maxDeskDayProduct}
							</Typography>
							{permission > 1 && (
								<Typography className={'col-sm-12 col-md-4 status_card_btn'} variant="button" component="div">
									<Button variant="outlined" size="medium" color="primary" onClick={() => href('seat')}>
										배치도 에디터
									</Button>
									<Button variant="outlined" size="medium" color="secondary" onClick={() => href('prod')}>
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
					{state?.place_layout ? (
						state.place_layout.map((p_layout, i) => (
							<div className="panel" key={i}>
								<div className="top">
									{' '}
									<span className="ribon_icon"></span> <span className="title">{p_layout ? p_layout.spaceName : ''}</span>
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
																	const theDeskUsage = getDeskUsage(td_layout.k)
																	const theRoomUsage = getRoomUsage(td_layout.rk)
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
																				onClick={() =>
																					deskClick(td_layout.k, td_layout.n, td_layout.t)
																				}
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
																						{state.showMemberName && (
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
					onClick={FullScreen}
				>
					<FullscreenIcon className={classes.leftIcon} />
					전체화면
				</Button>
				<Button variant="outlined" size="large" color="secondary" className={classes.button} onClick={SetautoRefresh}>
					<AutorenewIcon className={classes.leftIcon} />
					{state?.autoRefresh === true ? '자동갱신중' : '자동갱신켜기'}
				</Button>
				<p>{state?.updateTime} 업데이트됨</p>
			</div>
			<div className="hidden_">
				{!isLoading && (
					<>
						<DetailDialog
							seatKey={state.seatKey}
							seatNo={state.seatNo}
							deskType={state.deskType}
							usageSeq={state.usageSeq}
							onClose={closeEvent}
							deskReserved={state.dr_copy}
							place_layout={state.place_layout}
						/>
						<AddDialog
							seatKey={state.seatKey}
							seatNo={state.seatNo}
							deskType={state.deskType}
							products={state.products}
							unitTime={state.unitTime}
							initMinutes={state.initMinutes}
							onClose={closeEvent}
							deskReserved={state.dr_copy}
						/>
					</>
				)}
			</div>
		</div>
	)
}

export default withStyles(styles, { withTheme: true })(SeatBoard)
