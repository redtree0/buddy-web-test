import axios from '../../../wrapper/axios'
import moment from 'moment'

const lastMonth = '(' + (moment().subtract(1, 'month').month() + 1) + '월 1일 ~ ' + new Date().getDate() + '일' + ')'
const thisMonth = '(' + (moment().month() + 1) + '월 1일 ~ ' + new Date().getDate() + '일' + ')'

const members = {
	회원: [
		['회원수', 'userCnt', '명'],
		['현장가입', 'adminUserCnt', '명'],
		['앱', 'appUserCnt', '명']
	]
}
const seats = {
	좌석: [
		['사용중', 'useDeskCnt', ' / ', 'deskCount'],
		['자유석', 'freeDeskCnt', ' / ', 'freeDeskUsageCnt'],
		['지정석', 'dayDeskCnt'],
		['충전권', 'charDeskCnt', ' / ', 'charDeskUsageCnt'],
		['실시간, 1회권', 'realDeskCnt', ', ', 'timeDeskCnt']
	]
}
const rooms = {
	스터디룸: [
		['사용중', 'useRoomCnt', ' / ', 'roomCnt'],
		['잔여예약', 'reservedRoomCnt', '건'],
		['이번달', 'monthRoomCnt', '건']
	]
}
const lockers = { 락커: [['사용중', 'useLockerCnt', ' / ', 'lockerCnt']] }
const income = {
	매출: [
		[`지난달 ${lastMonth}`, 'lastMonthSales', '원'],
		[`이번달 ${thisMonth}`, 'thisMonthSales', '원'],
		['', '100%'],
		['오늘', 'thisDaySales', '원']
	]
}
const parsingList = [members, seats, rooms, lockers, income]

const loadValue = async (seq) => {
	try {
		if (!seq) {
			throw new Error('로그인 확인 불가')
		}
		const res = await axios.get('/metrics/dashboard/' + seq, {
			headers: {
				access_token: localStorage.getItem('access_token')
			}
		})
		const result = {
			...res.data,
			lastMonthSales: res.data.lastMonthSales ? Number(res.data.lastMonthSales) : 0,
			thisMonthSales: res.data.thisMonthSales ? Number(res.data.thisMonthSales) : 0,
			thisDaySales: res.data.thisDaySales ? Number(res.data.thisDaySales) : 0,
			salesPercent: '0.0%'
		}
		return {
			...result,
			parsingList
		}
		// setState((prev) => ({
		// 	...prev,
		// 	...result,
		// 	parsingList
		// }))
		// setLoading(false)
	} catch (error) {
		throw new Error(error)
	}
}

// {
// 	this.state.lastMonthSales > 0
// 		? this.state.lastMonthSales > this.state.thisMonthSales
// 			? (((this.state.thisMonthSales - this.state.lastMonthSales) / this.state.lastMonthSales) * 100).toFixed(1) + ' %'
// 			: '+ ' + (((this.state.thisMonthSales - this.state.lastMonthSales) / this.state.lastMonthSales) * 100).toFixed(1) + ' %'
// 		: '+ 100.0 %'
// }

export function parsingData(data, li, key) {
	return li[key].map((tmp) => {
		const arr = []
		tmp.forEach((m, i) => {
			if (!i) {
				arr.push(m)
				return
			}
			let value
			if (key === '매출' && data[m] !== '원') {
				value = [data[m]].toLocaleString()
			} else {
				value = data[m] !== undefined ? String(data[m]) : m
			}
			if (value === '') {
				value = m
			}
			if (arr[0] === '') {
				value =
					data.lastMonthSales > 0
						? data.lastMonthSales > data.thisMonthSales
							? (((data.thisMonthSales - data.lastMonthSales) / data.lastMonthSales) * 100).toFixed(1) + ' %'
							: '+ ' + (((data.thisMonthSales - data.lastMonthSales) / data.lastMonthSales) * 100).toFixed(1) + ' %'
						: '+ 100.0 %'
			}
			if (!arr[1]) {
				arr.push(value)
			} else {
				arr[1] = arr[1] + value
			}
		})
		return arr
	})
}

export { loadValue }
