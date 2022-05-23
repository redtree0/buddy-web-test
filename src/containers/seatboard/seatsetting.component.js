import React from 'react'
// import { Prompt } from 'react-router'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import axios from '../../wrapper/axios'
import update from 'react-addons-update'
import MobileDetect from 'mobile-detect'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './seatboard.css'
import styles from './seatsetting.style'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const md = new MobileDetect(window.navigator.userAgent)

//20 x 20 default
const data = [
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	],
	[
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null },
		{ t: null }
	]
]

let hasChanges = false
class SeatSetting extends React.Component {
	constructor(props) {
		super(props)
		this.notificationDOMRef = React.createRef()

		this.state = {
			place_layout: [],
			place_seq: null,
			select_thumb: 'seat_01',
			select_rot: '',

			editLabelMode: '', //좌석번호/라벨 등 수정 팝업
			seatLabel: '', //좌석 번호 수정용
			seat_i: '',
			seat_x: '',
			seat_y: '',
			usage: null,

			cancelboxisOn: false,
			isEditing: false,
			currentIcon: 'seat_01',
			isDrag: false,
			dragInfo: null,

			roomList: [],
			selectedRoom: 'select'
		}
	}

	/**
	 * 좌석 페이지에서 좌석 정보 받아와서 세팅
	 */
	componentWillMount() {
		if (md.mobile() !== null) {
			const mvp = document.getElementById('meta-viewport')
			mvp.setAttribute('content', 'width=800')
		}
		setTimeout(() => {
			if (JSON.parse(localStorage.getItem('manager_place')).seq == localStorage.getItem('deskLayout_placeSeq')) {
				this.setState({
					place_layout: localStorage.getItem('place_layout') ? JSON.parse(localStorage.getItem('place_layout')) : [],
					place_seq: JSON.parse(localStorage.getItem('manager_place')).seq
				})
				this.getUsageData()
			}
		}, 0)

		window.onbeforeunload = function () {
			// if (hasChanges) return '저장 버튼을 누르지 않으면 반영되지 않습니다.'
		}
	}

	componentWillUnmount = () => {
		const mvp = document.getElementById('meta-viewport')
		mvp.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no')

		window.onbeforeunload = () => undefined
		localStorage.removeItem('place_layout')
		localStorage.removeItem('deskLayout_placeSeq')
	}

	getUsageData = async (i) => {
		axios
			.get('/desk/' + JSON.parse(localStorage.getItem('manager_place')).seq)
			.then((res) => {
				//
				if (res.status === 200) {
					this.setState({ usage: res.data.usage })
				}
			})
			.catch((error) => console.error(error))
		axios.get('/room/' + JSON.parse(localStorage.getItem('manager_place')).seq).then((res) => {
			if (res.status === 200) {
				this.setState({ roomList: res.data })
			}
		})
	}

	componentDidMount() {
		//로그인 여부 체크
		if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
			window.location.href = '/login'
			return
		}
	}

	/**
	 * 공간 삭제
	 */
	onDelete = async (i) => {
		hasChanges = true
		// 해당공간에 사용중인 좌석이 있으면 공간삭제 불가
		for (let x = 0; x < this.state.usage.length; x++) {
			let deskNo = this.state.usage[x].deskNo
			for (let y = 0; y < this.state.place_layout[i].data.length; y++) {
				const useDesk = this.state.place_layout[i].data[y].filter((place) => (place.n ? place.n.includes(deskNo) : null))
				if (useDesk.length > 0) {
					this.alertMessage('공간을 삭제할 수 없습니다.', '사용중인 좌석이 있습니다.', 'danger')
					return
				}
			}
		}
		await this.setState({
			place_layout: update(this.state.place_layout, {
				$splice: [[i, 1]]
			})
		})
		this.setState({ isEditing: true })
	}

	/**
	 * 취소 버튼
	 */
	onCancel = async () => {
		this.props.history.goBack()
	}
	boxClose = () => {
		this.setState({ cancelboxisOn: false })
	}
	cancelBack = () => {
		this.setState({ cancelboxisOn: false })
		window.location.href = '/desk'
	}

	/**
	 * 저장 버튼
	 */
	onSave = async () => {
		let totalDeskCount = 0,
			spaceDeskCount = 0
		for (let i = 0; i < this.state.place_layout.length; i++) {
			if (this.state.place_layout[i].spaceName === '' || this.state.place_layout[i].spaceName == null) {
				this.alertMessage('공간명이 없습니다.', '공간명을 입력해주세요.', 'danger')
				return
			}
			const { data: metrics } = this.state.place_layout[i]

			// 저장할 때, 좌석 수 조회, 갱신
			spaceDeskCount = !Array.isArray(metrics)
				? 0
				: metrics.reduce((counter, place) => {
						const seats = ['seat_01', 'seat_02', 'seat_03', 'office_s01', 'sofa_s01', 'two_s01']
						Array.isArray(place) &&
							place.forEach((p) => {
								// 좌석번호 할당 여부
								if (seats.includes(p.t) && p.n && typeof Number(p.n) === 'number') {
									counter += 1
								}
							})
						return counter
				  }, 0)

			spaceDeskCount &&
				(await this.setState({
					place_layout: update(this.state.place_layout, {
						[i]: {
							deskCount: {
								$set: spaceDeskCount
							}
						}
					})
				}))
			totalDeskCount += spaceDeskCount
		}

		await axios
			.post('/desk/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/layout', {
				managerSeq: sessionStorage.getItem('manager_seq'),
				deskCount: totalDeskCount,
				layoutJson: this.state.place_layout
			})
			.then((res) => {
				if (res.status === 200) {
					hasChanges = false
					localStorage.setItem('place_layout', JSON.stringify(this.state.place_layout))
					this.setState({ isEditing: false })
					this.alertMessage('완료', '저장되었습니다.', 'success')
					window.location = '/desk'
				}
			})
			.catch(function (error) {
				this.alertMessage('에러', error.message, 'danger')
				console.error(error)
			})
	}

	/**
	 * 페이지 이동
	 */
	href = (url) => {
		window.location.href = url
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
	 * 사이드 메뉴 상위 클릭 event
	 */
	_click_t_menu = async (e) => {
		const list = document.querySelectorAll('.t_list')
		for (var i = 0; i < list.length; i++) {
			list[i].classList.remove('active')
		}
		if (e) {
			e.currentTarget.classList.add('active')
		}
	}

	/**
	 * 사이드 메뉴 하위 클릭 event
	 */
	_click_b_menu = async (e, icon) => {
		const list = document.querySelectorAll('.b_list')
		for (var i = 0; i < list.length; i++) {
			list[i].classList.remove('active')
		}

		if (e) {
			e.currentTarget.classList.add('active')
			this.setState({ select_thumb: icon })
			if (this.state.currentIcon === icon) {
				this._click_rotation(e)
			} else {
				this.setState({ select_rot: '' })
			}
			this.setState({ currentIcon: icon })
		}
	}

	/**
	 * 회전 클릭 event
	 */
	_click_rotation = async (e) => {
		const select_rot = this.state.select_rot
		if (e) {
			const select_thumb = this.state.select_thumb
			if (select_thumb !== '') {
				if (
					select_thumb === 'wall_04' ||
					select_thumb === 'route_04' ||
					select_thumb === 'partition_04' ||
					select_thumb === 'etc_01' ||
					select_thumb === 'etc_02' ||
					select_thumb === 'etc_03' ||
					select_thumb === 'etc_04' ||
					select_thumb === 'etc_05' ||
					select_thumb === 'room_1x1' ||
					select_thumb === 'room_1x2' ||
					select_thumb === 'room_2x1' ||
					select_thumb === 'room_2x2'
				) {
					// only 0
				} else if (select_thumb === 'wall_01' || select_thumb === 'route_01' || select_thumb === 'partition_01') {
					// 0 or 90
					select_rot === '90' ? this.setState({ select_rot: '' }) : this.setState({ select_rot: '90' })
				} else {
					// 0 or 90 or 180 or 270
					select_rot === '90'
						? this.setState({ select_rot: '180' })
						: select_rot === '180'
						? this.setState({ select_rot: '270' })
						: select_rot === '270'
						? this.setState({ select_rot: '' })
						: this.setState({ select_rot: '90' })
				}
			}
		}
	}

	/**
	 * 기본 Change handler
	 */
	handleChange = async (prop, value, i) => {
		hasChanges = true
		this.setState({
			place_layout: update(this.state.place_layout, {
				[i]: {
					[prop]: { $set: value }
				}
			})
		})
	}

	/**
	 * 좌석 번호 Change handler
	 */
	seatLabelChange = async (value) => {
		hasChanges = true
		this.setState({ seatLabel: value, isEditing: true })
	}

	/**
	 * 좌석/라벨/룸 클릭
	 */
	handleClickSeat = async (i, x, y, data) => {
		this.setState({
			editLabelMode:
				data.t === 'etc_01'
					? 'label'
					: data.t === 'room_1x1' ||
					  data.t === 'room_1x2' ||
					  data.t === 'room_2x1' ||
					  data.t === 'room_2x2' ||
					  data.t === 'room_s01'
					? 'room'
					: 'seat',
			seatLabel: data.n,
			seat_i: i,
			seat_x: x,
			seat_y: y,
			seat_t: data.t,
			selectedRoom: data.rk || 'select'
		})
	}

	/**
	 * 좌석번호/라벨 등 저장
	 */
	saveLabel = () => {
		hasChanges = true

		if (!this.state.seatLabel) {
			if (this.state.editLabelMode === 'label') {
				this.alertMessage('경고', '라벨을 입력해주세요', 'danger')
			} else if (this.state.editLabelMode === 'room') {
				this.alertMessage('경고', '룸 명칭을 입력해주세요', 'danger')
			} else {
				this.alertMessage('경고', '좌석번호를 입력해주세요', 'danger')
			}
			return
		} else if (this.state.editLabelMode === 'room' && (!this.state.selectedRoom || this.state.selectedRoom === 'select')) {
			this.alertMessage('경고', '룸을 선택해주세요', 'danger')
			return
		}

		if (
			this.state.editLabelMode === 'seat' &&
			this.state.place_layout.some((pl, i) => {
				return (
					pl.data &&
					pl.data.some((row, x) => {
						return (
							row &&
							row.some(
								(col, y) =>
									col.n === this.state.seatLabel &&
									(i !== this.state.seat_i || x !== this.state.seat_x || y !== this.state.seat_y)
							)
						)
					})
				)
			})
		) {
			this.alertMessage('경고', '동일한 좌석번호가 이미 존재합니다', 'danger')
			return
		}

		this.setState({
			place_layout: update(this.state.place_layout, {
				[this.state.seat_i]: {
					data: {
						[this.state.seat_x]: {
							[this.state.seat_y]: {
								n: { $set: this.state.seatLabel },
								rk: {
									$set:
										this.state.editLabelMode === 'room' &&
										this.state.selectedRoom !== 'select' &&
										this.state.selectedRoom
								}
							}
						}
					}
				}
			}),
			editLabelMode: '',
			seatLabel: '',
			seat_i: '',
			seat_x: '',
			seat_y: '',
			seat_t: '',
			isEditing: true,
			selectedRoom: 'select'
		})
	}

	/**
	 * 좌석 삭제
	 */
	deleteSeat = async (i, x, y, t, drag) => {
		hasChanges = true
		// 좌석이 사용중이면 삭제 불가
		if (!drag) {
			const deskNo = this.state.place_layout[i].data[x][y].n
			if (deskNo) {
				for (let z = 0; z < this.state.usage.length; z++) {
					let useDeskNo = this.state.usage[z].deskNo
					if (useDeskNo === deskNo) {
						this.alertMessage('경고', '사용중인 좌석 입니다.', 'danger')
						return
					}
				}
			}
		}

		await this.setState({
			place_layout: update(this.state.place_layout, {
				[i]: {
					data: {
						[x]: {
							[y]: { $set: { t: null, n: null } }
						}
					}
				}
			})
		})

		this.setState({ isEditing: true })
	}

	/**
	 * 좌석 추가
	 */
	addSeat = async (i, x, y, t, rot, k) => {
		console.log(i, x, y, t, rot)
		hasChanges = true
		const select_thumb = t ? t : this.state.select_thumb
		const select_rot = rot ? rot : this.state.select_rotconsole.log(select_thumb)
		select_rot !== ''
			? this.setState({
					place_layout: update(this.state.place_layout, {
						[i]: {
							data: {
								[x]: {
									[y]: { $set: { t: select_thumb, rot: select_rot } }
								}
							}
						}
					})
			  })
			: this.setState({
					place_layout: update(this.state.place_layout, {
						[i]: {
							data: {
								[x]: {
									[y]: { $set: { t: select_thumb } }
								}
							}
						}
					})
			  })

		if (
			select_thumb === 'seat_01' ||
			select_thumb === 'seat_02' ||
			select_thumb === 'seat_03' ||
			select_thumb === 'office_s01' ||
			select_thumb === 'sofa_s01' ||
			select_thumb === 'two_s01'
		) {
			await this.setKey(i, x, y)
		}
		this.setState({ isEditing: true })
	}

	/**
	 * 좌석 이동
	 */
	dragSeat = async (i, x, y, n, t, rot, k) => {
		hasChanges = true
		const select_thumb = t
		const select_rot = rot ? rot : ''
		;(await select_rot) !== ''
			? this.setState({
					place_layout: update(this.state.place_layout, {
						[i]: {
							data: {
								[x]: {
									[y]: { $set: { t: select_thumb, rot: select_rot } }
								}
							}
						}
					})
			  })
			: this.setState({
					place_layout: update(this.state.place_layout, {
						[i]: {
							data: {
								[x]: {
									[y]: { $set: { t: select_thumb } }
								}
							}
						}
					})
			  })

		if (
			select_thumb === 'seat_01' ||
			select_thumb === 'seat_02' ||
			select_thumb === 'seat_03' ||
			select_thumb === 'office_s01' ||
			select_thumb === 'sofa_s01' ||
			select_thumb === 'two_s01'
		) {
			await this.setState({
				place_layout: update(this.state.place_layout, {
					[i]: {
						data: {
							[x]: {
								[y]: {
									k: { $set: k }
								}
							}
						}
					}
				})
			})
		}

		if (
			select_thumb === 'seat_01' ||
			select_thumb === 'seat_02' ||
			select_thumb === 'seat_03' ||
			select_thumb === 'office_s01' ||
			select_thumb === 'sofa_s01' ||
			select_thumb === 'two_s01' ||
			select_thumb === 'etc_01' ||
			select_thumb === 'room_1x1' ||
			select_thumb === 'room_1x2' ||
			select_thumb === 'room_2x1' ||
			select_thumb === 'room_2x2' ||
			select_thumb === 'room_s01'
		) {
			await this.setState({
				place_layout: update(this.state.place_layout, {
					[i]: {
						data: {
							[x]: {
								[y]: {
									n: { $set: n }
								}
							}
						}
					}
				})
			})
		}
		this.setState({ isEditing: true })
	}

	/**
	 * 좌석 키 set
	 */
	setKey = async (_i, _x, _y) => {
		const place_layout = this.state.place_layout
		let p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let key = [...Array(10)].reduce((a) => a + p[~~(Math.random() * p.length)], '')

		for (let i = 0; i < place_layout.length; i++) {
			for (let x = 0; x < place_layout[i]['data'].length; x++) {
				for (let y = 0; y < place_layout[i]['data'][x].length; y++) {
					if (place_layout[i]['data'][x][y].k) {
						if (place_layout[i]['data'][x][y].k === key) {
							return this.setKey(i, x, y)
						}
					}
				}
			}
		}

		let place_list = this.state.place_layout
		place_list[_i].data[_x][_y].k = key
		console.log(place_list)
		console.log('OK')

		this.setState({
			place_layout: update(this.state.place_layout, {
				[_i]: {
					data: {
						[_x]: {
							[_y]: {
								k: { $set: key }
							}
						}
					}
				}
			})
		})
	}

	/**
	 * 열 추가 버튼 클릭
	 */
	addColumn = async (i) => {
		hasChanges = true
		let _place_layout = this.state.place_layout
		const _y = _place_layout[i]['data'].length //행 갯수
		// if(_x < 24){
		for (let y = 0; y < _y; y++) {
			_place_layout[i]['data'][y].push({ t: null })
		}
		this.setState({ place_layout: _place_layout, isEditing: true })
	}

	/**
	 * 열 삭제 버튼 클릭
	 */
	deleteColumn = async (i) => {
		hasChanges = true
		let _place_layout = this.state.place_layout
		const _x = _place_layout[i]['data'][0].length //열 갯수
		const _y = _place_layout[i]['data'].length //행 갯수
		let deleteYn = true
		if (_x > 2) {
			for (let y = 0; y < _y; y++) {
				const deskNo = _place_layout[i]['data'][y][_x - 1].n
				if (deskNo) {
					for (let z = 0; z < this.state.usage.length; z++) {
						let useDeskNo = this.state.usage[z].deskNo
						if (useDeskNo === deskNo) {
							deleteYn = false
							this.alertMessage('열을 삭제할 수 없습니다.', '사용중인 좌석이 있습니다.', 'danger')
							return
						}
					}
				}
			}
			if (deleteYn) {
				for (let y = 0; y < _y; y++) {
					_place_layout[i]['data'][y].splice(_x - 1, 1)
				}
			}
			this.setState({ place_layout: _place_layout, isEditing: true })
		}
	}

	/**
	 * 행 추가 버튼 클릭
	 */
	addRow = async (i) => {
		hasChanges = true
		let pushArr = []
		for (let y = 0; y < this.state.place_layout[i]['data'][0].length; y++) {
			pushArr.push({ t: null })
		}

		await this.setState({
			place_layout: update(this.state.place_layout, {
				[i]: {
					data: {
						$push: [pushArr]
					}
				}
			}),
			isEditing: true
		})
	}

	/**
	 * 행 삭제 버튼 클릭
	 */
	deleteRow = async (i) => {
		hasChanges = true
		if (this.state.place_layout[i]['data'].length > 2) {
			// 해당 행에 사용중인 좌석이 있으면 행삭제 불가
			const _y = this.state.place_layout[i]['data'].length //행 갯수
			for (let x = 0; x < this.state.usage.length; x++) {
				let deskNo = this.state.usage[x].deskNo
				for (let y = 0; y < this.state.place_layout[i].data[_y - 1].length; y++) {
					const useDesk = this.state.place_layout[i].data[_y - 1].filter((place) => (place.n ? place.n.includes(deskNo) : null))
					if (useDesk.length > 0) {
						this.alertMessage('행을 삭제할 수 없습니다.', '사용중인 좌석이 있습니다.', 'danger')
						return
					}
				}
			}

			await this.setState({
				place_layout: update(this.state.place_layout, {
					[i]: {
						data: {
							$splice: [[this.state.place_layout[i]['data'].length - 1, 1]]
						}
					}
				}),
				isEditing: true
			})
		}
	}

	/**
	 * 공간 추가 버튼 클릭
	 */
	addPlace = async () => {
		hasChanges = true
		const spaceData = {
			spaceName: '',
			deskCount: 0,
			data: data
		}

		await this.setState({
			place_layout: update(this.state.place_layout, {
				$push: [spaceData]
			}),
			isEditing: true
		})
	}

	addZero = (n, digits) => {
		let zero = ''
		n = n.toString()

		if (n.length < digits) {
			for (let i = 0; i < digits - n.length; i++) zero += '0'
		}
		return zero + n
	}

	onMouseDown = async (i, x, y, n, t, rot, k) => {
		// this.buttonPressTimer = setTimeout(() => {
		this.setState({ isDrag: true, dragInfo: { i: i, x: x, y: y, n: n, t: t, rot: rot, k: k } })
		// }, 1500);
	}

	onMouseUp = async (change, i, x, y) => {
		if (change) {
			const dragInfo = await this.state.dragInfo
			await this.dragSeat(i, x, y, dragInfo.n, dragInfo.t, dragInfo.rot, dragInfo.k)
			await this.deleteSeat(dragInfo.i, dragInfo.x, dragInfo.y, dragInfo.t, true)
		}
		// clearTimeout(this.buttonPressTimer);
		await this.setState({
			isDrag: false,
			dragInfo: null
		})
	}

	render() {
		const place_layout = this.state.place_layout
		const place_seq = this.state.place_seq
		const isEditing = this.state.isEditing

		return (
			<div id="root_body" style={{ height: '100%' }}>
				<ReactNotifications />
				{/* <Prompt when={isEditing} message="페이지 이동시 작업중인 내용이 사라집니다" /> */}
				<section id="sedit_wrap" className="sedit_wrap" style={{ height: '100%' }}>
					<div id="tools_wrap" className="tools_wrap">
						<div className="window">
							<div className="box">
								<div
									className={classNames(
										'thumb',
										this.state.select_thumb,
										this.state.select_rot ? 'rot_' + this.state.select_rot : ''
									)}
								></div>
							</div>
							<button className="rotation" onClick={this._click_rotation}>
								<div className="icon"></div>
							</button>
						</div>
						<ul className="group">
							<li className="t_list active" onClick={this._click_t_menu}>
								<div className="menu">
									<span className="icon chair"></span>
									<span>좌석</span>
								</div>
								<ol>
									<li className="b_list active" onClick={(e) => this._click_b_menu(e, 'seat_01')}>
										<span className="icon seat_01"></span> <span>일반</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'seat_02')}>
										<span className="icon seat_02"></span> <span>반폐쇄형</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'seat_03')}>
										<span className="icon seat_03"></span> <span>폐쇄형</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'office_s01')}>
										<span className="icon office_s01"></span> <span>오피스형</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'sofa_s01')}>
										<span className="icon sofa_s01"></span> <span>라운지형</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'two_s01')}>
										<span className="icon two_s01"></span> <span>2인형</span>
									</li>
								</ol>
							</li>
							<li className="t_list" onClick={this._click_t_menu}>
								<div className="menu">
									<span className="icon room"></span>
									<span>룸</span>
								</div>
								<ol>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'room_1x1')}>
										<span className="icon room_01"></span> <span>룸 1x1</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'room_1x2')}>
										<span className="icon room_02"></span> <span>룸 1x2</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'room_2x1')}>
										<span className="icon room_03"></span> <span>룸 2x1</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'room_2x2')}>
										<span className="icon room_04"></span> <span>룸 2x2</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'room_s01')}>
										<span className="icon seat_01"></span> <span>좌석형 룸</span>
									</li>
								</ol>
							</li>
							<li className="t_list" onClick={this._click_t_menu}>
								<div className="menu">
									<span className="icon wall"></span> <span>외벽</span>
								</div>
								<ol>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'wall_01')}>
										<span className="icon wall_01"></span> <span>가로/세로</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'wall_02')}>
										<span className="icon wall_02"></span> <span>코너</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'wall_03')}>
										<span className="icon wall_03"></span> <span>3점교차</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'wall_04')}>
										<span className="icon wall_04"></span> <span>4점교차</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'wall_05')}>
										<span className="icon wall_05"></span> <span>내벽교차</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'wall_06')}>
										<span className="icon wall_06"></span> <span>시작/끝</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'wall_07')}>
										<span className="icon wall_07"></span> <span>출입구</span>
									</li>
								</ol>
							</li>
							<li className="t_list" onClick={this._click_t_menu}>
								<div className="menu">
									<span className="icon route"></span> <span>경로</span>
								</div>
								<ol>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'route_01')}>
										<span className="icon route_01"></span> <span>가로/세로</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'route_02')}>
										<span className="icon route_02"></span> <span>코너</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'route_03')}>
										<span className="icon route_03"></span> <span>3점교차</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'route_04')}>
										<span className="icon route_04"></span> <span>4점교차</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'route_05')}>
										<span className="icon route_05"></span> <span>시작</span>
									</li>
								</ol>
							</li>
							<li className="t_list" onClick={this._click_t_menu}>
								<div className="menu">
									<span className="icon partition"></span> <span>내벽</span>
								</div>
								<ol>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'partition_01')}>
										<span className="icon partition_01"></span> <span>가로/세로</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'partition_02')}>
										<span className="icon partition_02"></span> <span>코너</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'partition_03')}>
										<span className="icon partition_03"></span> <span>3점교차</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'partition_04')}>
										<span className="icon partition_04"></span> <span>4점교차</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'partition_05')}>
										<span className="icon partition_05"></span> <span>출입구</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'partition_06')}>
										<span className="icon partition_06"></span> <span>사면</span>
									</li>
								</ol>
							</li>
							<li className="t_list" onClick={this._click_t_menu}>
								<div className="menu">
									<span className="icon etc"></span> <span>기타</span>
								</div>
								<ol>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'etc_01')}>
										<span className="icon etc_01"></span> <span>라벨</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'etc_02')}>
										<span className="icon etc_02"></span> <span>화장실</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'etc_03')}>
										<span className="icon etc_03"></span> <span>식음료</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'etc_04')}>
										<span className="icon etc_04"></span> <span>프린터</span>
									</li>
									<li className="b_list" onClick={(e) => this._click_b_menu(e, 'etc_05')}>
										<span className="icon etc_05"></span> <span>시설물</span>
									</li>
								</ol>
							</li>
						</ul>
					</div>

					{/* 편집영역 */}
					<div id="canvas_wrap" className="canvas_wrap no-drag">
						{place_layout
							? place_layout.map((p_layout, i) => (
									<div className="space no-drag" key={i}>
										<div className="panel no-drag">
											<div className="top no-drag">
												<span className="ribon_icon"></span> <span className="title">공간명 :</span>
												<input
													className="space_name no-drag"
													placeholder="예) OO 스터디카페 2층"
													value={this.state.place_layout[i] ? this.state.place_layout[i].spaceName : ''}
													onChange={(e) => this.handleChange('spaceName', e.target.value, i)}
												/>
												<button className="save no-drag" onClick={(e) => this.onDelete(i)}>
													<span className="icon check"></span>
													<span className="text">공간삭제</span>
												</button>
											</div>
											<div className="body no-drag">
												<div className="grid no-drag">
													<table
														className={classNames(
															this.state.isDrag ? this.state.dragInfo.t : this.state.select_thumb,
															this.state.isDrag
																? this.state.dragInfo.rot
																	? 'rot_' + this.state.dragInfo.rot
																	: ''
																: this.state.select_rot
																? 'rot_' + this.state.select_rot
																: ''
														)}
													>
														<tbody>
															{place_layout[i]
																? place_layout[i]['data']
																	? place_layout[i]['data'].map((tr_layout, x) => (
																			<tr key={x}>
																				{place_layout[i]['data'][x].map((layout, y) =>
																					place_layout[i]['data'][x][y].t ? (
																						<td key={y}>
																							<div
																								// onMouseDown={e => this.onMouseDown(i, x, y, place_layout[i]['data'][x][y].n ? place_layout[i]['data'][x][y].n : '', place_layout[i]['data'][x][y].t)}
																								onMouseUp={(e) => this.onMouseUp(false)}
																								className={classNames(
																									'block',
																									place_layout[i]['data'][x][y].t,
																									place_layout[i]['data'][x][
																										y
																									].t.startsWith('room_')
																										? 'room'
																										: '',
																									place_layout[i]['data'][x][y].rot
																										? 'rot_' +
																												place_layout[i]['data'][x][
																													y
																												].rot
																										: null,
																									place_layout[i]['data'][x][y].k
																								)}
																							>
																								{place_layout[i]['data'][x][y].t ===
																									'seat_01' ||
																								place_layout[i]['data'][x][y].t ===
																									'seat_02' ||
																								place_layout[i]['data'][x][y].t ===
																									'seat_03' ||
																								place_layout[i]['data'][x][y].t ===
																									'sofa_s01' ||
																								place_layout[i]['data'][x][y].t ===
																									'two_s01' ||
																								place_layout[i]['data'][x][y].t ===
																									'office_s01' ? (
																									<span
																										className="number no-drag"
																										onClick={(e) =>
																											this.handleClickSeat(
																												i,
																												x,
																												y,
																												place_layout[i]['data'][x][
																													y
																												]
																											)
																										}
																									>
																										{place_layout[i]['data'][x][y].n
																											? place_layout[i]['data'][x][y]
																													.n
																											: ''}
																									</span>
																								) : place_layout[i]['data'][x][y].t ===
																								  'room_s01' ? (
																									<span
																										className="number"
																										onClick={(e) =>
																											this.handleClickSeat(
																												i,
																												x,
																												y,
																												place_layout[i]['data'][x][
																													y
																												]
																											)
																										}
																									>
																										{place_layout[i]['data'][x][y].n
																											? place_layout[i]['data'][x][y]
																													.n
																											: ''}
																									</span>
																								) : [
																										'room_1x1',
																										'room_1x2',
																										'room_2x1',
																										'room_2x2'
																								  ].includes(
																										place_layout[i]['data'][x][y].t
																								  ) ? (
																									<span
																										className="label"
																										onClick={(e) =>
																											this.handleClickSeat(
																												i,
																												x,
																												y,
																												place_layout[i]['data'][x][
																													y
																												]
																											)
																										}
																									>
																										{place_layout[i]['data'][x][y].n
																											? place_layout[i]['data'][x][y]
																													.n
																											: ''}
																									</span>
																								) : place_layout[i]['data'][x][y].t ==
																								  'etc_01' ? (
																									<span
																										className="etclabel no-drag"
																										onClick={(e) =>
																											this.handleClickSeat(
																												i,
																												x,
																												y,
																												place_layout[i]['data'][x][
																													y
																												]
																											)
																										}
																									>
																										{place_layout[i]['data'][x][y].n
																											? place_layout[i]['data'][x][y]
																													.n
																											: ''}
																									</span>
																								) : null}

																								<div
																									className="dragbtn"
																									onMouseDown={(e) =>
																										this.onMouseDown(
																											i,
																											x,
																											y,
																											place_layout[i]['data'][x][y].n
																												? place_layout[i]['data'][
																														x
																												  ][y].n
																												: '',
																											place_layout[i]['data'][x][y].t,
																											place_layout[i]['data'][x][y]
																												.rot
																												? place_layout[i]['data'][
																														x
																												  ][y].rot
																												: null,
																											place_layout[i]['data'][x][y].k
																										)
																									}
																								></div>
																								<div
																									className="closebtn"
																									onClick={(e) =>
																										this.deleteSeat(
																											i,
																											x,
																											y,
																											place_layout[i]['data'][x][y].t,
																											false
																										)
																									}
																								></div>
																							</div>
																						</td>
																					) : (
																						<td
																							key={y}
																							onClick={(e) =>
																								this.addSeat(i, x, y, null, null, null)
																							}
																						>
																							<div
																								onMouseUp={(e) =>
																									this.onMouseUp(
																										this.state.isDrag ? true : false,
																										i,
																										x,
																										y
																									)
																								}
																								className={'blank_block'}
																							></div>
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

										<div
											id="edit_box"
											className="edit_box"
											style={{ display: this.state.editLabelMode ? 'block' : 'none' }}
										>
											<input
												type="text"
												value={this.state.seatLabel}
												onChange={(e) => this.seatLabelChange(e.target.value)}
											></input>
											{this.state.editLabelMode === 'room' && (
												<div>
													<Select
														className={'dialog_select'}
														value={this.state.selectedRoom}
														onChange={(e) => {
															this.setState({ selectedRoom: e.target.value })
														}}
													>
														<MenuItem key={'select'} value={'select'}>
															{'룸 선택'}
														</MenuItem>
														{this.state.roomList
															? this.state.roomList.map((room) => (
																	<MenuItem key={room['key']} value={room['key']}>
																		{room['name']}
																	</MenuItem>
															  ))
															: null}
													</Select>
												</div>
											)}

											<div className="row" style={{ padding: '0 12px' }}>
												<button className="col-xs-11 col-sm-5 confirm" onClick={this.saveLabel}>
													확인
												</button>
											</div>
										</div>
									</div>
							  ))
							: null}

						<div className="panel blink">
							<button className="add" onClick={this.addPlace}>
								+공간 개설하기
							</button>
						</div>

						<div className="panel btndiv">
							<button className="cancel" onClick={this.onCancel}>
								취소
							</button>
							<button className="save" onClick={this.onSave}>
								저장
							</button>
						</div>

						<div id="cancel_box" className="cancel_box" style={{ display: this.state.cancelboxisOn ? 'block' : 'none' }}>
							<span>취소하시겠습니까?</span>
							<button className="cancel" onClick={this.boxClose}>
								취소
							</button>
							<button className="confirm" onClick={this.cancelBack}>
								확인
							</button>
						</div>
					</div>
				</section>
			</div>
		)
	}
}

SeatSetting.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default withStyles(styles, { withTheme: true })(SeatSetting)
