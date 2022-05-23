import React from 'react'
import PropTypes from 'prop-types'
import withWidth from '@material-ui/core/withWidth'
import { withStyles } from '@material-ui/core/styles'
import themeStyles from './login.theme.style'
import compose from 'recompose/compose'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import axios from '../../wrapper/axios'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import scss from './login.module.scss'

class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentWillMount() {
		localStorage.removeItem('manager_id')
		localStorage.removeItem('manager_seq')
	}

	//접속 버튼 Click Event
	onClickLogin = () => {
		const loginID = document.getElementById('loginID').value.trim()
		const loginPW = document.getElementById('loginPW').value.trim()
		if (loginID === '' || loginPW === '') {
			loginID === ''
				? this.showNotification('WARNING', 'ID를 입력해주세요!', 'warning', 3000)
				: loginPW === ''
				? this.showNotification('WARNING', '비밀번호를 입력해주세요!', 'warning', 3000)
				: ''
			return
		}
		this.callAPI(loginID, loginPW)
	}

	showNotification = (title, message, type, Duration) => {
		Store.addNotification({
			title: title,
			message: message,
			type: type,
			insert: 'top',
			container: 'top-center',
			animationIn: ['animated', 'fadeIn'],
			animationOut: ['animated', 'fadeOut'],
			dismiss: { duration: Duration },
			dismissable: { click: true }
		})
	}

	callAPI = (ID, PW) => {
		axios
			.post(
				'/manager/login',
				{
					id: ID,
					password: PW
				},
				{
					headers: { access_token: '' }
				}
			)
			.then((res) => {
				if (res.data && res.data.result === 'success') {
					//성공
					localStorage.setItem(
						'manager_place',
						JSON.stringify({ key: res.data.place['key'], seq: res.data.placeSeq, name: res.data.place['name'] })
					)
					localStorage.setItem('access_token', res.data.access_token)
					axios.defaults.headers.common['access_token'] = res.data.access_token
					this.showNotification('SUCCESS', '로그인 완료', 'success', 500)
					setTimeout(function () {
						if (res.data.permission >= 7) {
							window.location.href = '/place'
						} else {
							window.location.href = '/dashboard'
						}
					}, 500)
				} else {
					//실패
					this.showNotification('FAIL', res.data.result, 'danger', 500)
				}
			})
			.catch((error) => console.error(error))
	}

	onKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopPropagation()
			this.onClickLogin()
		}
	}

	render() {
		const { classes, width } = this.props
		// Flip container to column on mobile screens.
		const panelDirection = width === 'xs' ? 'column' : 'row'

		return (
			<div className={scss.login_div}>
				<ReactNotifications />
				<Grid container direction="row" spacing={0} justify="center" alignItems="center" className={classes.background}>
					<Grid item sm={10} xs={12} className={scss.panel}>
						<Grid direction={panelDirection} className={scss.content_center} container spacing={0}>
							{/* 왼쪽 Box */}
							<Grid item sm={6} xs={12} className={scss.MuiGrid_grid}>
								<Card className={classNames(scss.card, classes['primary-card'])}></Card>
							</Grid>

							{/* 오른쪽 Box */}
							<Grid item sm={6} xs={12} className={classNames(scss.cardMargin, scss.MuiGrid_grid)}>
								<Card className={scss.card}>
									<CardContent>
										<Typography variant="headline" component="h2" gutterBottom>
											스터디모아 관리자 로그인
										</Typography>
										<TextField id="loginID" label="ID" fullWidth />
										<TextField
											id="loginPW"
											label="Password"
											fullWidth
											margin="normal"
											type="password"
											onKeyDown={this.onKeyDown}
										/>
									</CardContent>
									<CardActions className={scss['login-actions']}>
										<Button className={scss['login-button']} variant="raised" onClick={this.onClickLogin}>
											Login
										</Button>
										{/* <Button href="/forgot-password">Forgot Password</Button> */}
									</CardActions>
								</Card>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		)
	}
}

Login.propTypes = {
	classes: PropTypes.shape({}).isRequired,
	width: PropTypes.string.isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(Login)
