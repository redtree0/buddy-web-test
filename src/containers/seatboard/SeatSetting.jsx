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
import withNavigation from 'components/withNavigation'

import React, { useEffect, useState } from 'react'
import { alertMessage } from 'containers/studyroom/utils/roomUtils'

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
const SeatSetting = (props) => {
	const { navigate } = props
	const [rot, setRot] = useState('')
	const [state, setState] = useState({
		place_layout: [],
		place_seq: null,
		select_thumb: 'seat_01',

		editLabelMode: '', //????????????/?????? ??? ?????? ??????
		seatLabel: '', //?????? ?????? ?????????
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
		selectedRoom: 'select',
		test: []
	})

	const getUsageData = async (i) => {
		axios
			.get('/desk/' + JSON.parse(localStorage.getItem('manager_place')).seq)
			.then((res) => {
				//
				if (res.status === 200) {
					setState((prev) => ({ ...prev, usage: res.data.usage }))
				}
			})
			.catch((error) => console.error(error))
		axios.get('/room/' + JSON.parse(localStorage.getItem('manager_place')).seq).then((res) => {
			if (res.status === 200) {
				setState((prev) => ({ ...prev, roomList: res.data }))
			}
		})
	}

	console.log(state)

	const onDelete = async (i) => {
		hasChanges = true
		// ??????????????? ???????????? ????????? ????????? ???????????? ??????
		for (let x = 0; x < state.usage.length; x++) {
			let deskNo = state.usage[x].deskNo
			for (let y = 0; y < state.place_layout[i].data.length; y++) {
				const useDesk = state.place_layout[i].data[y].filter((place) => (place.n ? place.n.includes(deskNo) : null))
				if (useDesk.length > 0) {
					alertMessage('????????? ????????? ??? ????????????.', '???????????? ????????? ????????????.', 'danger')
					return
				}
			}
		}
		setState((prev) => ({
			...prev,
			isEditing: true,
			place_layout: update(state.place_layout, {
				$splice: [[i, 1]]
			})
		}))
	}
	/**
	 * ?????? ??????
	 */
	const onCancel = async () => {
		navigate(-1)
	}
	const boxClose = () => {
		setState((prev) => ({ ...prev, cancelboxisOn: false }))
	}
	const cancelBack = () => {
		setState((prev) => ({ ...prev, cancelboxisOn: false }))
		navigate('/seat')
	}

	/**
	 * ?????? ??????
	 */
	const onSave = async () => {
		let totalDeskCount = 0,
			spaceDeskCount = 0
		for (let i = 0; i < state.place_layout.length; i++) {
			if (state.place_layout[i].spaceName === '' || state.place_layout[i].spaceName == null) {
				alertMessage('???????????? ????????????.', '???????????? ??????????????????.', 'danger')
				return
			}
			const { data: metrics } = state.place_layout[i]

			// ????????? ???, ?????? ??? ??????, ??????
			spaceDeskCount = !Array.isArray(metrics)
				? 0
				: metrics.reduce((counter, place) => {
						const seats = ['seat_01', 'seat_02', 'seat_03', 'office_s01', 'sofa_s01', 'two_s01']
						Array.isArray(place) &&
							place.forEach((p) => {
								// ???????????? ?????? ??????
								if (seats.includes(p.t) && p.n && typeof Number(p.n) === 'number') {
									counter += 1
								}
							})
						return counter
				  }, 0)

			spaceDeskCount &&
				setState((prev) => ({
					...prev,
					place_layout: update(state.place_layout, {
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
				layoutJson: state.place_layout
			})
			.then((res) => {
				if (res.status === 200) {
					hasChanges = false
					localStorage.setItem('place_layout', JSON.stringify(state.place_layout))
					setState((prev) => ({ ...prev, isEditing: false }))
					alertMessage('??????', '?????????????????????.', 'success')
					window.location = '/seat'
				}
			})
			.catch(function (error) {
				alertMessage('??????', error.message, 'danger')
				console.error(error)
			})
	}
	const href = (url) => navigate(url)

	const _click_t_menu = async (e) => {
		const list = document.querySelectorAll('.t_list')
		for (var i = 0; i < list.length; i++) {
			list[i].classList.remove('active')
		}
		if (e) {
			e.currentTarget.classList.add('active')
		}
	}

	/**
	 * ?????? ?????? event
	 */
	const _click_rotation = async (e) => {
		if (e) {
			const select_thumb = state.select_thumb
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
					rot === '90' ? setRot('') : setRot('90')
				} else {
					// 0 or 90 or 180 or 270
					rot === '90' ? setRot('180') : rot === '180' ? setRot('270') : rot === '270' ? setRot('') : setRot('90')
				}
			}
		}
	}

	/**
	 * ?????? Change handler
	 */
	const handleChange = async (prop, value, i) => {
		hasChanges = true
		setState((prev) => ({
			...prev,
			place_layout: update(state.place_layout, {
				[i]: {
					[prop]: { $set: value }
				}
			})
		}))
	}
	/**
	 * ?????? ?????? Change handler
	 */
	const seatLabelChange = async (value) => {
		hasChanges = true
		setState((prev) => ({ ...prev, seatLabel: value, isEditing: true }))
	}

	/**
	 * ????????? ?????? ?????? ?????? event
	 */
	const _click_b_menu = async (e, icon) => {
		const list = document.querySelectorAll('.b_list')
		for (var i = 0; i < list.length; i++) {
			list[i].classList.remove('active')
		}

		if (e) {
			e.currentTarget.classList.add('active')
			if (state.currentIcon === icon) {
				_click_rotation(e)
			} else {
				setRot('')
			}
			setState((prev) => ({ ...prev, currentIcon: icon, select_thumb: icon }))
		}
	}

	/**
	 * ??????/??????/??? ??????
	 */
	const handleClickSeat = async (i, x, y, data) => {
		setState((prev) => ({
			...prev,
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
		}))
	}

	/**
	 * ????????????/?????? ??? ??????
	 */
	const saveLabel = () => {
		hasChanges = true

		if (!state.seatLabel) {
			if (state.editLabelMode === 'label') {
				alertMessage('??????', '????????? ??????????????????', 'danger')
			} else if (state.editLabelMode === 'room') {
				alertMessage('??????', '??? ????????? ??????????????????', 'danger')
			} else {
				alertMessage('??????', '??????????????? ??????????????????', 'danger')
			}
			return
		} else if (state.editLabelMode === 'room' && (!state.selectedRoom || state.selectedRoom === 'select')) {
			alertMessage('??????', '?????? ??????????????????', 'danger')
			return
		}

		if (
			state.editLabelMode === 'seat' &&
			state.place_layout.some((pl, i) => {
				return (
					pl.data &&
					pl.data.some((row, x) => {
						return (
							row &&
							row.some(
								(col, y) => col.n === state.seatLabel && (i !== state.seat_i || x !== state.seat_x || y !== state.seat_y)
							)
						)
					})
				)
			})
		) {
			alertMessage('??????', '????????? ??????????????? ?????? ???????????????', 'danger')
			return
		}

		setState((prev) => ({
			...prev,
			place_layout: update(state.place_layout, {
				[state.seat_i]: {
					data: {
						[state.seat_x]: {
							[state.seat_y]: {
								n: { $set: state.seatLabel },
								rk: {
									$set: state.editLabelMode === 'room' && state.selectedRoom !== 'select' && state.selectedRoom
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
		}))
	}

	/**
	 * ?????? ??????
	 */
	const deleteSeat = async (i, x, y, t, drag) => {
		hasChanges = true
		// ????????? ??????????????? ?????? ??????
		if (!drag) {
			const deskNo = state.place_layout[i].data[x][y].n
			if (deskNo) {
				for (let z = 0; z < state.usage.length; z++) {
					let useDeskNo = state.usage[z].deskNo
					if (useDeskNo === deskNo) {
						alertMessage('??????', '???????????? ?????? ?????????.', 'danger')
						return
					}
				}
			}
		}

		setState((prev) => ({
			...prev,
			isEditing: true,
			place_layout: update(state.place_layout, {
				[i]: {
					data: {
						[x]: {
							[y]: { $set: { t: null, n: null } }
						}
					}
				}
			})
		}))
	}

	/**
	 * ?????? ??????
	 */
	const addSeat = async (i, x, y, t, inputRot, k) => {
		hasChanges = true
		const select_thumb = t ? t : state.select_thumb
		const select_rot = inputRot ? inputRot : rot
		if (select_rot !== '') {
			setState((prev) => ({
				...prev,
				place_layout: update(state.place_layout, {
					[i]: {
						data: {
							[x]: {
								[y]: { $set: { t: select_thumb, rot: select_rot } }
							}
						}
					}
				})
			}))
		} else {
			setState((prev) => ({
				...prev,
				place_layout: update(state.place_layout, {
					[i]: {
						data: {
							[x]: {
								[y]: { $set: { t: select_thumb } }
							}
						}
					}
				})
			}))
		}
		const re = [...state.place_layout]
		re[i]['data'][x][y] = { t: select_thumb }
		if (
			select_thumb === 'seat_01' ||
			select_thumb === 'seat_02' ||
			select_thumb === 'seat_03' ||
			select_thumb === 'office_s01' ||
			select_thumb === 'sofa_s01' ||
			select_thumb === 'two_s01'
		) {
			setKey(i, x, y)
		}

		setState((prev) => ({ ...prev, isEditing: true }))
	}
	/**
	 * ?????? ??????
	 */
	const dragSeat = async (i, x, y, n, t, inputRot, k) => {
		hasChanges = true
		const select_thumb = t
		const select_rot = inputRot ? inputRot : ''
		let place_list = [...state.place_layout]
		place_list[i].data[x][y].t = select_thumb
		if (select_rot !== '') {
			place_list[i].data[x][y].rot = select_rot
		}
		if (
			select_thumb === 'seat_01' ||
			select_thumb === 'seat_02' ||
			select_thumb === 'seat_03' ||
			select_thumb === 'office_s01' ||
			select_thumb === 'sofa_s01' ||
			select_thumb === 'two_s01'
		) {
			place_list[i].data[x][y].k = k
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
			place_list[i].data[x][y].n = n
		}
		setState((prev) => ({
			...prev,
			place_layout: place_list
		}))
		// setState((prev) => ({ ...prev, isEditing: true }))
	}

	/**
	 * ?????? ??? set
	 */
	const setKey = async (_i, _x, _y) => {
		const place_layout = state.place_layout
		let p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let key = [...Array(10)].reduce((a) => a + p[~~(Math.random() * p.length)], '')

		for (let i = 0; i < place_layout.length; i++) {
			for (let x = 0; x < place_layout[i]['data'].length; x++) {
				for (let y = 0; y < place_layout[i]['data'][x].length; y++) {
					if (place_layout[i]['data'][x][y].k) {
						if (place_layout[i]['data'][x][y].k === key) {
							return setKey(_i, _x, _y)
						}
					}
				}
			}
		}
		let place_list = [...state.place_layout]
		place_list[_i].data[_x][_y].k = key
		if (rot !== '') {
			place_list[_i].data[_x][_y].rot = rot
		}
		setState((prev) => ({
			...prev,
			place_layout: place_list
		}))
	}

	/**
	 * ??? ?????? ?????? ??????
	 */
	const addColumn = async (i) => {
		hasChanges = true
		let _place_layout = state.place_layout
		const _y = _place_layout[i]['data'].length //??? ??????
		// if(_x < 24){
		for (let y = 0; y < _y; y++) {
			_place_layout[i]['data'][y].push({ t: null })
		}
		setState((prev) => ({ ...prev, place_layout: _place_layout, isEditing: true }))
	}

	/**
	 * ??? ?????? ?????? ??????
	 */
	const deleteColumn = async (i) => {
		hasChanges = true
		let _place_layout = state.place_layout
		const _x = _place_layout[i]['data'][0].length //??? ??????
		const _y = _place_layout[i]['data'].length //??? ??????
		let deleteYn = true
		if (_x > 2) {
			for (let y = 0; y < _y; y++) {
				const deskNo = _place_layout[i]['data'][y][_x - 1].n
				if (deskNo) {
					for (let z = 0; z < state.usage.length; z++) {
						let useDeskNo = state.usage[z].deskNo
						if (useDeskNo === deskNo) {
							deleteYn = false
							alertMessage('?????? ????????? ??? ????????????.', '???????????? ????????? ????????????.', 'danger')
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
			setState((prev) => ({ ...prev, place_layout: _place_layout, isEditing: true }))
		}
	}

	/**
	 * ??? ?????? ?????? ??????
	 */
	const addRow = async (i) => {
		hasChanges = true
		let pushArr = []
		for (let y = 0; y < state.place_layout[i]['data'][0].length; y++) {
			pushArr.push({ t: null })
		}

		setState((prev) => ({
			...prev,
			place_layout: update(state.place_layout, {
				[i]: {
					data: {
						$push: [pushArr]
					}
				}
			}),
			isEditing: true
		}))
	}

	/**
	 * ??? ?????? ?????? ??????
	 */
	const deleteRow = async (i) => {
		hasChanges = true
		if (state.place_layout[i]['data'].length > 2) {
			// ?????? ?????? ???????????? ????????? ????????? ????????? ??????
			const _y = state.place_layout[i]['data'].length //??? ??????
			for (let x = 0; x < state.usage.length; x++) {
				let deskNo = state.usage[x].deskNo
				for (let y = 0; y < state.place_layout[i].data[_y - 1].length; y++) {
					const useDesk = state.place_layout[i].data[_y - 1].filter((place) => (place.n ? place.n.includes(deskNo) : null))
					if (useDesk.length > 0) {
						alertMessage('?????? ????????? ??? ????????????.', '???????????? ????????? ????????????.', 'danger')
						return
					}
				}
			}

			setState((prev) => ({
				...prev,
				place_layout: update(state.place_layout, {
					[i]: {
						data: {
							$splice: [[state.place_layout[i]['data'].length - 1, 1]]
						}
					}
				}),
				isEditing: true
			}))
		}
	}

	/**
	 * ?????? ?????? ?????? ??????
	 */
	const addPlace = async () => {
		hasChanges = true
		const spaceData = {
			spaceName: '',
			deskCount: 0,
			data: data
		}

		setState((prev) => ({
			...prev,
			place_layout: update(state.place_layout, {
				$push: [spaceData]
			}),
			isEditing: true
		}))
	}

	const addZero = (n, digits) => {
		let zero = ''
		n = n.toString()

		if (n.length < digits) {
			for (let i = 0; i < digits - n.length; i++) zero += '0'
		}
		return zero + n
	}

	const onMouseDown = async (i, x, y, n, t, rot, k) => {
		// buttonPressTimer = setTimeout(() => {
		setState((prev) => ({ ...prev, isDrag: true, dragInfo: { i: i, x: x, y: y, n: n, t: t, rot: rot, k: k } }))
		// }, 1500);
	}

	const onMouseUp = async (change, i, x, y) => {
		if (change) {
			const dragInfo = state.dragInfo
			await dragSeat(i, x, y, dragInfo.n, dragInfo.t, dragInfo.rot, dragInfo.k)
			await deleteSeat(dragInfo.i, dragInfo.x, dragInfo.y, dragInfo.t, true)
		}
		// clearTimeout(this.buttonPressTimer);
		setState((prev) => ({
			...prev,
			isDrag: false,
			dragInfo: null
		}))
	}

	useEffect(() => {
		if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
			navigate('/login')
			return
		}
		if (md.mobile() !== null) {
			const mvp = document.getElementById('meta-viewport')
			mvp.setAttribute('content', 'width=800')
		}

		if (JSON.parse(localStorage.getItem('manager_place')).seq == localStorage.getItem('deskLayout_placeSeq')) {
			setState((prev) => ({
				...prev,
				place_layout: localStorage.getItem('place_layout') ? JSON.parse(localStorage.getItem('place_layout')) : [],
				place_seq: JSON.parse(localStorage.getItem('manager_place')).seq
			}))
			getUsageData()
		}

		window.onbeforeunload = function () {
			// if (hasChanges) return '?????? ????????? ????????? ????????? ???????????? ????????????.'
		}

		return () => {
			const mvp = document.getElementById('meta-viewport')
			mvp.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no')

			window.onbeforeunload = () => undefined
			localStorage.removeItem('place_layout')
			localStorage.removeItem('deskLayout_placeSeq')
		}
	}, [])
	const place_layout = state.place_layout
	const place_seq = state.place_seq

	return (
		<div id="root_body" style={{ height: '100%' }}>
			<ReactNotifications />
			{/* <Prompt when={isEditing} message="????????? ????????? ???????????? ????????? ???????????????" /> */}
			<section id="sedit_wrap" className="sedit_wrap" style={{ height: '100%' }}>
				<div id="tools_wrap" className="tools_wrap">
					<div className="window">
						<div className="box">
							<div className={classNames('thumb', state.select_thumb, rot ? 'rot_' + rot : '')}></div>
						</div>
						<button className="rotation" onClick={_click_rotation}>
							<div className="icon"></div>
						</button>
					</div>
					<ul className="group">
						<li className="t_list active" onClick={_click_t_menu}>
							<div className="menu">
								<span className="icon chair"></span>
								<span>??????</span>
							</div>
							<ol>
								<li className="b_list active" onClick={(e) => _click_b_menu(e, 'seat_01')}>
									<span className="icon seat_01"></span> <span>??????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'seat_02')}>
									<span className="icon seat_02"></span> <span>????????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'seat_03')}>
									<span className="icon seat_03"></span> <span>?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'office_s01')}>
									<span className="icon office_s01"></span> <span>????????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'sofa_s01')}>
									<span className="icon sofa_s01"></span> <span>????????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'two_s01')}>
									<span className="icon two_s01"></span> <span>2??????</span>
								</li>
							</ol>
						</li>
						<li className="t_list" onClick={_click_t_menu}>
							<div className="menu">
								<span className="icon room"></span>
								<span>???</span>
							</div>
							<ol>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'room_1x1')}>
									<span className="icon room_01"></span> <span>??? 1x1</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'room_1x2')}>
									<span className="icon room_02"></span> <span>??? 1x2</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'room_2x1')}>
									<span className="icon room_03"></span> <span>??? 2x1</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'room_2x2')}>
									<span className="icon room_04"></span> <span>??? 2x2</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'room_s01')}>
									<span className="icon seat_01"></span> <span>????????? ???</span>
								</li>
							</ol>
						</li>
						<li className="t_list" onClick={_click_t_menu}>
							<div className="menu">
								<span className="icon wall"></span> <span>??????</span>
							</div>
							<ol>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'wall_01')}>
									<span className="icon wall_01"></span> <span>??????/??????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'wall_02')}>
									<span className="icon wall_02"></span> <span>??????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'wall_03')}>
									<span className="icon wall_03"></span> <span>3?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'wall_04')}>
									<span className="icon wall_04"></span> <span>4?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'wall_05')}>
									<span className="icon wall_05"></span> <span>????????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'wall_06')}>
									<span className="icon wall_06"></span> <span>??????/???</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'wall_07')}>
									<span className="icon wall_07"></span> <span>?????????</span>
								</li>
							</ol>
						</li>
						<li className="t_list" onClick={_click_t_menu}>
							<div className="menu">
								<span className="icon route"></span> <span>??????</span>
							</div>
							<ol>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'route_01')}>
									<span className="icon route_01"></span> <span>??????/??????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'route_02')}>
									<span className="icon route_02"></span> <span>??????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'route_03')}>
									<span className="icon route_03"></span> <span>3?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'route_04')}>
									<span className="icon route_04"></span> <span>4?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'route_05')}>
									<span className="icon route_05"></span> <span>??????</span>
								</li>
							</ol>
						</li>
						<li className="t_list" onClick={_click_t_menu}>
							<div className="menu">
								<span className="icon partition"></span> <span>??????</span>
							</div>
							<ol>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'partition_01')}>
									<span className="icon partition_01"></span> <span>??????/??????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'partition_02')}>
									<span className="icon partition_02"></span> <span>??????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'partition_03')}>
									<span className="icon partition_03"></span> <span>3?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'partition_04')}>
									<span className="icon partition_04"></span> <span>4?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'partition_05')}>
									<span className="icon partition_05"></span> <span>?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'partition_06')}>
									<span className="icon partition_06"></span> <span>??????</span>
								</li>
							</ol>
						</li>
						<li className="t_list" onClick={_click_t_menu}>
							<div className="menu">
								<span className="icon etc"></span> <span>??????</span>
							</div>
							<ol>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'etc_01')}>
									<span className="icon etc_01"></span> <span>??????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'etc_02')}>
									<span className="icon etc_02"></span> <span>?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'etc_03')}>
									<span className="icon etc_03"></span> <span>?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'etc_04')}>
									<span className="icon etc_04"></span> <span>?????????</span>
								</li>
								<li className="b_list" onClick={(e) => _click_b_menu(e, 'etc_05')}>
									<span className="icon etc_05"></span> <span>?????????</span>
								</li>
							</ol>
						</li>
					</ul>
				</div>

				{/* ???????????? */}
				<div id="canvas_wrap" className="canvas_wrap no-drag">
					{place_layout
						? place_layout.map((p_layout, i) => (
								<div className="space no-drag" key={i}>
									<div className="panel no-drag">
										<div className="top no-drag">
											<span className="ribon_icon"></span> <span className="title">????????? :</span>
											<input
												className="space_name no-drag"
												placeholder="???) OO ??????????????? 2???"
												value={state.place_layout[i] ? state.place_layout[i].spaceName : ''}
												onChange={(e) => handleChange('spaceName', e.target.value, i)}
											/>
											<button className="save no-drag" onClick={(e) => onDelete(i)}>
												<span className="icon check"></span>
												<span className="text">????????????</span>
											</button>
										</div>
										<div className="body no-drag">
											<div className="grid no-drag">
												<table
													className={classNames(
														state.isDrag ? state.dragInfo.t : state.select_thumb,
														state.isDrag
															? state.dragInfo.rot
																? 'rot_' + state.dragInfo.rot
																: ''
															: rot
															? 'rot_' + rot
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
																							// onMouseDown={e => onMouseDown(i, x, y, place_layout[i]['data'][x][y].n ? place_layout[i]['data'][x][y].n : '', place_layout[i]['data'][x][y].t)}
																							onMouseUp={(e) => onMouseUp(false)}
																							className={classNames(
																								'block',
																								place_layout[i]['data'][x][y].t,
																								place_layout[i]['data'][x][y].t.startsWith(
																									'room_'
																								)
																									? 'room'
																									: '',
																								place_layout[i]['data'][x][y].rot
																									? 'rot_' +
																											place_layout[i]['data'][x][y]
																												.rot
																									: null,
																								place_layout[i]['data'][x][y].k
																							)}
																						>
																							{place_layout[i]['data'][x][y].t ===
																								'seat_01' ||
																							place_layout[i]['data'][x][y].t === 'seat_02' ||
																							place_layout[i]['data'][x][y].t === 'seat_03' ||
																							place_layout[i]['data'][x][y].t ===
																								'sofa_s01' ||
																							place_layout[i]['data'][x][y].t === 'two_s01' ||
																							place_layout[i]['data'][x][y].t ===
																								'office_s01' ? (
																								<span
																									className="number no-drag"
																									onClick={(e) =>
																										handleClickSeat(
																											i,
																											x,
																											y,
																											place_layout[i]['data'][x][y]
																										)
																									}
																								>
																									{place_layout[i]['data'][x][y].n
																										? place_layout[i]['data'][x][y].n
																										: ''}
																								</span>
																							) : place_layout[i]['data'][x][y].t ===
																							  'room_s01' ? (
																								<span
																									className="number"
																									onClick={(e) =>
																										handleClickSeat(
																											i,
																											x,
																											y,
																											place_layout[i]['data'][x][y]
																										)
																									}
																								>
																									{place_layout[i]['data'][x][y].n
																										? place_layout[i]['data'][x][y].n
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
																										handleClickSeat(
																											i,
																											x,
																											y,
																											place_layout[i]['data'][x][y]
																										)
																									}
																								>
																									{place_layout[i]['data'][x][y].n
																										? place_layout[i]['data'][x][y].n
																										: ''}
																								</span>
																							) : place_layout[i]['data'][x][y].t ==
																							  'etc_01' ? (
																								<span
																									className="etclabel no-drag"
																									onClick={(e) =>
																										handleClickSeat(
																											i,
																											x,
																											y,
																											place_layout[i]['data'][x][y]
																										)
																									}
																								>
																									{place_layout[i]['data'][x][y].n
																										? place_layout[i]['data'][x][y].n
																										: ''}
																								</span>
																							) : null}

																							<div
																								className="dragbtn"
																								onMouseDown={(e) =>
																									onMouseDown(
																										i,
																										x,
																										y,
																										place_layout[i]['data'][x][y].n
																											? place_layout[i]['data'][x][y]
																													.n
																											: '',
																										place_layout[i]['data'][x][y].t,
																										place_layout[i]['data'][x][y].rot
																											? place_layout[i]['data'][x][y]
																													.rot
																											: null,
																										place_layout[i]['data'][x][y].k
																									)
																								}
																							></div>
																							<div
																								className="closebtn"
																								onClick={(e) =>
																									deleteSeat(
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
																						onClick={(e) => addSeat(i, x, y, null, null, null)}
																					>
																						<div
																							onMouseUp={(e) =>
																								onMouseUp(
																									state.isDrag ? true : false,
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
														<button className="add" onClick={(e) => addColumn(i)}></button>
														<button className="sub" onClick={(e) => deleteColumn(i)}></button>
													</div>
												</div>
												<div className="plus_bottom">
													<div className="button_wrap">
														<button className="add" onClick={(e) => addRow(i)}></button>
														<button className="sub" onClick={(e) => deleteRow(i)}></button>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div id="edit_box" className="edit_box" style={{ display: state.editLabelMode ? 'block' : 'none' }}>
										<input
											type="text"
											value={state.seatLabel}
											onChange={(e) => seatLabelChange(e.target.value)}
										></input>
										{state.editLabelMode === 'room' && (
											<div>
												<Select
													className={'dialog_select'}
													value={state.selectedRoom}
													onChange={(e) => {
														setState((prev) => ({ ...prev, selectedRoom: e.target.value }))
													}}
												>
													<MenuItem key={'select'} value={'select'}>
														{'??? ??????'}
													</MenuItem>
													{state.roomList
														? state.roomList.map((room) => (
																<MenuItem key={room['key']} value={room['key']}>
																	{room['name']}
																</MenuItem>
														  ))
														: null}
												</Select>
											</div>
										)}

										<div className="row" style={{ padding: '0 12px' }}>
											<button className="col-xs-11 col-sm-5 confirm" onClick={saveLabel}>
												??????
											</button>
										</div>
									</div>
								</div>
						  ))
						: null}

					<div className="panel blink">
						<button className="add" onClick={addPlace}>
							+?????? ????????????
						</button>
					</div>

					<div className="panel btndiv">
						<button className="cancel" onClick={onCancel}>
							??????
						</button>
						<button className="save" onClick={onSave}>
							??????
						</button>
					</div>

					<div id="cancel_box" className="cancel_box" style={{ display: state.cancelboxisOn ? 'block' : 'none' }}>
						<span>?????????????????????????</span>
						<button className="cancel" onClick={boxClose}>
							??????
						</button>
						<button className="confirm" onClick={cancelBack}>
							??????
						</button>
					</div>
				</div>
			</section>
		</div>
	)
}

export default withStyles(styles, { withTheme: true })(withNavigation(SeatSetting))
