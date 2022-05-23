import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import themeStyles from './dashboard.theme.style'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import TableWidgetDeskUsage from './components/table-widget/TableWidgetDeskusage'
import TableWidgetSales from './components/table-widget/TableWidgetSales'

import PersonIcon from '@material-ui/icons/Person'
import SeatIcon from '@material-ui/icons/Portrait'
import StudyRoomIcon from '@material-ui/icons/RecentActors'
import LockerIcon from '@material-ui/icons/ScreenLockLandscape'
import PollIcon from '@material-ui/icons/Poll'

import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import axios from '../../wrapper/axios'
import moment from 'moment'
import scss from './dashboard.module.scss'

import CircleLoader from 'components/CircleLoader'
import { DashboardDiv, PortalDashboardPageWrapper, PortalWidget, PortalWidgetHeading } from './Dashboard.styled'
import Notice from './components/table-widget/Notice'

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			place_seq: JSON.parse(localStorage.getItem('manager_place')).seq ?? null,

			userCnt: 0, //회원수
			adminUserCnt: 0, //현장
			appUserCnt: 0, //앱

			deskCount: 0, //좌석수
			useDeskCnt: 0, //사용중좌석수
			timeDeskCnt: 0, //기간
			dayDeskCnt: 0, //당일

			roomCnt: 0, //스터디룸수
			useRoomCnt: 0, //사용중 스터디룸수
			reservedRoomCnt: 0, //예약
			monthRoomCnt: 0, //이번달

			lockerCnt: 0, //락커수
			useLockerCnt: 0, //사용중 락커수

			lastMonthSales: '0원', //지난달 매출
			thisMonthSales: '0원', //이번달 매충
			salesPercent: '0.0%',
			thisDaySales: '0원', //오늘 매충
			isLoading: true
		}
	}

	componentDidMount() {
		//로그인 여부 체크
		if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
			window.location = '/login'
			return
		}

		//PlaceSeq 체크
		if (localStorage.getItem('manager_place') === '' || localStorage.getItem('manager_place') === null) {
			window.location = '/place'
			return
		}
		this.loadValue()
	}

	payFormat = (pay) => {
		return pay ? pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'
	}

	loadValue = async () => {
		try {
			this.setState({ isLoading: true })
			const res = await axios.get('/metrics/dashboard/' + this.state.place_seq, {})
			this.setState({
				...res.data,
				lastMonthSales: res.data.lastMonthSales ? Number(res.data.lastMonthSales) : 0,
				thisMonthSales: res.data.thisMonthSales ? Number(res.data.thisMonthSales) : 0,
				thisDaySales: res.data.thisDaySales ? Number(res.data.thisDaySales) : 0,
				salesPercent: '0.0%'
			})
			this.setState({ isLoading: false })
		} catch (error) {
			this.setState({ isLoading: false })
		}
	}

	render() {
		const { classes } = this.props
		const { isLoading } = this.state
		return isLoading ? (
			<CircleLoader />
		) : (
			<PortalDashboardPageWrapper>
				<ReactNotifications />
				<Notice />
				{this.state.place_seq && (
					<Grid item xs={12}>
						<Grid container justify="center" spacing={16}>
							{/* <PortalWidget key={1} item xs={6} sm={4} md={4} lg={2}>
								<div>
									<PortalWidgetHeading variant="subheading">회원</PortalWidgetHeading>
									<Card className={scss.txt_center} onClick={() => this.props.history.push('/member')}>
										<CardContent>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<PersonIcon />
												</span>
												<span>
													<Typography variant="body2" component="p">
														회원수
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.userCnt}명
													</Typography>
												</span>
											</div>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<PersonIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														현장가입
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.adminUserCnt}명
													</Typography>
												</span>
											</div>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<PersonIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														앱
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.appUserCnt}명
													</Typography>
												</span>
											</div>
										</CardContent>
									</Card>
								</div>
							</PortalWidget>
							<PortalWidget key={2} item xs={6} sm={4} md={4} lg={2}>
								<div>
									<PortalWidgetHeading variant="subheading">좌석</PortalWidgetHeading>
									<Card className={scss.txt_center} onClick={() => this.props.history.push('/desk')}>
										<CardContent>
											<DashboardDiv className="row">

												<span>
													<SeatIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														사용중
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.useDeskCnt || 0} / {this.state.deskCount || 0}
													</Typography>
												</span>
											</DashboardDiv>
											<DashboardDiv className="row">

												<span>
													<SeatIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														자유석
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.freeDeskCnt || 0} / {this.state.freeDeskUsageCnt || 0}
													</Typography>
												</span>
											</DashboardDiv>
											<DashboardDiv className="row">
												<span>
													<SeatIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														지정석
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.dayDeskCnt}
													</Typography>
												</span>
											</DashboardDiv>
											<DashboardDiv className="row">
												<span>
													<SeatIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														충전권
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.charDeskCnt || 0} / {this.state.charDeskUsageCnt || 0}
													</Typography>
												</span>
											</DashboardDiv>
											<DashboardDiv className="row">
												<span>
													<SeatIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														실시간, 1회권
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.realDeskCnt || 0}, {this.state.timeDeskCnt || 0}
													</Typography>
												</span>
											</DashboardDiv>
										</CardContent>
									</Card>
								</div>
							</PortalWidget>


							<Grid key={3} item xs={6} sm={4} md={4} lg={2} className={classes.portalWidget}>
								<div>
									<Typography variant="subheading" className={classes.portalWidgetHeading}>
										스터디룸
									</Typography>
									<Card className={scss.txt_center} onClick={() => this.props.history.push('/room')}>
										<CardContent>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<StudyRoomIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														사용중
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.useRoomCnt} / {this.state.roomCnt}
													</Typography>
												</span>
											</div>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<StudyRoomIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														잔여예약
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.reservedRoomCnt}건
													</Typography>
												</span>
											</div>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<StudyRoomIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														이번달
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.monthRoomCnt}건
													</Typography>
												</span>
											</div>
										</CardContent>
									</Card>
								</div>
							</Grid>

							<Grid key={4} item xs={6} sm={4} md={4} lg={2} className={classes.portalWidget}>
								<div>
									<Typography variant="subheading" className={classes.portalWidgetHeading}>
										락커
									</Typography>
									<Card className={scss.txt_center} onClick={() => this.props.history.push('/locker')}>
										<CardContent>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<LockerIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														사용중
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.useLockerCnt} / {this.state.lockerCnt}
													</Typography>
												</span>
											</div>
										</CardContent>
									</Card>
								</div>
							</Grid>

							<Grid key={5} item xs={12} sm={8} md={8} lg={4} className={classes.portalWidget}>
								<div>
									<Typography variant="subheading" className={classes.portalWidgetHeading}>
										매출
									</Typography>
									<Card className={scss.txt_center} onClick={() => this.props.history.push('/sales')}>
										<CardContent>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<PollIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														지난달(
														{moment().subtract(1, 'month').month() + 1}월 1일 ~ {new Date().getDate()}일)
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.lastMonthSales.toLocaleString()}원
													</Typography>
												</span>
											</div>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<PollIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														이번달({moment().month() + 1}월 1일 ~ {new Date().getDate()}일)
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.thisMonthSales.toLocaleString()}원
													</Typography>
												</span>
											</div>
											<div className={classNames('row', scss.dashboard_div)}>
												<span></span>
												<span></span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.lastMonthSales > 0
															? this.state.lastMonthSales > this.state.thisMonthSales
																? (
																		((this.state.thisMonthSales - this.state.lastMonthSales) /
																			this.state.lastMonthSales) *
																		100
																  ).toFixed(1) + ' %'
																: '+ ' +
																  (
																		((this.state.thisMonthSales - this.state.lastMonthSales) /
																			this.state.lastMonthSales) *
																		100
																  ).toFixed(1) +
																  ' %'
															: '+ 100.0 %'}
													</Typography>
												</span>
											</div>
											<div className={classNames('row', scss.dashboard_div)}>
												<span>
													<PollIcon className={classes.leftIcon} />
												</span>
												<span>
													<Typography variant="body2" component="p">
														오늘
													</Typography>
												</span>
												<span>
													<Typography variant="body2" component="p">
														{this.state.thisDaySales.toLocaleString()}원
													</Typography>
												</span>
											</div>
										</CardContent>
									</Card>
								</div>
							</Grid> */}

							<Grid key={6} item xs={12} sm={12} md={12} className={classes.portalWidget}>
								<Typography variant="subheading" className={classes.portalWidgetHeading}>
									좌석 이용현황
								</Typography>

								<TableWidgetDeskUsage />
							</Grid>

							<Grid key={7} item xs={12} sm={12} md={12} className={classes.portalWidget}>
								<Typography variant="subheading" className={classes.portalWidgetHeading}>
									최근 매출내역
								</Typography>

								<TableWidgetSales />
							</Grid>
						</Grid>
					</Grid>
				)}
			</PortalDashboardPageWrapper>
		)
	}
}

Dashboard.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default withStyles(themeStyles, { withTheme: true })(Dashboard)
