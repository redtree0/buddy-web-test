/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'

// Material components
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import withTheme from '@material-ui/core/styles/withTheme'
import withWidth, { isWidthDown } from '@material-ui/core/withWidth'

import PersonIcon from '@material-ui/icons/Person'
import SystemIcon from '@material-ui/icons/Feedback'
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic'
import ChatIcon from '@material-ui/icons/QuestionAnswer'

import MenuIcon from '@material-ui/icons/Menu'

// Actions
import { updateLayout, toggleSidenav, toggleNotifications } from '../../../actions/layout.actions'
import { changeTheme, changeThemeDirection } from '../../../actions/theme.actions'

// Menu Items
import { menuItems, super_menuItems } from '../../../config'

// Themes

import MobileDetect from 'mobile-detect'
import axios from '../../../wrapper/axios'
import { useLocation } from 'react-router-dom'

const md = new MobileDetect(window.navigator.userAgent)

function setTitle(items, currentPath) {
	for (let i = 0; i < items.length; i += 1) {
		if (items[i].href && items[i].href === currentPath) {
			return items[i].title === '매출내역'
				? `매출 > ${items[i].title}`
				: items[i].title === '수익정산'
				? `매출 > ${items[i].title}`
				: items[i].title === '월별 매출통계'
				? `통계/분석 > ${items[i].title}`
				: items[i].title === '월매출 분석'
				? `통계/분석 > ${items[i].title}`
				: items[i].title === '시간대별 이용현황'
				? `통계/분석 > ${items[i].title}`
				: items[i].title === '상품별 수익분석'
				? `통계/분석 > ${items[i].title}`
				: items[i].title
		}

		if (items[i].children) {
			const result = setTitle(items[i].children, currentPath)
			if (result) {
				return result
			}
		}
	}
	return null
}

function ContentToolbar(props) {
	const { width, layout } = props
	const location = useLocation()
	const showBurgerMenu = isWidthDown('sm', width) || !layout.sidenavOpen
	const [state, setState] = useState({
		layoutMenuEl: null,
		layoutMenuOpen: false,
		themeMenuEl: null,
		themeMenuOpen: false,
		adminEl: null,
		systemCnt: '',
		userCnt: '',
		memberCnt: ''
	})
	const { adminEl } = state

	const checkCnt = async () => {
		if (parseInt(sessionStorage.getItem('manager_seq'), 10) !== 1) {
			axios
				.get(`/chat/manager/${sessionStorage.getItem('manager_seq')}/super/1`, {
					params: {
						placeSeq: (JSON.parse(localStorage.getItem('manager_place')) || {}).seq
					}
				})
				.then((res) => {
					if (res.status === 200) {
						let cnt = 0
						for (let i = 0; i < res.data.length; i++) {
							if (parseInt(res.data[i].newMsgCnt, 10) > 0) {
								cnt += 1
							}
						}
						setState((prev) => ({ ...prev, systemCnt: cnt }))
					}
				})
				.catch((error) => console.error(error))
			axios
				.get('/chat/manager/user', {
					params: {
						placeSeq: (JSON.parse(localStorage.getItem('manager_place')) || {}).seq
					}
				})
				.then((res) => {
					if (res.status === 200) {
						let cnt = 0
						for (let i = 0; i < res.data.length; i++) {
							if (parseInt(res.data[i].newMsgCnt, 10) > 0) {
								cnt += 1
							}
						}
						setState((prev) => ({ ...prev, memberCnt: cnt }))
					}
				})
				.catch((error) => console.error(error))
		} else {
			axios
				.get('/chat/super/manager')
				.then((res) => {
					if (res.status === 200) {
						let scnt = 0
						for (let i = 0; i < res.data.length; i++) {
							if (parseInt(res.data[i].newMsgCnt, 10) > 0) {
								scnt += 1
							}
						}
						setState((prev) => ({ ...prev, systemCnt: scnt }))
					}
				})
				.catch((error) => console.error(error))
			axios
				.get('/chat/super/user')
				.then((res) => {
					if (res.status === 200) {
						let scnt = 0
						for (let i = 0; i < res.data.length; i++) {
							if (parseInt(res.data[i].newMsgCnt, 10) > 0) {
								scnt += 1
							}
						}
						setState((prev) => ({ ...prev, userCnt: scnt }))
					}
				})
				.catch((error) => console.error(error))

			if (localStorage.getItem('manager_place')) {
				axios
					.get('/chat/manager/user', {
						params: {
							placeSeq: (JSON.parse(localStorage.getItem('manager_place')) || {}).seq
						}
					})
					.then((res) => {
						if (res.status === 200) {
							let cnt = 0
							for (let i = 0; i < res.data.length; i++) {
								if (parseInt(res.data[i].newMsgCnt, 10) > 0) {
									cnt += 1
								}
							}
							setState((prev) => ({ ...prev, memberCnt: cnt }))
						}
					})
					.catch((error) => console.error(error))
			}
		}
	}

	const handleAdminClick = (event) => {
		setState((prev) => ({ ...prev, adminEl: event.currentTarget }))
	}

	const handleAdminClose = () => {
		setState((prev) => ({ ...prev, adminEl: null }))
	}

	const handleLogoutClick = () => {
		setState((prev) => ({ ...prev, adminEl: null }))
		callAPI()
	}

	const callAPI = () => {
		axios
			.get('/manager/logout', {
				headers: { 'Content-type': 'application/json' }
			})
			.then((res) => {
				if (res.data.result === 'success') {
					// 성공
					localStorage.clear()
					sessionStorage.clear()
					setTimeout(() => {
						window.location.href = '/login'
					}, 1000)
				} else {
					// 실패
				}
			})
			.catch((error) => console.error(error))
	}

	const handleChatClick = (url) => {
		window.location.href = url
	}

	useEffect(() => {
		checkCnt()
	}, [])
	return (
		<Toolbar>
			<IconButton
				color="inherit"
				aria-label="open sidenav"
				style={{ display: showBurgerMenu ? 'block' : 'none' }}
				onClick={props.toggleSidenav}
			>
				<MenuIcon />
			</IconButton>
			<Typography variant="title" color="inherit" noWrap style={{ fontSize: md.mobile() !== null ? '0.8rem' : '' }}>
				{setTitle(super_menuItems, location.pathname) || ''}
			</Typography>
			<span className="portal-flex" />

			{/* 관리자 서브 메뉴 */}
			<IconButton
				id="toolbar_systemBtn"
				color="inherit"
				aria-owns={adminEl ? 'admin-menu' : null}
				aria-haspopup="true"
				onClick={handleAdminClick}
			>
				<PersonIcon />
				<div id="toolbar_system">{sessionStorage.getItem('manager_id')}</div>
			</IconButton>

			<Menu id="admin-menu" anchorEl={adminEl} open={Boolean(adminEl)} onClose={handleAdminClose}>
				<MenuItem onClick={handleLogoutClick}>로그아웃</MenuItem>
			</Menu>
			{/* 관리자 서브 메뉴 */}

			{/* 시스템 문의 메뉴 */}
			<IconButton
				id="toolbar_systemBtn"
				color="inherit"
				aria-owns={adminEl ? 'admin-menu' : null}
				aria-haspopup="true"
				onClick={(e) => handleChatClick('/chat/manager')}
			>
				{state.systemCnt > 0 ? (
					<p
						style={{
							position: 'absolute',
							margin: '0px',
							top: '0',
							right: '0',
							color: 'white',
							background: 'red',
							minHeight: '20px',
							minWidth: '20px',
							textAlign: 'center',
							fontSize: '12px',
							borderRadius: '50%'
						}}
					>
						{state.systemCnt}
					</p>
				) : (
					''
				)}
				<SystemIcon />
				<div id="toolbar_system">시스템문의</div>
			</IconButton>
			{/* 시스템 문의 메뉴 */}

			{/* 1:1 문의 메뉴 */}
			{parseInt(sessionStorage.getItem('manager_seq')) === 9 ? (
				<IconButton
					id="toolbar_memberBtn"
					color="inherit"
					aria-owns={adminEl ? 'admin-menu' : null}
					aria-haspopup="true"
					onClick={(e) => handleChatClick('/chat/user')}
				>
					{state.userCnt > 0 ? (
						<p
							style={{
								position: 'absolute',
								margin: '0px',
								top: '0',
								right: '0',
								color: 'white',
								background: 'red',
								minHeight: '20px',
								minWidth: '20px',
								textAlign: 'center',
								fontSize: '12px',
								borderRadius: '50%'
							}}
						>
							{state.userCnt}
						</p>
					) : (
						''
					)}
					<HeadsetMicIcon />
					<div id="toolbar_system">1:1문의</div>
				</IconButton>
			) : null}
			{/* 1:1 문의 메뉴 */}

			{/* 회원 문의 메뉴 */}
			{localStorage.getItem('manager_place') ? (
				<IconButton
					id="toolbar_memberBtn"
					color="inherit"
					aria-owns={adminEl ? 'admin-menu' : null}
					aria-haspopup="true"
					onClick={(e) => handleChatClick('/chat/member')}
				>
					{state.memberCnt > 0 ? (
						<p
							style={{
								position: 'absolute',
								margin: '0px',
								top: '0',
								right: '0',
								color: 'white',
								background: 'red',
								minHeight: '20px',
								minWidth: '20px',
								textAlign: 'center',
								fontSize: '12px',
								borderRadius: '50%'
							}}
						>
							{state.memberCnt}
						</p>
					) : (
						''
					)}
					<ChatIcon />
					<div id="toolbar_member">회원문의</div>
				</IconButton>
			) : null}
		</Toolbar>
	)
}

function mapStateToProps(state) {
	return {
		layout: {
			sidenavOpen: state.layout.sidenavOpen
		}
	}
}

ContentToolbar.propTypes = {
	width: PropTypes.string.isRequired,
	layout: PropTypes.shape({
		sidenavOpen: PropTypes.bool
	}).isRequired,
	theme: PropTypes.shape({}).isRequired,
	toggleSidenav: PropTypes.func.isRequired,
	toggleNotifications: PropTypes.func.isRequired,
	updateLayout: PropTypes.func.isRequired,
	changeTheme: PropTypes.func.isRequired,
	changeThemeDirection: PropTypes.func.isRequired
}

export default compose(
	withWidth(),
	withTheme(),
	connect(mapStateToProps, {
		toggleSidenav,
		toggleNotifications,
		updateLayout,
		changeTheme,
		changeThemeDirection
	})
)(ContentToolbar)
