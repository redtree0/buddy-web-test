import React from 'react'
// import { Prompt } from 'react-router'
import classNames from 'classnames'
import axios from '../../wrapper/axios'
import update from 'react-addons-update'
import MobileDetect from 'mobile-detect'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './lockerboard.css'
import withNavigation from 'components/withNavigation'

const md = new MobileDetect(window.navigator.userAgent)

//3 x 3 default
const data = [
	[{ t: null }, { t: null }, { t: null }],
	[{ t: null }, { t: null }, { t: null }],
	[{ t: null }, { t: null }, { t: null }]
]

let hasChanges = false
class LockerSetting extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			locker_layout: [],
			locker_info: [],
			locker_usage: [],
			_locker_info: [],
			cancelboxisOn: false,
			confirmboxisOn: false,
			isEditing: false
		}
	}

	/**
	 * 좌석 페이지에서 좌석 정보 받아와서 세팅
	 */
	componentWillMount() {
		setTimeout(() => {
			if (JSON.parse(localStorage.getItem('manager_place')).seq == localStorage.getItem('locker_placeSeq')) {
				this.setState({
					locker_layout: localStorage.getItem('locker_layout') ? JSON.parse(localStorage.getItem('locker_layout')) : [],
					locker_info: localStorage.getItem('locker_info') ? JSON.parse(localStorage.getItem('locker_info')) : [],
					locker_usage: localStorage.getItem('locker_usage') ? JSON.parse(localStorage.getItem('locker_usage')) : []
				})
			}
		}, 0)

		window.onbeforeunload = function () {
			if (hasChanges) return '저장 버튼을 누르지 않으면 반영되지 않습니다.'
		}
	}

	componentDidMount() {
		if (md.mobile() !== null) {
			const mvp = document.getElementById('meta-viewport')
			mvp.setAttribute('content', 'width=800')
		}
		//로그인 여부 체크
		if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
			window.location.href = '/login'
			return
		}
	}

	componentWillUnmount = () => {
		const mvp = document.getElementById('meta-viewport')
		mvp.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no')

		window.onbeforeunload = () => undefined
		localStorage.removeItem('locker_layout')
	}

	/**
	 * 락커 삭제
	 */
	onDelete = async (i) => {
		hasChanges = true
		// 사용중인 락커가 있으면 락커삭제 불가
		for (let x = 0; x < this.state.locker_usage.length; x++) {
			let lockerNo = this.state.locker_usage[x].lockerNo
			for (let y = 0; y < this.state.locker_layout[i].data.length; y++) {
				const useLocker = this.state.locker_layout[i].data[y].filter((layout) => (layout.n ? layout.n.includes(lockerNo) : null))
				if (useLocker.length > 0) {
					this.alertMessage('락커를 삭제할 수 없습니다.', '사용중인 락커가 있습니다.', 'danger')
					return
				}
			}
		}
		await this.setState({
			locker_layout: update(this.state.locker_layout, {
				$splice: [[i, 1]]
			})
		})
		this.setState({ isEditing: true })
	}

	/**
	 * 취소 버튼
	 */
	onCancel = async () => {
		this.props.navigate(-1)
	}
	boxClose = () => {
		this.setState({ cancelboxisOn: false, confirmboxisOn: false })
		document.getElementById('cancel_box').style.display = 'none'
		document.getElementById('confirm_box').style.display = 'none'
	}
	cancelBack = () => {
		this.setState({ cancelboxisOn: false })
		document.getElementById('cancel_box').style.display = 'none'
		window.location.href = '/locker'
	}

	/**
	 * 저장 버튼 => 미입력 & 중복 체크
	 */
	saveCheck = async () => {
		//중복 체크
		for (let i = 0; i < this.state.locker_layout.length; i++) {
			for (let x = 0; x < this.state.locker_layout[i].data.length; x++) {
				for (let y = 0; y < this.state.locker_layout[i].data[x].length; y++) {
					if (this.state.locker_layout[i].data[x][y].n !== undefined && this.state.locker_layout[i].data[x][y].n !== '') {
						for (let _i = 0; _i < this.state.locker_layout.length; _i++) {
							for (let _x = 0; _x < this.state.locker_layout[_i].data.length; _x++) {
								for (let _y = 0; _y < this.state.locker_layout[_i].data[_x].length; _y++) {
									if (this.state.locker_layout[i].data[x][y].n === this.state.locker_layout[_i].data[_x][_y].n) {
										if (i !== _i || x !== _x || y !== _y) {
											this.alertMessage('경고', '중복되는 락커 번호가 있습니다.', 'danger')
											return
										}
									}
								}
							}
						}
					}
				}
			}
		}
		//미입력 체크
		for (let i = 0; i < this.state.locker_layout.length; i++) {
			for (let x = 0; x < this.state.locker_layout[i].data.length; x++) {
				for (let y = 0; y < this.state.locker_layout[i].data[x].length; y++) {
					if (
						this.state.locker_layout[i].data[x][y].n === '' ||
						this.state.locker_layout[i].data[x][y].n === null ||
						this.state.locker_layout[i].data[x][y].p === '' ||
						this.state.locker_layout[i].data[x][y].p === null
					) {
						if (!this.state.confirmboxisOn) {
							this.setState({ cancelboxisOn: true })
							document.getElementById('confirm_box').style.display = 'block'
						}
						return
					}
				}
			}
		}

		this.infoSave()
	}

	/**
	 * 락커 정보 저장
	 */
	infoSave = async () => {
		this.boxClose()
		await this.setState({ _locker_info: this.state.locker_info })
		let isEdit = false
		let totalCount = 0
		let availableCount = 0

		for (let i = 0; i < this.state.locker_layout.length; i++) {
			for (let x = 0; x < this.state.locker_layout[i].data.length; x++) {
				for (let y = 0; y < this.state.locker_layout[i].data[x].length; y++) {
					totalCount = totalCount + 1
					if (this.state.locker_layout[i].data[x][y].n && !this.state.locker_layout[i].data[x][y].disabled) {
						availableCount = availableCount + 1
					}

					isEdit = false
					if (this.state.locker_layout[i].data[x][y].n !== undefined && this.state.locker_layout[i].data[x][y].n !== '') {
						for (let z = 0; z < this.state._locker_info.length; z++) {
							if (this.state._locker_info[z].lockerNo === this.state.locker_layout[i].data[x][y].n) {
								await this.setState({
									_locker_info: update(this.state._locker_info, {
										[z]: {
											lockerPassword: { $set: this.state.locker_layout[i].data[x][y].p },
											isAvailable: { $set: !this.state.locker_layout[i].data[x][y].disabled }
										}
									})
								})
								isEdit = true
							}
						}

						if (!isEdit) {
							let info_data = {
								placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
								lockerNo: this.state.locker_layout[i].data[x][y].n,
								lockerPassword: this.state.locker_layout[i].data[x][y].p,
								isAvailable: !this.state.locker_layout[i].data[x][y].disabled,
								isLive: true
							}

							await this.setState({
								_locker_info: update(this.state._locker_info, {
									$push: [info_data]
								})
							})
						}
					}
				}
			}
		}

		await axios
			.post('/locker/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/info/batch', this.state._locker_info)
			.then((res) => {
				if (res.status === 200) {
					localStorage.setItem('locker_info', JSON.stringify(this.state._locker_info))
					this.setState({ locker_info: this.state._locker_info })
					this.onSave(totalCount, availableCount)
				}
			})
			.catch((error) => {
				console.error(error)
				this.alertMessage('저장 실패.', error.toString(), 'danger')
				return
			})
	}

	/**
	 * 저장
	 */
	onSave = async (totalCount, availableCount) => {
		const data = {
			managerSeq: sessionStorage.getItem('manager_seq'),
			totalCount: totalCount,
			availableCount: availableCount,
			layoutJson: this.state.locker_layout
		}

		await axios
			.post('/locker/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/layout', data)
			.then((res) => {
				if (res.status === 200) {
					hasChanges = false
					localStorage.setItem('locker_layout', JSON.stringify(this.state.locker_layout))
					this.setState({ isEditing: false })
					this.alertMessage('알림', '저장되었습니다', 'success')
					window.location = '/locker'
				}
			})
			.catch((error) => {
				console.error(error)
				this.alertMessage('에러', error.message, 'danger')
			})
	}

	/**
	 * Message 출력
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
	 * 기본 Change handler
	 */
	handleChange = async (prop, value, i) => {
		hasChanges = true
		this.setState({
			locker_layout: update(this.state.locker_layout, {
				[i]: {
					[prop]: { $set: value }
				}
			})
		})
	}

	/**
	 * 락커번호, 비밀번호 Change handler
	 */
	noChange = async (prop, i, x, y, value) => {
		hasChanges = true
		const re = /^[0-9\,]+$/
		if (value === '' || re.test(value)) {
			await this.setState({
				locker_layout: update(this.state.locker_layout, {
					[i]: {
						['data']: {
							[x]: {
								[y]: {
									[prop]: { $set: value }
								}
							}
						}
					}
				})
			})
		}
	}

	/**
	 * 사용여부 Change handler
	 */
	checkChange = async (prop, i, x, y, value) => {
		hasChanges = true
		await this.setState({
			locker_layout: update(this.state.locker_layout, {
				[i]: {
					['data']: {
						[x]: {
							[y]: {
								[prop]: { $set: value === false ? true : false }
							}
						}
					}
				}
			})
		})
		this.setState({ isEditing: true })
	}

	/**
	 * 락커번호 자동세팅
	 */
	setLockerNumber = async () => {
		hasChanges = true
		for (let i = 0; i < this.state.locker_layout.length; i++) {
			for (let x = 0; x < this.state.locker_layout[i].data.length; x++) {
				for (let y = 0; y < this.state.locker_layout[i].data[x].length; y++) {
					if (this.state.locker_layout[i].data[x][y].t !== null) {
						await this.setState({
							locker_layout: update(this.state.locker_layout, {
								[i]: {
									['data']: {
										[x]: {
											[y]: {
												n: { $set: this.addZero(y * this.state.locker_layout[i].data.length + x + 1) }
											}
										}
									}
								}
							})
						})
					}
				}
			}
		}
		this.setState({ isEditing: true })
	}

	/**
	 * 비밀번호 자동세팅
	 */

	setLockerPwd = async (i) => {
		hasChanges = true
		for (let i = 0; i < this.state.locker_layout.length; i++) {
			for (let x = 0; x < this.state.locker_layout[i].data.length; x++) {
				for (let y = 0; y < this.state.locker_layout[i].data[x].length; y++) {
					if (this.state.locker_layout[i].data[x][y].t !== null) {
						let pwd = await this.setPwd()
						await this.setState({
							locker_layout: update(this.state.locker_layout, {
								[i]: {
									['data']: {
										[x]: {
											[y]: {
												p: { $set: pwd }
											}
										}
									}
								}
							})
						})
					}
				}
			}
		}
		this.setState({ isEditing: true })
	}

	/**
	 * 비밀번호 랜덤 4자리 생성
	 */
	setPwd = async () => {
		let p = '0123456789'
		let key = [...Array(4)].reduce((a) => a + p[~~(Math.random() * p.length)], '')
		// 중복 방지
		for (let i = 0; i < this.state.locker_layout.length; i++) {
			for (let x = 0; x < this.state.locker_layout[i].length; x++) {
				for (let y = 0; y < this.state.locker_layout[i][x].length; y++) {
					if (this.state.locker_layout[i][x][y].p) {
						if (this.state.locker_layout[i][x][y].p === key) {
							return this.setPwd()
						}
					}
				}
			}
		}
		return key
	}

	/**
	 * 락커 삭제
	 */
	deleteLocker = async (i, x, y) => {
		hasChanges = true
		// 락커가 사용중이면 삭제 불가
		const lockerNo = this.state.locker_layout[i].data[x][y].n
		if (lockerNo) {
			for (let z = 0; z < this.state.locker_usage.length; z++) {
				let useLockerNo = this.state.locker_usage[z].lockerNo
				if (useLockerNo === lockerNo) {
					this.alertMessage('락커를 삭제할 수 없습니다.', '사용중인 락커 입니다.', 'danger')
					return
				}
			}
		}

		await this.setState({
			locker_layout: update(this.state.locker_layout, {
				[i]: {
					['data']: {
						[x]: {
							[y]: { $set: { t: null } }
						}
					}
				}
			})
		})
		this.setState({ isEditing: true })
	}

	/**
	 * 락커 추가
	 */
	addLocker = async (i, x, y) => {
		hasChanges = true
		this.setState({
			locker_layout: update(this.state.locker_layout, {
				[i]: {
					['data']: {
						[x]: {
							[y]: { $set: { t: 'locker', n: '', p: '', disabled: false } }
						}
					}
				}
			})
		})
		this.setState({ isEditing: true })
	}

	/**
	 * 열 추가 버튼 클릭
	 */
	addColumn = async (i) => {
		hasChanges = true
		let _locker_layout = this.state.locker_layout
		const _x = _locker_layout[i].data[0].length //열 갯수
		const _y = _locker_layout[i].data.length //행 갯수
		// if(_x < 24){
		for (let y = 0; y < _y; y++) {
			_locker_layout[i].data[y].push({ t: 'locker', n: '', p: '', disabled: false })
		}
		this.setState({ locker_layout: _locker_layout })
		this.setState({ isEditing: true })
		// }
	}

	/**
	 * 열 삭제 버튼 클릭
	 */

	deleteColumn = async (i) => {
		hasChanges = true
		let _locker_layout = this.state.locker_layout
		const _x = _locker_layout[i].data[0].length //열 갯수
		const _y = _locker_layout[i].data.length //행 갯수
		let deleteYn = true

		if (_x > 3) {
			for (let y = 0; y < _y; y++) {
				const lockerNo = _locker_layout[i]['data'][y][_x - 1].n
				if (lockerNo) {
					for (let z = 0; z < this.state.locker_usage.length; z++) {
						let useLockerNo = this.state.locker_usage[z].lockerNo
						if (useLockerNo === lockerNo) {
							deleteYn = false
							this.alertMessage('열을 삭제할 수 없습니다.', '사용중인 락커가 있습니다.', 'danger')
							return
						}
					}
				}
			}
			if (deleteYn) {
				for (let y = 0; y < _y; y++) {
					_locker_layout[i]['data'][y].splice(_x - 1, 1)
				}
			}
			this.setState({ locker_layout: _locker_layout })
			this.setState({ isEditing: true })
		}
	}

	/**
	 * 행 추가 버튼 클릭
	 */

	addRow = async (i) => {
		hasChanges = true
		let pushArr = []
		for (let y = 0; y < this.state.locker_layout[i].data[0].length; y++) {
			pushArr.push({ t: 'locker', n: '', p: '', disabled: false })
		}

		await this.setState({
			locker_layout: update(this.state.locker_layout, {
				[i]: {
					['data']: {
						$push: [pushArr]
					}
				}
			})
		})
		this.setState({ isEditing: true })
	}

	/**
	 * 행 삭제 버튼 클릭
	 */

	deleteRow = async (i) => {
		hasChanges = true
		if (this.state.locker_layout[i].data.length > 3) {
			// 해당 행에 사용중인 락커가 있으면 행삭제 불가
			const _y = this.state.locker_layout[i]['data'].length //행 갯수
			for (let x = 0; x < this.state.locker_usage.length; x++) {
				let lockerNo = this.state.locker_usage[x].lockerNo
				for (let y = 0; y < this.state.locker_layout[i].data[_y - 1].length; y++) {
					const useLockerNo = this.state.locker_layout[i].data[_y - 1].filter((layout) =>
						layout.n ? layout.n.includes(lockerNo) : null
					)
					if (useLockerNo.length > 0) {
						this.alertMessage('행을 삭제할 수 없습니다.', '사용중인 락커가 있습니다.', 'danger')
						return
					}
				}
			}

			await this.setState({
				locker_layout: update(this.state.locker_layout, {
					[i]: {
						['data']: {
							$splice: [[this.state.locker_layout[i].data.length - 1, 1]]
						}
					}
				})
			})
			this.setState({ isEditing: true })
		}
	}

	/**
	 * 공간 추가 버튼 클릭
	 */
	addLockerLayout = async () => {
		hasChanges = true
		await this.setState({
			locker_layout: update(this.state.locker_layout, {
				$push: [{ name: '', data }]
			})
		})
		this.setState({ isEditing: true })
	}

	/**
	 * 앞에 0 추가용
	 */

	addZero = (n) => {
		let zero = ''
		n = n.toString()

		if (n.length < 2) {
			for (let i = 0; i < 2 - n.length; i++) zero += '0'
		}
		return zero + n
	}

	render() {
		const locker_layout = this.state.locker_layout
		const isEditing = this.state.isEditing
		return (
			<div id="root_body" style={{ height: '100%' }}>
				<ReactNotifications />
				{/* <Prompt when={isEditing} message="페이지 이동시 작업중인 내용이 사라집니다" /> */}
				<section id="ledit_wrap" className="ledit_wrap">
					{/* 편집영역 */}
					<div id="lk_canvas_wrap" className="lk_canvas_wrap">
						<div className="btn_panel">
							<div className="top">
								<button className="set" onClick={(e) => this.setLockerNumber()}>
									<i className="numbers invert"></i>
									<span className="text">락커번호 자동세팅</span>
								</button>
								<button className="set" onClick={(e) => this.setLockerPwd()}>
									<i className="locked invert"></i>
									<span className="text">비밀번호 랜덤세팅</span>
								</button>
							</div>
						</div>
						{locker_layout
							? locker_layout.map((p_layout, i) => (
									<div className="panel" key={i}>
										<div className="top">
											<span className="ribon_icon"></span>
											<span className="title">락커명 :</span>
											<input
												className="space_name"
												value={this.state.locker_layout[i].name ? this.state.locker_layout[i].name : ''}
												onChange={(e) => this.handleChange('name', e.target.value, i)}
											/>
											{/* <button className="set" onClick={e => this.setLockerNumber(i)}><i className="numbers invert"></i><span className="text">락커번호 자동세팅</span></button>
                    <button className="set" onClick={e => this.setLockerPwd(i)}><i className="locked invert"></i><span className="text">비밀번호 랜덤세팅</span></button>	 */}
											<button className="save" onClick={(e) => this.onDelete(i)}>
												<span className="icon check"></span>
												<span className="text">락커삭제</span>
											</button>
										</div>
										<div className="body">
											<div className="grid">
												<table className={classNames('etc_01')}>
													<tbody>
														{locker_layout[i]
															? locker_layout[i].data
																? locker_layout[i].data.map((tr_layout, x) => (
																		<tr key={x}>
																			{locker_layout[i].data[x].map((layout, y) =>
																				locker_layout[i].data[x][y].t ? (
																					<td key={y}>
																						<div className={classNames('locker_box setting')}>
																							<div className="line">
																								<ul>
																									<li>
																										<i className="numbers"></i>
																										<input
																											type="number"
																											min="0"
																											max="9999"
																											value={
																												this.state.locker_layout[i]
																													.data[x][y].n
																													? this.state
																															.locker_layout[
																															i
																													  ].data[x][y].n
																													: ''
																											}
																											onChange={(e) =>
																												this.noChange(
																													'n',
																													i,
																													x,
																													y,
																													e.target.value
																												)
																											}
																										></input>
																									</li>
																									<li>
																										<i className="locked"></i>
																										<input
																											type="number"
																											min="0"
																											max="999999"
																											value={
																												this.state.locker_layout[i]
																													.data[x][y].p
																													? this.state
																															.locker_layout[
																															i
																													  ].data[x][y].p
																													: ''
																											}
																											onChange={(e) =>
																												this.noChange(
																													'p',
																													i,
																													x,
																													y,
																													e.target.value
																												)
																											}
																										></input>
																									</li>
																									<li>
																										<input
																											className="check"
																											type="checkbox"
																											id={i + '' + x + '' + y}
																											checked={
																												this.state.locker_layout[i]
																													.data[x][y].disabled !==
																												true
																													? true
																													: false
																											}
																											onChange={(e) =>
																												this.checkChange(
																													'disabled',
																													i,
																													x,
																													y,
																													e.target.checked
																												)
																											}
																										></input>
																										<label
																											htmlFor={i + '' + x + '' + y}
																											style={{
																												color:
																													this.state
																														.locker_layout[i]
																														.data[x][y]
																														.disabled !== true
																														? 'inherit'
																														: '#aaa'
																											}}
																										>
																											<span></span>
																											{this.state.locker_layout[i]
																												.data[x][y].disabled !==
																											true
																												? '이용가능'
																												: '이용불가'}
																										</label>
																									</li>
																								</ul>
																							</div>
																							<button
																								className="delete"
																								onClick={(e) => this.deleteLocker(i, x, y)}
																							></button>
																						</div>
																					</td>
																				) : (
																					<td key={y} onClick={(e) => this.addLocker(i, x, y)}>
																						<div className={'blank_block'}></div>
																					</td>
																				)
																			)}
																		</tr>
																  ))
																: null
															: null}
													</tbody>
												</table>
												<div className="plus_right">
													<div className="button_wrap">
														<button className="add" onClick={(e) => this.addColumn(i)}></button>
														<button className="sub" onClick={(e) => this.deleteColumn(i)}></button>
													</div>
												</div>
												<div className="plus_bottom">
													<div className="button_wrap">
														<button className="add" onClick={(e) => this.addRow(i)}></button>
														<button className="sub" onClick={(e) => this.deleteRow(i)}></button>
													</div>
												</div>
											</div>
										</div>
									</div>
							  ))
							: null}

						<div className="panel blink">
							<button className="add" onClick={this.addLockerLayout}>
								+공간 개설하기
							</button>
						</div>

						<div className="btndiv">
							<button className="cancel" onClick={this.onCancel}>
								취소
							</button>
							<button className="save" onClick={this.saveCheck}>
								저장
							</button>
						</div>

						<div id="cancel_box" className="cancel_box">
							<span>취소하시겠습니까?</span>
							<button className="cancel" onClick={this.boxClose}>
								취소
							</button>
							<button className="confirm" onClick={this.cancelBack}>
								확인
							</button>
						</div>

						<div id="confirm_box" className="confirm_box">
							<p>입력하지 않은 락커가 있습니다.</p>
							<p>그래도 진행하시겠습니까?</p>
							<button className="cancel" onClick={this.boxClose}>
								취소
							</button>
							<button className="confirm" onClick={this.infoSave}>
								확인
							</button>
						</div>
					</div>
				</section>
			</div>
		)
	}
}

export default withNavigation(LockerSetting)
