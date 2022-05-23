import moment from 'moment'
import axios from '../../../wrapper/axios'

export const getList = async (startDate) => {
	const placeSeq = JSON.parse(localStorage.getItem('manager_place')).seq

	const periodList = () =>
		new Promise((resolve, reject) => {
			return axios
				.get('/income/period/list', {
					params: {
						placeSeq
					}
				})
				.then(({ data }) => {
					const re = {
						startDate,
						periodList: data.period.map((el) => ({
							value: el.startDate,
							label: moment(el.startDate).format('YYYY/M/D') + ' ~ ' + moment(el.endDate).format('D')
						}))
					}
					return resolve(re)
				})
				.catch((err) => reject(err))
		})

	const periodDetail = () =>
		new Promise((resolve, reject) => {
			return axios
				.get('/income/period/detail', {
					params: {
						placeSeq,
						startDate
					}
				})
				.then((res) => {
					return resolve({
						incomeData: res.data.income || {},
						incomeDetail: res.data.incomeDetail || []
					})
				})
				.catch((err) => reject(err))
		})

	try {
		const response = await Promise.all([periodList(), periodDetail()])
		const re = { ...response[0], ...response[1] }
		return re
	} catch (err) {
		throw new Error(err)
	}
}
