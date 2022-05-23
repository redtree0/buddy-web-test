import { CardContent } from '@material-ui/core'
import { DashboardDiv, PortalWidget, PortalWidgetHeading, SeatCard } from 'containers/dashboard/Dashboard.styled'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@material-ui/icons/Person'
import SeatIcon from '@material-ui/icons/Portrait'
import StudyRoomIcon from '@material-ui/icons/RecentActors'
import LockerIcon from '@material-ui/icons/ScreenLockLandscape'
import PollIcon from '@material-ui/icons/Poll'
import Typography from '@material-ui/core/Typography'
import { parsingData } from 'containers/dashboard/libs/dashboardUtils'

const DashboardSeat = ({ data }) => {
	const navigate = useNavigate()

	return data.parsingList.map((m, i) => {
		const title = Object.keys(m)[0]

		let xs = 6
		let sm = 4
		let md = 4
		let lg = 2
		if (title === '매출') {
			xs = 12
			sm = 8
			md = 8
			lg = 4
		}
		const result = parsingData(data, m, title)

		return (
			<PortalWidget key={i} item xs={xs} sm={sm} md={md} lg={lg}>
				<div>
					<PortalWidgetHeading variant="subheading">{title}</PortalWidgetHeading>
					<SeatCard
						onClick={() => {
							if (title === '회원') {
								navigate('/member')
							} else if (title === '좌석') {
								navigate('/seat')
							} else if (title === '스터디룸') {
								navigate('/room')
							} else if (title === '락커') {
								navigate('/locker')
							} else {
								navigate('/sales')
							}
						}}
					>
						<CardContent>
							{result.map((li, i) => (
								<DashboardDiv key={i} className="row">
									<span>
										{title === '회원' ? (
											<PersonIcon />
										) : title === '좌석' ? (
											<SeatIcon />
										) : title === '스터디룸' ? (
											<StudyRoomIcon />
										) : title === '락커' ? (
											<LockerIcon />
										) : (
											li[0] && <PollIcon />
										)}
									</span>
									<span>
										<Typography variant="body2" component="p">
											{li[0]}
										</Typography>
									</span>
									<span>
										<Typography variant="body2" component="p">
											{li[1]}
										</Typography>
									</span>
								</DashboardDiv>
							))}
						</CardContent>
					</SeatCard>
				</div>
			</PortalWidget>
		)
	})
}

export default DashboardSeat
