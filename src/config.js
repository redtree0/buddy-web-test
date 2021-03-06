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

// ----------------------------------?????? ??????----------------------------------
export const menuItems = [
	{
		title: '????????????',
		href: '/place'
	},
	{
		title: '???????????? ??????',
		href: '/editinfo'
	},
	{
		title: '????????????',
		href: '/dashboard'
	},
	{
		title: '????????????',
		href: '/member'
	},
	{
		title: '??????????????????',
		href: '/member/all'
	},
	{
		title: '??????',
		href: '/coupon'
	},
	{
		title: '????????? ??????',
		href: '/kakaotalk'
	},
	{
		title: '??????',
		href: '/notice'
	},
	{
		title: '??????????????????',
		href: '/autonoti'
	},
	{
		title: '?????? ????????? ??? ?????? ??????',

		href: '/seat'
	},
	{
		title: '???????????? ??????',
		href: '/sprodsetting'
	},
	{
		title: '????????? ?????????',
		href: '/seatsetting'
	},
	{
		title: '??????/?????????',
		href: '/period'
	},
	{
		title: '???',
		href: '/room'
	},
	{
		title: '??? ??????',
		href: '/roomsetting'
	},
	{
		title: '??????',
		href: '/locker'
	},
	{
		title: '?????? > ?????? ??????',
		href: '/lockersetting'
	},
	{
		title: '?????? > ????????????',
		href: '/lprodsetting'
	},
	{
		title: '????????????',
		href: '/sales'
	},
	{
		title: '????????????',
		href: '/income'
	},
	{
		title: '?????? ????????????',
		href: '/stats/sales'
	},
	{
		title: '????????? ??????',
		href: '/analysis/sales'
	},
	{
		title: '???????????? ????????????',
		href: '/analysis/time'
	},
	{
		title: '????????? ????????????',
		href: '/analysis/products'
	},
	{
		title: '??????????????????',
		href: '/analysis/funnels'
	},
	{
		title: '???????????????',
		href: '/chat/manager'
	},
	{
		title: '1:1??????',
		href: '/chat/user'
	},
	{
		title: '????????????',
		href: '/chat/member'
	},
	{
		title: '????????????',
		href: '/usage'
	},
	{
		title: '????????? ??????',
		href: '/history/user'
	}
]

// ----------------------------------????????? ??????----------------------------------
export const staff_menuItems = [
	{
		title: '????????????',
		href: '/dashboard',
		icon: <DashboardIcon style={iconStyle} />
	},
	{
		title: '??????/??????',
		href: '/seat',
		icon: <SeatIcon style={iconStyle} />
	},
	{
		title: '??????/?????????',
		href: '/period',
		icon: <TimerIcon style={iconStyle} />
	},
	{
		title: '???',
		href: '/room',
		icon: <StudyRoomIcon style={iconStyle} />
	},
	{
		title: '??????',
		href: '/locker',
		icon: <LockerIcon style={iconStyle} />
	},
	{
		title: '??????',
		href: '/member',
		icon: <PersonIcon style={iconStyle} />
	},
	{
		title: '????????????',
		href: '/usage',
		icon: <UsageIcon style={iconStyle} />
	},
	/* {
		title: '??????',
		href: '/history/user',
		icon: <HistoryIcon style={iconStyle} />
	}, */
	{
		title: '??????',
		href: '/notice',
		icon: <NotificationsIcon style={iconStyle} />
	},
	{
		title: '?????????',
		href: '/kakaotalk',
		icon: <ChatIcon style={iconStyle} />
	},
	{
		title: '??????',
		href: '/coupon',
		icon: <CouponIcon style={iconStyle} />
	}
]

// ----------------------------------??????????????? ??????----------------------------------
export const normal_loginMenuItems = [
	{
		title: '??????',
		href: '/sales',
		icon: <SalesIcon style={iconStyle} />
	},
	{
		title: '????????????',
		href: '/income',
		icon: <EventAvailableIcon style={iconStyle} />
	},
	{
		title: '??????/??????',
		icon: <PollIcon style={iconStyle} />,
		children: [
			{
				title: '?????? ????????????',
				href: '/stats/sales'
			},
			{
				title: '????????? ??????',
				href: '/analysis/sales'
			},
			{
				title: '???????????? ????????????',
				href: '/analysis/time'
			},
			{
				title: '????????? ????????????',
				href: '/analysis/products'
			},
			{
				title: '??????????????????',
				href: '/analysis/funnels'
			}
		]
	}
]

// ----------------------------------??????????????? ??????----------------------------------
export const franchise_loginMenuItems = [
	{
		title: '??????????????? ?????????',
		icon: <LockIcon style={iconStyle} />,
		open: true,
		children: [
			{
				title: '????????????',
				href: '/place',
				icon: <PlaceIcon style={iconStyle} />
			},
			{
				title: '????????????',
				href: '/member/all',
				icon: <PersonIcon style={iconStyle} />
			},
			{
				title: '??????',
				href: '/income/manage',
				icon: <EventAvailableIcon style={iconStyle} />
			}
		]
	}
]

// ----------------------------------??????????????? ??????(?????? ?????????)----------------------------------
export const normal_menuItems = [...staff_menuItems, ...normal_loginMenuItems]

// ----------------------------------??????????????? ??????(?????? ?????????)----------------------------------
export const franchise_menuItems = [...normal_menuItems, ...franchise_loginMenuItems]

// ----------------------------------??????????????? ??????(??????)----------------------------------
export const super_loginMenuItems = [
	{
		title: '???????????????',
		icon: <LockIcon style={iconStyle} />,
		open: true,
		children: [
			{
				title: '????????????',
				href: '/place',
				icon: <PlaceIcon style={iconStyle} />
			},
			{
				title: '??? ??????',
				href: '/user',
				icon: <AssignmentIndIcon style={iconStyle} />
			},
			{
				title: '????????????',
				href: '/member/all',
				icon: <PersonIcon style={iconStyle} />
			},
			{
				title: '??????-??????',
				href: '/cash/history',
				icon: <AttachMoney style={iconStyle} />
			},
			{
				title: '??????-????????????',
				href: '/cash/refund',
				icon: <MoneyOff style={iconStyle} />
			},
			{
				title: '??????-??????(??????)',
				href: '/cash/stats/place',
				icon: <DonutSmall style={iconStyle} />
			},
			{
				title: '??????-??????(PG)',
				href: '/cash/stats/pg',
				icon: <DonutSmall style={iconStyle} />
			},
			{
				title: '??????',
				href: '/income/manage',
				icon: <EventAvailableIcon style={iconStyle} />
			},
			{
				title: '?????? - ?????????',
				href: '/history/manager',
				icon: <UpdateIcon style={iconStyle} />
			},
			{
				title: '?????? - ??????',
				href: '/history/payments',
				icon: <PaymentIcon style={iconStyle} />
			},
			{
				title: '????????????',
				href: '/admin/notice',
				icon: <EventNoteIcon style={iconStyle} />
			}
			/* {
				title: '??????',
				href: '/coupon/manage'
			},
			{
				title: '??????',
				href: '/advertisement'
			},
			{
				title: '??????/??????',
				href: '/stats'
					} */
		]
	}
]

// ----------------------------------??????????????? ??????(?????? ?????????)----------------------------------
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
