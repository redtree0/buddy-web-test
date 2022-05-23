import React from 'react'

import HomeIcon from '@material-ui/icons/Home'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import AttachMoney from '@material-ui/icons/AttachMoney'
import MoneyOff from '@material-ui/icons/MoneyOff'
import DonutSmall from '@material-ui/icons/DonutSmall'
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol'
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import PinDropIcon from '@material-ui/icons/PinDrop'
import EmailIcon from '@material-ui/icons/Email'
import ExtensionIcon from '@material-ui/icons/Extension'
import MenuIcon from '@material-ui/icons/Menu'
import ViewModuleIcon from '@material-ui/icons/ViewModule'
import InfoIcon from '@material-ui/icons/Info'
import BuildIcon from '@material-ui/icons/Build'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import PaletteIcon from '@material-ui/icons/Palette'
import PersonIcon from '@material-ui/icons/Person'
import EventNoteIcon from '@material-ui/icons/EventNote'
import FaceIcon from '@material-ui/icons/Face'
import ChatIcon from '@material-ui/icons/Chat'
import DateRangeIcon from '@material-ui/icons/DateRange'
import CouponIcon from '@material-ui/icons/CardGiftcard'
import LockerIcon from '@material-ui/icons/ScreenLockLandscape'
import UsageIcon from '@material-ui/icons/ViewList'
import SeatIcon from '@material-ui/icons/Portrait'
import StudyRoomIcon from '@material-ui/icons/RecentActors'
import SalesIcon from '@material-ui/icons/MonetizationOn'
import PollIcon from '@material-ui/icons/Poll'
import LockIcon from '@material-ui/icons/LockOutline'
import PlaceIcon from '@material-ui/icons/Place'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import EventAvailableIcon from '@material-ui/icons/EventAvailable'
import EventSeatIcon from '@material-ui/icons/EventSeat'
import TimerIcon from '@material-ui/icons/Timer'
import HistoryIcon from '@material-ui/icons/History'
import UpdateIcon from '@material-ui/icons/Update'
import NotificationsIcon from '@material-ui/icons/Notifications'
import PaymentIcon from '@material-ui/icons/Payment'

import themes from './themes'

export const configuredTheme = themes[0].theme

export const configuredLayout = {
	currentLayout: 'classic',
	notificationsOpen: false
}

const iconStyle = {
	fontSize: 16
}

// ----------------------------------기본 메뉴----------------------------------
export const menuItems = [
	{
		title: '공간목록',
		href: '/place'
	},
	{
		title: '공간정보 수정',
		href: '/editinfo'
	},
	{
		title: '대시보드',
		href: '/dashboard'
	},
	{
		title: '회원목록',
		href: '/member'
	},
	{
		title: '통합회원목록',
		href: '/member/all'
	},
	{
		title: '쿠폰',
		href: '/coupon'
	},
	{
		title: '알림톡 내역',
		href: '/kakaotalk'
	},
	{
		title: '공지',
		href: '/notice'
	},
	{
		title: '자동알림설정',
		href: '/autonoti'
	},
	{
		title: '공간 배치도 및 좌석 현황',

		href: '/seat'
	},
	{
		title: '좌석상품 설정',
		href: '/sprodsetting'
	},
	{
		title: '배치도 에디터',
		href: '/seatsetting'
	},
	{
		title: '기간/충전권',
		href: '/period'
	},
	{
		title: '룸',
		href: '/room'
	},
	{
		title: '룸 설정',
		href: '/roomsetting'
	},
	{
		title: '락커',
		href: '/locker'
	},
	{
		title: '락커 > 락커 설정',
		href: '/lockersetting'
	},
	{
		title: '락커 > 상품설정',
		href: '/lprodsetting'
	},
	{
		title: '매출내역',
		href: '/sales'
	},
	{
		title: '수익정산',
		href: '/income'
	},
	{
		title: '월별 매출통계',
		href: '/stats/sales'
	},
	{
		title: '월매출 분석',
		href: '/analysis/sales'
	},
	{
		title: '시간대별 이용현황',
		href: '/analysis/time'
	},
	{
		title: '상품별 수익분석',
		href: '/analysis/products'
	},
	{
		title: '유입경로설문',
		href: '/analysis/funnels'
	},
	{
		title: '시스템문의',
		href: '/chat/manager'
	},
	{
		title: '1:1문의',
		href: '/chat/user'
	},
	{
		title: '회원문의',
		href: '/chat/member'
	},
	{
		title: '이용내역',
		href: '/usage'
	},
	{
		title: '사용자 기록',
		href: '/history/user'
	}
]

// ----------------------------------직원용 메뉴----------------------------------
export const staff_menuItems = [
	{
		title: '대시보드',
		href: '/dashboard',
		icon: <DashboardIcon style={iconStyle} />
	},
	{
		title: '공간/좌석',
		href: '/seat',
		icon: <SeatIcon style={iconStyle} />
	},
	{
		title: '기간/충전권',
		href: '/period',
		icon: <TimerIcon style={iconStyle} />
	},
	{
		title: '룸',
		href: '/room',
		icon: <StudyRoomIcon style={iconStyle} />
	},
	{
		title: '락커',
		href: '/locker',
		icon: <LockerIcon style={iconStyle} />
	},
	{
		title: '회원',
		href: '/member',
		icon: <PersonIcon style={iconStyle} />
	},
	{
		title: '이용내역',
		href: '/usage',
		icon: <UsageIcon style={iconStyle} />
	},
	/* {
		title: '기록',
		href: '/history/user',
		icon: <HistoryIcon style={iconStyle} />
	}, */
	{
		title: '공지',
		href: '/notice',
		icon: <NotificationsIcon style={iconStyle} />
	},
	{
		title: '알림톡',
		href: '/kakaotalk',
		icon: <ChatIcon style={iconStyle} />
	},
	{
		title: '쿠폰',
		href: '/coupon',
		icon: <CouponIcon style={iconStyle} />
	}
]

// ----------------------------------일반사장님 메뉴----------------------------------
export const normal_loginMenuItems = [
	{
		title: '매출',
		href: '/sales',
		icon: <SalesIcon style={iconStyle} />
	},
	{
		title: '수익정산',
		href: '/income',
		icon: <EventAvailableIcon style={iconStyle} />
	},
	{
		title: '통계/분석',
		icon: <PollIcon style={iconStyle} />,
		children: [
			{
				title: '월별 매출통계',
				href: '/stats/sales'
			},
			{
				title: '월매출 분석',
				href: '/analysis/sales'
			},
			{
				title: '시간대별 이용현황',
				href: '/analysis/time'
			},
			{
				title: '상품별 수익분석',
				href: '/analysis/products'
			},
			{
				title: '유입경로설문',
				href: '/analysis/funnels'
			}
		]
	}
]

// ----------------------------------프차관리자 메뉴----------------------------------
export const franchise_loginMenuItems = [
	{
		title: '프랜차이즈 관리자',
		icon: <LockIcon style={iconStyle} />,
		open: true,
		children: [
			{
				title: '공간관리',
				href: '/place',
				icon: <PlaceIcon style={iconStyle} />
			},
			{
				title: '통합회원',
				href: '/member/all',
				icon: <PersonIcon style={iconStyle} />
			},
			{
				title: '정산',
				href: '/income/manage',
				icon: <EventAvailableIcon style={iconStyle} />
			}
		]
	}
]

// ----------------------------------일반관리자 메뉴(공간 접속시)----------------------------------
export const normal_menuItems = [...staff_menuItems, ...normal_loginMenuItems]

// ----------------------------------프차관리자 메뉴(공간 접속시)----------------------------------
export const franchise_menuItems = [...normal_menuItems, ...franchise_loginMenuItems]

// ----------------------------------슈퍼관리자 메뉴(루트)----------------------------------
export const super_loginMenuItems = [
	{
		title: '슈퍼관리자',
		icon: <LockIcon style={iconStyle} />,
		open: true,
		children: [
			{
				title: '공간관리',
				href: '/place',
				icon: <PlaceIcon style={iconStyle} />
			},
			{
				title: '앱 유저',
				href: '/user',
				icon: <AssignmentIndIcon style={iconStyle} />
			},
			{
				title: '통합회원',
				href: '/member/all',
				icon: <PersonIcon style={iconStyle} />
			},
			{
				title: '캐시-관리',
				href: '/cash/history',
				icon: <AttachMoney style={iconStyle} />
			},
			{
				title: '캐시-환불관리',
				href: '/cash/refund',
				icon: <MoneyOff style={iconStyle} />
			},
			{
				title: '캐시-통계(공간)',
				href: '/cash/stats/place',
				icon: <DonutSmall style={iconStyle} />
			},
			{
				title: '캐시-통계(PG)',
				href: '/cash/stats/pg',
				icon: <DonutSmall style={iconStyle} />
			},
			{
				title: '정산',
				href: '/income/manage',
				icon: <EventAvailableIcon style={iconStyle} />
			},
			{
				title: '기록 - 관리자',
				href: '/history/manager',
				icon: <UpdateIcon style={iconStyle} />
			},
			{
				title: '기록 - 결제',
				href: '/history/payments',
				icon: <PaymentIcon style={iconStyle} />
			},
			{
				title: '공지사항',
				href: '/admin/notice',
				icon: <EventNoteIcon style={iconStyle} />
			}
			/* {
				title: '쿠폰',
				href: '/coupon/manage'
			},
			{
				title: '광고',
				href: '/advertisement'
			},
			{
				title: '통계/분석',
				href: '/stats'
					} */
		]
	}
]

// ----------------------------------슈퍼관리자 메뉴(공간 접속시)----------------------------------
export const super_menuItems = [
	...normal_menuItems,
	...super_loginMenuItems,
	{
		title: 'Reference',
		icon: <InfoIcon style={iconStyle} />,
		open: false,
		children: [
			{
				title: 'REFERENCES',
				type: 'header'
			},
			{
				title: 'Dashboards',
				icon: <HomeIcon style={iconStyle} />,
				children: [
					{
						title: 'Ecommerce',
						href: '/dashboards/ecommerce',
						icon: <ShoppingCartIcon style={iconStyle} />
					},
					{
						title: 'Crypto',
						href: '/dashboards/crypto',
						icon: <EuroSymbolIcon style={iconStyle} />
					},
					{
						title: 'Project',
						href: '/dashboards/project',
						icon: <EventNoteIcon style={iconStyle} />
					}
				]
			},
			{
				title: 'Theming',
				href: '/theming',
				icon: <BuildIcon style={iconStyle} />
			},
			{
				title: 'Apps',
				icon: <DesktopWindowsIcon style={iconStyle} />,
				children: [
					{
						title: 'Email',
						href: '/apps/email',
						icon: <EmailIcon style={iconStyle} />
					},
					{
						title: 'Todo',
						href: '/apps/todo',
						icon: <CheckCircleIcon style={iconStyle} />
					},
					{
						title: 'Maps',
						href: '/apps/maps',
						icon: <PinDropIcon style={iconStyle} />
					},
					{
						title: 'Calendar',
						href: '/apps/calendar',
						icon: <DateRangeIcon style={iconStyle} />
					},
					{
						title: 'Notes',
						href: '/apps/notes',
						icon: <EventNoteIcon style={iconStyle} />
					},
					{
						title: 'Contacts',
						href: '/apps/contacts',
						icon: <FaceIcon style={iconStyle} />
					},
					{
						title: 'Chat',
						href: '/apps/chat',
						icon: <ChatIcon style={iconStyle} />
					}
				]
			},
			{
				title: 'Form Controls',
				icon: <ExtensionIcon style={iconStyle} />,
				children: [
					{
						title: 'Autocomplete',
						href: '/elements/autocomplete'
					},
					{
						title: 'Selection Controls',
						href: '/elements/selection-controls'
					},
					{
						title: 'Picker',
						href: '/elements/picker'
					},
					{
						title: 'Text Fields',
						href: '/elements/text-fields'
					},
					{
						title: 'Selects',
						href: '/elements/selects'
					},
					{
						title: 'Buttons',
						href: '/elements/buttons'
					},
					{
						title: 'Progress',
						href: '/elements/progress'
					}
				]
			},
			{
				title: 'Navigation',
				icon: <MenuIcon style={iconStyle} />,
				children: [
					{
						title: 'App Bar',
						href: '/elements/app-bar'
					},
					{
						title: 'Menu',
						href: '/elements/menu'
					}
				]
			},
			{
				title: 'Layout',
				icon: <ViewModuleIcon style={iconStyle} />,
				children: [
					{
						title: 'List',
						href: '/elements/list'
					},
					{
						title: 'Cards',
						href: '/elements/cards'
					},
					{
						title: 'Paper',
						href: '/elements/paper'
					},
					{
						title: 'Avatars',
						href: '/elements/avatars'
					},
					{
						title: 'Steppers',
						href: '/elements/steppers'
					}
				]
			},
			{
				title: 'Typography',
				href: '/pages/typography',
				icon: <TextFormatIcon style={iconStyle} />
			},
			{
				title: 'Colors',
				href: '/pages/colors',
				icon: <PaletteIcon style={iconStyle} />
			},
			{
				title: 'Authentication',
				icon: <PersonIcon style={iconStyle} />,
				children: [
					{
						title: 'Login',
						href: '/login'
					},
					{
						title: 'Register',
						href: '/register'
					},
					{
						title: 'Forgot Password',
						href: '/forgot-password'
					},
					{
						title: 'Profile',
						href: '/profile'
					},
					{
						title: 'Lock Screen',
						href: '/lock'
					}
				]
			},
			{
				title: 'Errors',
				icon: <InfoIcon style={iconStyle} />,
				children: [
					{
						title: '404',
						href: '/errors/404'
					},
					{
						title: '500',
						href: '/errors/500'
					}
				]
			}
		]
	}
]
