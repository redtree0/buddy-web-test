import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import TableWidgetDeskUsage from './components/table-widget/TableWidgetDeskusage'
import TableWidgetSales from './components/table-widget/TableWidgetSales'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { useQuery } from 'react-query'
import CircleLoader from 'components/CircleLoader'
import { useNavigate } from 'react-router-dom'
import { loadValue } from './libs/dashboardUtils'
import Notice from './components/table-widget/Notice'
import { PortalDashboardPageWrapper, PortalWidget, PortalWidgetHeading } from './Dashboard.styled'
import DashboardSeat from './components/dashboard/DashboardSeat'
import { alertMessage } from 'containers/studyroom/utils/roomUtils'

function Dashboard() {
	const navigate = useNavigate()
	// const [seq, setSeq] = useState(localStorage.getItem('manager_place'))
	const seq = localStorage.getItem('manager_place')

	const [state, setState] = useState({
		place_seq: seq ? JSON.parse(seq).seq : null,

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
		parsingList: [],

		lastMonthSales: '0원', //지난달 매출
		thisMonthSales: '0원', //이번달 매충
		salesPercent: '0.0%',
		thisDaySales: '0원' //오늘 매충
	})

	const { data, error, isLoading } = useQuery('dashboard', async () => loadValue(state.place_seq))

	useEffect(() => {
		if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
			navigate('/login')
		}

		//PlaceSeq 체크
		if (localStorage.getItem('manager_place') === '' || localStorage.getItem('manager_place') === null) {
			navigate('/login')
		}
	}, [])

	useEffect(() => {
		if (!seq) {
			alertMessage('알림', '세션이 만료되었습니다. 다시 로그인해주세요.', 'danger', 4000)
			setTimeout(() => navigate('/login'), 4000)
		}
	}, [seq])
	return (
		<PortalDashboardPageWrapper>
			<ReactNotifications />
			<Notice />
			{data?.parsingList ? (
				<Grid item xs={12}>
					<Grid container justify="center" spacing={16}>
						<DashboardSeat data={data} />
						<PortalWidget key={6} item xs={12} sm={12} md={12}>
							<PortalWidgetHeading variant="subheading">좌석 이용현황</PortalWidgetHeading>

							<TableWidgetDeskUsage />
						</PortalWidget>

						<PortalWidget key={7} item xs={12} sm={12} md={12}>
							<PortalWidgetHeading variant="subheading">최근 매출내역</PortalWidgetHeading>

							<TableWidgetSales />
						</PortalWidget>
					</Grid>
				</Grid>
			) : (
				<div style={{ width: '100%', height: '50vh' }}>
					<CircleLoader />
				</div>
			)}
		</PortalDashboardPageWrapper>
	)
}

export default Dashboard
