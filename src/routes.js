import React, { useEffect } from 'react'

import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
// Test
import asyncComponent from './components/async.component'
import Classic from './layouts/layout-classic/layout-classic.component'
import Compact from './layouts/layout-compact/layout-compact.component'
import Toolbar from './layouts/layout-toolbar/layout-toolbar.component'
import Boxed from './layouts/layout-boxed/layout-boxed.component'
import Funky from './layouts/layout-funky/layout-funky.component'
import Tabbed from './layouts/layout-tabbed/layout-tabbed.component'
import NoLayout from './layouts/layout-none/layout-none.component'
import UserList from 'containers/userlist/UserList'

function Redirect() {
	const navigate = useNavigate()
	useEffect(() => {
		navigate('/')
	}, [])

	return
}

// AUTHENTICATION ROUTES

const AsyncLogin = asyncComponent(() => import('./containers/login/Login'))

// ERROR ROUTES
const AsyncError404 = asyncComponent(() => import('./containers/errors/404.component'))
const AsyncError500 = asyncComponent(() => import('./containers/errors/500.component'))

const AsyncNotFound = asyncComponent(() => import('./containers/not-found/not-found.component'))

// CUSTOM PAGES ROUTES

const AsyncEditInfo = asyncComponent(() => import('./containers/editinfo/Editinfo'))
const AsyncDashBoard = asyncComponent(() => import('./containers/dashboard/Dashboard'))
const AsyncStudyPlace = asyncComponent(() => import('./containers/studyplace/studyplace.component'))
const AsyncUserList = asyncComponent(() => import('./containers/userlist/userlist.component'))
const AsyncMemberList = asyncComponent(() => import('./containers/memberlist/memberlist.component'))
const AsyncAllMemberList = asyncComponent(() => import('./containers/memberlist/allMemberList.component'))
const AsyncNotice = asyncComponent(() => import('./containers/notice/notice.component'))
const AsyncMessage = asyncComponent(() => import('./containers/message/message.component'))
const AsyncAutoNoti = asyncComponent(() => import('./containers/message/autonoti.component'))
const AsyncSeatBoard = asyncComponent(() => import('./containers/seatboard/SeatBoard'))
const AsyncSeatSetting = asyncComponent(() => import('./containers/seatboard/SeatSetting'))
const AsyncSProdSetting = asyncComponent(() => import('./containers/seatboard/sprodsetting.component'))
const AsyncStudyRoom = asyncComponent(() => import('./containers/studyroom/studyroom.component'))
const AsyncRoomSetting = asyncComponent(() => import('./containers/studyroom/RoomSetting'))
const AsyncLockerBoard = asyncComponent(() => import('./containers/locker/lockerboard.component'))
const AsyncLockerSetting = asyncComponent(() => import('./containers/locker/lockersetting.component'))
const AsyncLProdSetting = asyncComponent(() => import('./containers/locker/lprodsetting.component'))
const AsyncCash = asyncComponent(() => import('./containers/cash/cash.component'))
const AsyncCashStatsPlace = asyncComponent(() => import('./containers/cash/CashStatsPlace'))
const AsyncCashStatsPg = asyncComponent(() => import('./containers/cash/cashStatsPg.component'))
const AsyncSales = asyncComponent(() => import('./containers/sales/sales.component'))
const AsyncSettlement = asyncComponent(() => import('./containers/settlement/Settlement'))

const AsyncStatistics = asyncComponent(() => import('./containers/statistics/statistics.component'))
const AsyncAnalysis = asyncComponent(() => import('./containers/statistics/analysis.component'))
const AsyncTimephased = asyncComponent(() => import('./containers/statistics/timephased.component'))
const AsyncProducts = asyncComponent(() => import('./containers/statistics/products.component'))
const AsyncFunnels = asyncComponent(() => import('./containers/statistics/funnels.component'))
const AsyncManagerChat = asyncComponent(() => import('./containers/managerchat/managerchat.component'))
const AsyncChatUser = asyncComponent(() => import('./containers/chat/userchat.component'))
const AsyncChatMember = asyncComponent(() => import('./containers/chat/memberchat.component'))

const AsyncUsage = asyncComponent(() => import('./containers/usage/Usage'))

const AsyncPeriod = asyncComponent(() => import('./containers/periodlist/periodlist.component'))
const AsyncIncome = asyncComponent(() => import('./containers/income/income.component'))
const AsyncRefund = asyncComponent(() => import('./containers/refund/refund.component'))
const AsyncHistoryUser = asyncComponent(() => import('./containers/history/history_user.component'))
const AsyncHistoryManager = asyncComponent(() => import('./containers/history/history_manager.component'))
const AsyncCoupon = asyncComponent(() => import('./containers/coupon/coupon.component'))
const AsyncPaymentList = asyncComponent(() => import('./containers/payments/paymentList.component'))
const AsyncAdminNotice = asyncComponent(() => import('./containers/AdminNotice/AdminNotice'))

const CheckSeqRouter = () => {
	if (localStorage.getItem('manager_place') === '' || localStorage.getItem('manager_place') === null) {
		if (window.location.pathname !== '/login') {
			return (window.location.href = '/login')
		}
	}
	return <Outlet />
}

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => {
	return (
		<Layout>
			<Component {...rest} />
		</Layout>
	)
}

const ClassicLayout = (props) => <Classic>{props.children}</Classic>

const CompactLayout = (props) => <Compact>{props.children}</Compact>

const ToolbarLayout = (props) => <Toolbar>{props.children}</Toolbar>

const BoxedLayout = (props) => <Boxed>{props.children}</Boxed>

const FunkyLayout = (props) => <Funky>{props.children}</Funky>

const TabbedLayout = (props) => <Tabbed>{props.children}</Tabbed>

// TODO: Consider looping through an object containing all routes
export default ({ childProps, layout }) => {
	if (localStorage.getItem('manager_place') === '' || localStorage.getItem('manager_place') === null) {
		if (window.location.pathname !== '/login') {
			return (window.location.href = '/login')
		}
	}
	let activeLayout
	switch (layout.currentLayout) {
		case 'classic':
			activeLayout = ClassicLayout
			break
		case 'compact':
			activeLayout = CompactLayout
			break
		case 'toolbar':
			activeLayout = ToolbarLayout
			break
		case 'boxed':
			activeLayout = BoxedLayout
			break
		case 'funky':
			activeLayout = FunkyLayout
			break
		case 'tabbed':
			activeLayout = TabbedLayout
			break
		default:
			activeLayout = ClassicLayout
	}

	return (
		<Routes>
			<Route path="" element={<CheckSeqRouter />}>
				<Route path="/" element={<AppRoute component={AsyncDashBoard} props={childProps} layout={activeLayout} />} />
				<Route path="login" element={<AppRoute component={AsyncLogin} props={childProps} layout={NoLayout} />} />
				{/* 고장남  */}
				<Route path="/user" element={<AppRoute component={AsyncUserList} props={childProps} layout={activeLayout} />} />
				{/* 고장남  */}
				<Route path="/place" element={<AppRoute component={AsyncStudyPlace} props={childProps} layout={activeLayout} />} />
				<Route path="/dashboard" element={<AppRoute component={AsyncDashBoard} props={childProps} layout={activeLayout} />} />
				<Route path="/editinfo" element={<AppRoute component={AsyncEditInfo} props={childProps} layout={activeLayout} />} />
				<Route path="/seat" element={<AppRoute component={AsyncSeatBoard} props={childProps} layout={activeLayout} />} />
				<Route path="/seatsetting" element={<AppRoute component={AsyncSeatSetting} props={childProps} layout={activeLayout} />} />
				<Route
					path="sprodsetting"
					element={<AppRoute path="/sprodsetting" exact component={AsyncSProdSetting} props={childProps} layout={activeLayout} />}
				/>
				// error nesting route
				<Route path="errors/404" element={<AppRoute component={AsyncError404} props={childProps} layout={NoLayout} />} />
				<Route path="errors/500" element={<AppRoute component={AsyncError500} props={childProps} layout={NoLayout} />} />
				<Route path="period" element={<AppRoute component={AsyncPeriod} props={childProps} layout={activeLayout} />} />
				<Route path="room" element={<AppRoute component={AsyncStudyRoom} props={childProps} layout={activeLayout} />} />
				<Route path="roomsetting" element={<AppRoute component={AsyncRoomSetting} props={childProps} layout={activeLayout} />} />
				// 락커 nesting route
				<Route path="locker" element={<AppRoute component={AsyncLockerBoard} props={childProps} layout={activeLayout} />} />
				<Route
					path="lockersetting"
					element={<AppRoute component={AsyncLockerSetting} props={childProps} layout={activeLayout} />}
				/>
				<Route path="lprodsetting" element={<AppRoute component={AsyncLProdSetting} props={childProps} layout={activeLayout} />} />
				{/* !!!! ----- usage 페이지 변경 및  수정 해야함 -> 오래걸림 ----- !!!!! */}
				<Route path="usage" element={<AppRoute component={AsyncUsage} props={childProps} layout={activeLayout} />} />
				{/* !! ----- Fetching 과정이 이상함 . UX 쓰레기임 ----- !! */}
				<Route path="member" element={<AppRoute component={AsyncMemberList} props={childProps} layout={activeLayout} />} />
				<Route path="member/all" element={<AppRoute component={AsyncAllMemberList} props={childProps} layout={activeLayout} />} />
				{/* 기능구현 필요함 */}
				<Route path="notice" element={<AppRoute component={AsyncNotice} props={childProps} layout={activeLayout} />} />
				<Route path="kakaotalk" element={<AppRoute component={AsyncMessage} props={childProps} layout={activeLayout} />} />
				<Route path="autoNoti" element={<AppRoute component={AsyncAutoNoti} props={childProps} layout={activeLayout} />} />
				{/* 기능구현 필요함 */}
				{/* 좌우 스크롤 안됨 */}
				<Route path="coupon" element={<AppRoute component={AsyncCoupon} props={childProps} layout={activeLayout} />} />
				{/* 좌우 스크롤 안됨 */}
				{/* 날짜선택 안했을 시 이번달 날짜 기준으로 자동 조회 기능 추가 */}
				<Route path="sales" element={<AppRoute component={AsyncSales} props={childProps} layout={activeLayout} />} />
				<Route path="income" element={<AppRoute component={AsyncSettlement} props={childProps} layout={activeLayout} />} />
				<Route path="income/manage" element={<AppRoute component={AsyncIncome} props={childProps} layout={activeLayout} />} />
				<Route path="stats/sales" element={<AppRoute component={AsyncStatistics} props={childProps} layout={activeLayout} />} />
				<Route path="analysis/sales" element={<AppRoute component={AsyncAnalysis} props={childProps} layout={activeLayout} />} />
				<Route path="analysis/time" element={<AppRoute component={AsyncTimephased} props={childProps} layout={activeLayout} />} />
				<Route path="analysis/products" element={<AppRoute component={AsyncProducts} props={childProps} layout={activeLayout} />} />
				<Route path="analysis/funnels" element={<AppRoute component={AsyncFunnels} props={childProps} layout={activeLayout} />} />
				{/* 날짜선택 안했을 시 이번달 날짜 기준으로 자동 조회 기능 추가 */}
				<Route path="chat/manager" element={<AppRoute component={AsyncManagerChat} props={childProps} layout={activeLayout} />} />
				{/* 사용자 피드백 슈퍼관리자에게 다이렉트로 전달되는 페이지 인것 같은데 라우터가 안붙어있음 사용안하는 것일수도 있음 */}
				<Route path="chat/user" element={<AppRoute component={AsyncChatUser} props={childProps} layout={activeLayout} />} />
				{/* 사용자 피드백 슈퍼관리자에게 다이렉트로 전달되는 페이지 인것 같은데 라우터가 안붙어있음 사용안하는 것일수도 있음 */}
				<Route path="chat/member" element={<AppRoute component={AsyncChatMember} props={childProps} layout={activeLayout} />} />
				<Route path="cash/history" element={<AppRoute component={AsyncCash} props={childProps} layout={activeLayout} />} />
				<Route path="cash/refund" element={<AppRoute component={AsyncRefund} props={childProps} layout={activeLayout} />} />
				<Route path="cash/stats/place" element={<AppRoute component={AsyncCashStatsPlace} layout={activeLayout} />} />
				<Route path="cash/stats/pg" element={<AppRoute component={AsyncCashStatsPg} props={childProps} layout={activeLayout} />} />
				<Route path="history/user" element={<AppRoute component={AsyncHistoryUser} props={childProps} layout={activeLayout} />} />
				<Route
					path="history/manager"
					element={<AppRoute component={AsyncHistoryManager} props={childProps} layout={activeLayout} />}
				/>
				<Route
					path="history/payments"
					element={<AppRoute component={AsyncPaymentList} props={childProps} layout={activeLayout} />}
				/>
				<Route
					path="history/payments"
					element={<AppRoute component={AsyncPaymentList} props={childProps} layout={activeLayout} />}
				/>
				<Route path="admin/notice" element={<AppRoute component={AsyncAdminNotice} layout={activeLayout} />} />
				<Route path="*" element={<AppRoute component={Redirect} layout={activeLayout} />} />
			</Route>
		</Routes>
	)
}

// 테스트 페이지 라우터
// <Route path="/register" element={<AppRoute component={AsyncRegister} props={childProps} layout={NoLayout} />} />
// <Route path="profile" element={<AppRoute component={AsyncProfile} props={childProps} layout={activeLayout} />} />
// <Route path="lock" element={<AppRoute component={AsyncLock} props={childProps} layout={NoLayout} />} />
// <Route path="forgot-password" element={<AppRoute component={AsyncForgot} props={childProps} layout={NoLayout} />} />
// <Route
//   path="dashboards/ecommerce"
//   element={<AppRoute component={AsyncEcommerceDashboard} props={childProps} layout={activeLayout} />}
// />
// <Route
//   path="dashboards/crypto"
//   element={<AppRoute component={AsyncCryptoDashboard} props={childProps} layout={activeLayout} />}
// />
// <Route
//   path="dashboards/project"
//   element={<AppRoute component={AsyncProjectDashboard} props={childProps} layout={activeLayout} />}
// />
// <Route path="theming" element={<AppRoute component={AsyncTheming} props={childProps} layout={activeLayout} />} />
// <Route path="apps/email" element={<AppRoute component={AsyncEmailApp} props={childProps} layout={activeLayout} />} />
// <Route path="apps/todo" element={<AppRoute component={AsyncTodoApp} props={childProps} layout={activeLayout} />} />
// <Route path="apps/maps" element={<AppRoute component={AsyncMapsApp} props={childProps} layout={activeLayout} />} />
// <Route path="apps/notes" element={<AppRoute component={AsyncNotesApp} props={childProps} layout={activeLayout} />} />
// <Route path="apps/contacts" element={<AppRoute component={AsyncContactsApp} props={childProps} layout={activeLayout} />} />
// <Route path="apps/chat" element={<AppRoute component={AsyncChatApp} props={childProps} layout={activeLayout} />} />
// <Route path="apps/calender" element={<AppRoute component={AsyncCalendarApp} props={childProps} layout={activeLayout} />} />
// <Route
//   path="/elements/autocomplete"
//   element={<AppRoute component={AsyncAutocompleteExample} props={childProps} layout={activeLayout} />}
// />
// <Route
//   path="/elements/selection-controls"
//   element={<AppRoute component={AsyncSelectionControlsExample} props={childProps} layout={activeLayout} />}
// />
// <Route path="/elements/picker" element={<AppRoute component={AsyncPickerExample} props={childProps} layout={activeLayout} />} />
// <Route
//   path="/elements/selects"
//   element={<AppRoute component={AsyncSelectExample} props={childProps} layout={activeLayout} />}
// />
// <Route
//   path="/elements/text-fields"
//   element={<AppRoute component={AsyncTextFieldExample} props={childProps} layout={activeLayout} />}
// />
// <Route
//   path="/elements/app-bar"
//   element={<AppRoute component={AsyncAppBarExample} props={childProps} layout={activeLayout} />}
// />
// <Route path="/elements/menu" element={<AppRoute component={AsyncMenuExample} props={childProps} layout={activeLayout} />} />
// <Route path="/elements/list" element={<AppRoute component={AsyncListExample} props={childProps} layout={activeLayout} />} />
// <Route path="/elements/cards" element={<AppRoute component={AsyncCardExample} props={childProps} layout={activeLayout} />} />
// <Route path="/elements/paper" element={<AppRoute component={AsyncPaperExample} props={childProps} layout={activeLayout} />} />
// <Route
//   path="/elements/avatars"
//   element={<AppRoute component={AsyncAvatarExample} props={childProps} layout={activeLayout} />}
// />
// <Route
//   path="/elements/steppers"
//   element={<AppRoute component={AsyncSteppersExample} props={childProps} layout={activeLayout} />}
// />
// <Route
//   path="/elements/buttons"
//   element={<AppRoute component={AsyncButtonExample} props={childProps} layout={activeLayout} />}
// />
// <Route
//   path="/elements/progress"
//   element={<AppRoute component={AsyncProgressExample} props={childProps} layout={activeLayout} />}
// />

{
	/* <Route path="pages/typography" element={<AppRoute component={AsyncTypography} props={childProps} layout={activeLayout} />} />
<Route path="/pages/colors" element={<AppRoute component={AsyncColors} props={childProps} layout={activeLayout} />} /> */
}
