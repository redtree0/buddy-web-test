import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import MenuSidenavItem from '../menu-sidenav-item/menu-sidenav-item.component'
import styles from './menu-sidenav.style'

import {
	staff_menuItems,
	normal_menuItems,
	super_menuItems,
	super_loginMenuItems,
	franchise_menuItems,
	franchise_loginMenuItems
} from '../../../config'
import CreateIcon from '@material-ui/icons/Create'
import axios from '../../../wrapper/axios'
import withNavigation from 'components/withNavigation'
import { alertMessage } from 'containers/studyroom/utils/roomUtils'
import { connect } from 'react-redux'
import { setLoginState } from 'reducers/common.reducer'

class MenuSidenav extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			placeList: [],
			superEl: null
		}
	}

	componentDidMount = () => {
		axios
			.get('/place/names?page=1&perPage=100&orderBy=seq&align=desc', {
				headers: { 'Content-type': 'application/json' }
			})
			.then((res) => {
				if (res.status == 200) {
					if (Number(window.sessionStorage.getItem('manager_permission')) === 9) {
						res.data.list &&
							res.data.list.sort((a, b) => {
								if (a.seq == 1 || a.seq == 30 || a.seq == 81) return -1
								else if (b.seq == 1 || b.seq == 30 || b.seq == 81) return 1
								else return 0
							})
						res.data.list &&
							res.data.list.unshift(
								{ key: 'PLV0vIiRKD', name: '테스트 스터디카페', seq: 5 },
								{ key: 'PLM4hppU1L', name: 'TEST 스터디카페', seq: 38 }
							)
					}
					this.setState({ placeList: res.data.list })
				}
			})
			.catch((error) => console.error(error))
	}

	constructNavItems = (itemsArray, classes) => {
		const arr = []
		itemsArray.forEach((el) => {
			arr.push(
				<MenuSidenavItem title={el.title} href={el.href} key={el.title} icon={el.icon} type={el.type} open={!!el.open}>
					{el.children && this.constructNavItems(el.children, classes)}
				</MenuSidenavItem>
			)
		})
		return <List className={classes.list}>{arr}</List>
	}

	componentDidUpdate() {
		// console.log(this.props.login)
		if (localStorage.getItem('manager_place') === '' || localStorage.getItem('manager_place') === null) {
			this.props.setLoginState(false)
		}
	}

	appendPlace = (manager_place) => {
		return (
			<div id="sideMenu_place">
				<div
					id="placeInfo"
					onClick={Number(window.sessionStorage.getItem('manager_permission')) >= 7 ? this.handleSuperClick : null}
				>
					<h5 style={{ cursor: 'pointer' }}>{JSON.parse(manager_place) && JSON.parse(manager_place).name}</h5>
					{Number(window.sessionStorage.getItem('manager_permission')) >= 7 && (
						<ArrowDropDown style={{ height: '100%', fontSize: '22px' }} />
					)}
				</div>
				<div>
					<MenuSidenavItem
						title={'기본정보 수정'}
						href={'/editinfo'}
						key={'기본정보 수정'}
						icon={<CreateIcon style={{ fontSize: 16 }} />}
					/>
				</div>
			</div>
		)
	}

	handleSuperClick = (event) => {
		this.setState({ superEl: event.currentTarget })
	}
	handleSuperClose = () => {
		this.setState({ superEl: null })
	}
	handlePlaceChange = (event, seq, key, name) => {
		axios
			.get('/place/' + seq + '/connect')
			.then((res) => {
				if (res.data.result === 'success') {
					localStorage.setItem('manager_place', JSON.stringify({ key: key, seq: seq, name: name }))
					localStorage.setItem('access_token', res.data.access_token)
					axios.defaults.headers.common['access_token'] = res.data.access_token
					if (window.location.pathname === '/seatsetting' || window.location.pathname === '/sprodsetting') {
						window.location.href = '/seat'
					} else if (window.location.pathname === '/lockersetting' || window.location.pathname === '/lprodsetting') {
						window.location.href = '/locker'
					} else {
						window.location.reload()
					}
				}
			})
			.catch((error) => console.error(error))
	}

	menuRender = () => {
		const { classes } = this.props
		return (
			<div className={classes.contentWrapper}>
				<div id="sideMenu" className={classes.content}>
					{/* 스터디공간 타이틀 레이아웃 추가 */}
					{this.appendPlace(localStorage.getItem('manager_place'))}
					{/* 공간 변경 메뉴 */}
					<Menu id="admin-menu" anchorEl={this.state.superEl} open={Boolean(this.state.superEl)} onClose={this.handleSuperClose}>
						{this.state.placeList.map((item) => (
							<MenuItem key={item.seq} onClick={(event) => this.handlePlaceChange(event, item.seq, item.key, item.name)}>
								{item.name}
							</MenuItem>
						))}
					</Menu>
					{/* 공간 변경 메뉴 */}

					{/* 일반관리자인지 슈퍼관리자인지 판단 메뉴 다르게 render */}
					{
						Number(window.sessionStorage.getItem('manager_permission')) === 9 //슈퍼관리자
							? localStorage.getItem('manager_place') //공간 접속 여부
								? this.constructNavItems(super_menuItems, classes)
								: this.constructNavItems(super_loginMenuItems, classes)
							: Number(window.sessionStorage.getItem('manager_permission')) === 7 //프차관리자
							? localStorage.getItem('manager_place') //공간 접속 여부
								? this.constructNavItems(franchise_menuItems, classes)
								: this.constructNavItems(franchise_loginMenuItems, classes)
							: Number(window.sessionStorage.getItem('manager_permission')) === 2 //일반관리자(사장)
							? this.constructNavItems(normal_menuItems, classes)
							: this.constructNavItems(staff_menuItems, classes) //일반관리자(직원)
					}
				</div>
			</div>
		)
	}

	render() {
		return this.menuRender()
	}
}

const mapStateToProps = (state) => ({
	login: state.common.login
})

const mapDispatchToProps = (dispatch) => {
	return {
		setLoginState: (state) => dispatch(setLoginState(state))
	}
}

MenuSidenav.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withNavigation(MenuSidenav)))
