import axios from '../../../wrapper/axios'
export const loadData = async (state, setState, alertMessage) => {
	const { firstDate: from, lastDate: to } = state
	if (!from || !to) return alertMessage('경고', '날짜를 선택해주세요.', 'danger')
	try {
		const res = await axios.get('/cash/stats/place', {
			params: {
				from,
				to
			}
		})
		let sum = 0,
			count = 0
		const statsData = res.data
			? res.data.map((e) => {
					sum += e.sum * 1
					count += e.count * 1
					return { ...e, placeName: e.place.name }
			  })
			: []
		statsData.push({ placeName: '합계', sum, count })
		setState((prev) => ({ ...prev, statsData }))
	} catch (error) {
		throw new Error(error)
	}
}
