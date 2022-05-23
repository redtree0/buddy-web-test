import React, { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import scss from './usage.module.scss'
import moment from 'moment'
import MobileDetect from 'mobile-detect'
import UsageChart from './components/UsageChart'
import { useLocation } from 'react-router-dom'
import { Typography } from '@material-ui/core'
const md = new MobileDetect(window.navigator.userAgent)
const tabs = ['desk', 'room', 'locker', 'history']
function Usage() {
	const member = useLocation().state?.member
	const locate = useLocation().state
	const [state, setState] = useState(0)
	const formatVaccInfo = (user) => {
		if (!user) return ''
		else if (user.vaccPass) return '관리자확인'
		else if (user.vaccDegree > 0) {
			const vaccKindStr =
				user.vaccKind == 'az'
					? 'AZ'
					: user.vaccKind == 'pfi'
					? '화이자'
					: user.vaccKind == 'mod'
					? '모더나'
					: user.vaccKind == 'yan'
					? '얀센'
					: user.vaccKind == 'etc'
					? '기타'
					: ''
			return `${vaccKindStr} ${user.vaccDegree}차 접종<br/>(${user.vaccDate})`
		} else if (moment().year() - user.birthYear <= 18) return '미성년자'
		else if (user.vaccDegree == 0) return '미접종'
		else return '-'
	}

	return (
		<div
			id="main"
			className={scss.main}
			style={{
				minWidth: md.mobile() ? '100%' : null,
				maxWidth: md.tablet() ? '700px' : null,
				margin: md.mobile() ? '0' : '30px auto'
			}}
		>
			<ReactNotifications />

			<Typography variant="title" gutterBottom>
				{locate &&
					(member
						? `${member.name} 회원 이용내역`
						: locate.no
						? `${locate.no}번 ${locate.type == 'desk' ? '좌석' : locate.type == 'locker' ? '락커' : ''} 이용내역`
						: '')}
			</Typography>
			{member && (
				<div style={{ margin: '30px 20px 60px 20px' }}>
					<div className="react-bs-table react-bs-table-bordered">
						<table className="table table-bordered" style={{ background: 'white' }}>
							<thead>
								<tr style={{ height: '40px' }}>
									<th width="120px">이름</th>
									<th width="120px">전화번호</th>
									<th width="120px">캐시</th>
									<th width="120px">쿠폰</th>
									<th>메모</th>
									<th width="140px">가입</th>
									<th width="140px">백신접종</th>
								</tr>
							</thead>
							<tbody>
								<tr style={{ height: '50px' }}>
									<td>{member.name}</td>
									<td>{member.phone}</td>
									<td>{member.user && member.user.usersCash ? `${member.user.usersCash.cash}원` : '-'}</td>
									<td>
										{member.coupon && member.coupon.totalCnt
											? `${member.coupon.totalCnt}개 중 ${member.coupon.usedCnt}개 사용`
											: '-'}
									</td>
									<td>{member.memo || '-'}</td>
									<td>
										{member.wdate && moment(member.wdate).format('YYYY/MM/DD HH:mm')}
										{member.regMethod == 'app' ? ' (앱)' : member.regMethod == 'admin' ? ' (관리자)' : ''}
									</td>
									<td>
										<span dangerouslySetInnerHTML={{ __html: formatVaccInfo(member.user) }}></span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			)}
			{locate?.type ? (
				''
			) : (
				<AppBar position="static" color="default">
					<Tabs
						value={state}
						onChange={(e, value, key) => setState(value)}
						indicatorColor="primary"
						textColor="primary"
						fullWidth
					>
						<Tab label="좌석" />
						<Tab label="스터디룸" />
						<Tab label="락커" />
						<Tab label="기록" />
					</Tabs>
				</AppBar>
			)}

			{!navigator?.userAgent?.toLowerCase()?.includes('iphone') ? (
				<SwipeableViews axis="x" index={state} onChangeIndex={(idx) => setState(idx)}>
					<UsageChart memberKey={member?.key} lKey={locate?.key} title={locate?.type || tabs[0]} />
					<UsageChart memberKey={member?.key} lKey={locate?.key} title={locate?.type || tabs[1]} />
					<UsageChart memberKey={member?.key} lKey={locate?.key} title={locate?.type || tabs[2]} />
					<UsageChart memberKey={member?.key} lKey={locate?.key} title={locate?.type || tabs[3]} />
				</SwipeableViews>
			) : (
				<SwipeableViews disabled ignoreNativeScroll={false} axis="x" index={state} onChangeIndex={(idx) => setState(idx)}>
					<UsageChart memberKey={member?.key} lKey={locate?.key} title={locate?.type || tabs[0]} />
					<UsageChart memberKey={member?.key} lKey={locate?.key} title={locate?.type || tabs[1]} />
					<UsageChart memberKey={member?.key} lKey={locate?.key} title={locate?.type || tabs[2]} />
					<UsageChart memberKey={member?.key} lKey={locate?.key} title={locate?.type || tabs[3]} />
				</SwipeableViews>
			)}
		</div>
	)
}

export default Usage
