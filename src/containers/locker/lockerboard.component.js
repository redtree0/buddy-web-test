import React from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import DetailDialog from './detailDialog'
import AddDialog from './addDialog'
import moment from 'moment'
import axios from '../../wrapper/axios'

import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './lockerboard.css'
import withNavigation from 'components/withNavigation'

class Lockerboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			autoRefresh: true,
			updateTime: null,

			lockerNo: null,
			lockerPwd: null,
			usageInfo: null,

			lockerData: null,
			info: null,
			products: null,
			usage: null,
			locker_layout: [],
			dayCnt: 0,
			timeCnt: 0
		}
	}

	componentDidMount() {
		localStorage.removeItem('locker_placeSeq')
		localStorage.removeItem('locker_layout')
		localStorage.removeItem('locker_info')
		localStorage.removeItem('locker_usage')
		this.loadValue()
	}

	loadValue = async () => {
		const now = new Date()
		await axios
			.get('/locker/' + JSON.parse(localStorage.getItem('manager_place')).seq, { params: { incUsage: true } })
			.then((res) => {
				if (res.status == 200) {
					const layout = res.data.layout && res.data.layout.layoutJson ? res.data.layout.layoutJson : null
					layout &&
						layout.forEach((stage) => {
							stage.data.forEach((row) => {
								row.forEach((cell) => {
									const info = res.data.info.find((el) => el.lockerNo === cell.n)
									if (info && info.maxEndDT && moment(info.maxEndDT).isBefore(now)) {
										if (moment(info.mdate).isBefore(moment(info.maxEndDT))) {
											if (moment(now).diff(moment(info.mdate), 'days') > 90) {
												cell.pwStatus = 'danger'
											} else {
												cell.pwStatus = 'warning'
											}
										} else {
											cell.pwStatus = ''
										}
									} else {
										cell.pwStatus = ''
									}
								})
							})
						})
					this.setState({
						lockerData: res.data,
						info: res.data.info,
						products: res.data.products,
						usage: res.data.usage,
						locker_layout: layout
					})
				}
			})
			.catch((error) => console.error(error))
	}

	href = (page) => {
		if (page == 'seat') {
			const { lockerData = {} } = this.state
			const { layout = {}, info, usage } = lockerData
			const lockerJson = layout && layout.layoutJson ? JSON.stringify(lockerData.layout.layoutJson) : ''
			const lockerUsage = usage ? JSON.stringify(lockerData.usage) : ''
			const infoJson = info ? JSON.stringify(lockerData.info) : ''

			localStorage.setItem('locker_placeSeq', JSON.parse(localStorage.getItem('manager_place')).seq)
			localStorage.setItem('locker_layout', lockerJson)
			localStorage.setItem('locker_info', infoJson)
			localStorage.setItem('locker_usage', lockerUsage)

			window.location.href = './lockersetting'
		} else if (page == 'prod') {
			window.location.href = './lprodsetting'
		}
	}

	//락커 클릭 event
	lockerClick = async (no, key, pwd) => {
		this.setState({ lockerNo: no, lockerPwd: pwd })
		for (let i = 0; i < this.state.usage.length; i++) {
			if (this.state.usage[i].lockerNo === no) {
				await this.setState({ usageInfo: this.state.usage[i] })
				document.getElementById('detailDialog_btn').click() //사용 중인 락커 일때
				return
			}
		}

		document.getElementById('addDialog_btn').click() //빈 락커 일때
	}

	selectUse = (no) => {
		for (let i = 0; i < this.state.usage.length; i++) {
			if (this.state.usage[i].lockerNo === no) {
				return 'unable'
			}
		}

		return ''
	}

	timeChk = (no) => {
		for (let i = 0; i < this.state.usage.length; i++) {
			if (this.state.usage[i].lockerNo === no) {
				const diffDays = moment(this.state.usage[i].endDT).diff(moment().format('YYYY-MM-DD'), 'days')
				return diffDays > 0 ? diffDays : 'day'
			}
		}

		return ''
	}

	closeEvent = (data, message) => {
		if (!data) return
		else if (data === 'checkout') {
			this.alertMessage('알림', '이용 취소 되었습니다', 'success')
			this.loadValue()
		} else if (data === 'lockerUse') {
			this.alertMessage('알림', '이용 등록 되었습니다', 'success')
			this.loadValue()
		} else if (data === 'memberNmChk') {
			this.alertMessage('경고', '회원 이름을 입력해주세요.', 'danger')
		} else if (data === 'productChk') {
			this.alertMessage('경고', '상품을 선택해주세요.', 'danger')
		} else if (data == 'usage') {
			this.props.navigate('/usage', { state: { type: 'locker', no: this.state.lockerNo, key: this.state.lockerNo } })
		} else if (data == 'moveLocker') {
			this.alertMessage('알림', '락커이동 적용 되었습니다', 'success')
			setTimeout(() => {
				this.loadValue()
			}, 500)
		} else if (data == 'extendLocker') {
			this.alertMessage('알림', '락커 기간이 연장 되었습니다', 'success')
			setTimeout(() => {
				this.loadValue()
			}, 500)
		} else if (message) {
			this.alertMessage('알림', message, 'danger')
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

	render() {
		const permission = Number(sessionStorage.getItem('manager_permission'))
		const { locker_layout } = this.state
		return (
			<div id="root_body" className="locker_body">
				<ReactNotifications />
				<div className="status_div">
					<Card className="status_card">
						<CardContent>
							<div className="row status_card_div">
								<Typography className={'col-sm-12 col-md-6 status_card_txt'} variant="title" component="p">
									현재이용 칸 {this.state.usage ? this.state.usage.length : '0'} /{' '}
									{this.state.lockerData
										? this.state.lockerData.layout
											? this.state.lockerData.layout.availableCount
											: '0'
										: '0'}{' '}
									석
								</Typography>
								{permission > 1 && (
									<Typography className={'col-sm-12 col-md-6 status_card_btn'} variant="title" component="p">
										<Button variant="outlined" size="medium" color="primary" onClick={this.href.bind(this, 'seat')}>
											락커 설정
										</Button>
										<Button variant="outlined" size="medium" color="secondary" onClick={this.href.bind(this, 'prod')}>
											상품 설정
										</Button>
									</Typography>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				<section id="ledit_wrap" className="ledit_wrap">
					<div id="lk_view" className="lk_view">
						{locker_layout ? (
							locker_layout.map((p_layout, i) => (
								<div className="panel" key={i}>
									<div className="top">
										{' '}
										<span className="ribon_icon"></span>{' '}
										<span className="title">{this.state.locker_layout[i] ? this.state.locker_layout[i].name : ''}</span>
									</div>
									<div className="body">
										<div className="cabinet_wrap">
											<table>
												<tbody>
													{locker_layout[i]
														? locker_layout[i].data
															? locker_layout[i].data.map((tr_layout, x) => (
																	<tr key={x}>
																		{locker_layout[i].data[x].map((layout, y) =>
																			locker_layout[i].data[x][y].t ? (
																				this.selectUse(locker_layout[i].data[x][y].n) !==
																					'unable' && locker_layout[i].data[x][y].disabled ? (
																					<td key={y}>
																						<div
																							className={classNames(
																								'locker',
																								'unable',
																								'disabled'
																							)}
																						>
																							<div className="tb_wrap">
																								<div className="info">
																									<ul>
																										<li>
																											<i className="unlocked"></i>
																										</li>
																										<li className="number">
																											{locker_layout[i].data[x][y].n
																												? locker_layout[i].data[x][
																														y
																												  ].n
																												: ''}
																										</li>
																										<li className="stat">이용불가</li>
																									</ul>
																								</div>
																							</div>
																						</div>
																					</td>
																				) : (
																					<td
																						key={y}
																						onClick={this.lockerClick.bind(
																							this,
																							locker_layout[i].data[x][y].n,
																							locker_layout[i].data[x][y].k,
																							locker_layout[i].data[x][y].p
																						)}
																					>
																						{this.selectUse(locker_layout[i].data[x][y].n) ===
																						'unable' ? (
																							<div className={classNames('locker', 'unable')}>
																								<div className="tb_wrap">
																									<div className="info">
																										<ul>
																											<li>
																												<i className="unlocked"></i>
																											</li>
																											<li className="number">
																												{locker_layout[i].data[x][y]
																													.n
																													? locker_layout[i].data[
																															x
																													  ][y].n
																													: ''}
																											</li>
																											<li className="name">
																												{locker_layout[i].data[x][y]
																													.name || ''}
																											</li>
																											<li className="stat time">
																												D-
																												{this.timeChk(
																													locker_layout[i].data[
																														x
																													][y].n
																												)}
																											</li>
																										</ul>
																									</div>
																								</div>
																							</div>
																						) : (
																							<div
																								className={classNames(
																									'locker',
																									locker_layout[i].data[x][y].pwStatus ||
																										''
																								)}
																							>
																								<div className="tb_wrap">
																									<div className="info">
																										<ul>
																											<li>
																												<i className="locked"></i>
																											</li>
																											<li className="number">
																												{locker_layout[i].data[x][y]
																													.n
																													? locker_layout[i].data[
																															x
																													  ][y].n
																													: ''}
																											</li>
																											<li className="stat"></li>
																										</ul>
																									</div>
																								</div>
																							</div>
																						)}
																					</td>
																				)
																			) : (
																				<td key={y}>
																					<div className={'locker_blank'}></div>
																				</td>
																			)
																		)}
																	</tr>
															  ))
															: null
														: null}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							))
						) : (
							<div>락커가 없습니다.</div>
						)}
					</div>
				</section>

				<div className="hidden_">
					<DetailDialog
						lockerNo={this.state.lockerNo}
						lockerPwd={this.state.lockerPwd}
						usageInfo={this.state.usageInfo}
						onClose={this.closeEvent}
					/>
					<AddDialog
						lockerNo={this.state.lockerNo}
						lockerPwd={this.state.lockerPwd}
						products={this.state.products}
						onClose={this.closeEvent}
					/>
				</div>
			</div>
		)
	}
}

export default withNavigation(Lockerboard)
