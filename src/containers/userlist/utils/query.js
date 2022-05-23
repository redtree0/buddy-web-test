import axios from '../../../wrapper/axios'
export const getUsers = async ({ queryKey }) => {
	const [_key, { state, search, page }] = queryKey
	const res = await axios.get('/user', {
		headers: { 'Content-type': 'application/json' },
		params: {
			page: search ? 1 : page,
			perPage: state.sizePerPage,
			search: search,
			orderBy: state.defaultOrder,
			align: state.order,
			incCash: false,
			incRecentPlace: false
		}
	})
	console.log(res.data.list[0])
	return res.data
	// const users =
	// 	res.data.list &&
	// 	res.data.list.map((el) => {
	// 		return {
	// 			...el,
	// 			parent: el.parentNotice ? '동의(' + (el.parentPhone || '번호없음') + ')' : '',
	// 			cash: el.usersCash && el.usersCash.cash ? Number(el.usersCash.cash).toLocaleString() + '원' : '-',
	// 			recentPlace: el?.salesHistory?.place?.name ?? ''
	// 		}
	// 	})
	// return users
}
