import MobileDetect from 'mobile-detect'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import axios from '../../../../../wrapper/axios'

momentDurationFormatSetup(moment)
export function parseData(data) {
	return data
		.map((el) => ({
			...el,
			deskNo: el.deskNo,
			userName: el.member ? el.member['name'] ?? '' : '',
			productType: el['timeType']
				? el['timeType'] === 'time'
					? '[1회권] '
					: el['timeType'] === 'day'
					? '[지정석] '
					: el['timeType'] === 'free'
					? '[자유석] '
					: el['timeType'] === 'real'
					? '[실시간] '
					: ''
				: '',
			salesHistory: el['salesHistory'] ? Number(el['salesHistory'].amount) : '',
			usersCash: el.usersCash ? (el.usersCash['cash'] ? el.usersCash['cash'] : '') : '',
			duration: el.endDT ? moment.duration(moment(el.endDT).diff(moment())).format('D일 H시간 m분 남음') : '',
			startDT: el.startDT ? moment(el.startDT).format('M/D HH:mm') : '-',
			endDT: el.endDT ? moment(el.endDT).format('M/D HH:mm') : '-',
			phoneNumber: el.user.phone
		}))
		.sort((a, b) => (Number.isInteger(a.deskNo * 1 - b.deskNo * 1) ? a.deskNo * 1 - b.deskNo * 1 : 1))
}
export function parseSalesData(data) {
	return data.map((el) => ({
		...el,
		memberName: el.member ? (el.member['name'] ? el.member['name'] : '') : '',
		productName: el.product
			? el.product['name']
			: el.roomUsageSeq
			? '스터디룸'
			: el.deskUsage
			? el.deskUsage.timeType === 'day'
				? '지정석'
				: el.deskUsage.timeType === 'free'
				? '자유석'
				: el.deskUsage.timeType === 'time'
				? '1회권'
				: el.deskUsage.timeType === 'real'
				? '실시간'
				: ''
			: '상품명없음'
	}))
}

export function productTypeFormat(target) {
	return target === 'time'
		? '[1회권] '
		: target === 'day'
		? '[지정석] '
		: target === 'free'
		? '[자유석] '
		: target === 'real'
		? '[실시간] '
		: ''
}

export async function loadData(seq) {
	if (seq) {
		const res = await axios.get(`/desk/${seq}/usage`)
		const usageData = res.data.usage && parseData(res.data.usage)
		return usageData
	} else {
		throw new Error('유저정보 없음.')
	}
}

export async function loadSalesData(seq, fn) {
	try {
		const res = await axios.get(`/sales/${seq}`, {
			params: {
				perPage: 50
			}
		})
		const salesData = res.data.list && parseSalesData(res.data.list)
		fn(salesData)
	} catch (error) {
		throw new Error(error)
	}
}

export function amountFormat(cell) {
	return cell ? (+cell).toLocaleString() + ' 원' : '-'
}

export function amountSalesFormat(cell) {
	return cell ? cell.toLocaleString() : '0'
}
const md = new MobileDetect(window.navigator.userAgent)
export function amountPhoneNumber(cell) {
	const sendSMS = (phoneNumber) => {
		if (!md.mobile()) {
			alert('스마트폰에서 가능한 기능입니다.')
			return
		}
		const agent = window.navigator.userAgent.toLowerCase()
		let link = 'sms:'
		if (agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) {
			link += '//open?addresses='
		}
		link += phoneNumber

		window.location.href = link
	}
	return cell ? (
		md.mobile() ? (
			<span style={{ color: 'rgba(0, 114, 255,0.8)', textDecoration: 'underline' }} onClick={() => sendSMS(cell)}>
				{cell.slice(0, 3) + '-' + cell.slice(3, 7) + '-' + cell.slice(7)}
			</span>
		) : (
			<span>{cell.slice(0, 3) + '-' + cell.slice(3, 7) + '-' + cell.slice(7)}</span>
		)
	) : (
		<span>-</span>
	)
}

export const payMethodFormat = (cell) => {
	return cell === 'app'
		? '앱-캐시'
		: cell === 'admin'
		? '관리자-캐시'
		: cell === 'service'
		? '서비스'
		: cell === 'cash'
		? '현장결제(현금)'
		: cell === 'card'
		? '현장결제(카드)'
		: ''
}

export function salesDataFormat(cell) {
	return cell ? moment(cell).format('M/D HH:MM') : ''
}
export function dataFormat(_, row) {
	const value = `${row['startDT']} ~${row['endDT']} (${row['duration']})`
	return <span style={{ whiteSpace: 'normal' }}>{value}</span>
}

export function productFormat(_, row) {
	const type = productTypeFormat(row['timeType'])
	const name = row['product']?.name ?? ''
	return <span style={{ whiteSpace: 'normal' }}>{type + name}</span>
}

export function productSalesFormat(cell) {
	return <span style={{ whiteSpace: 'normal' }}>{cell}</span>
}

export const userFormat = (_, row) => {
	const name = row['member']?.name ?? ''
	const phone = row['member'] ? ` (${row['member'].name})` : ''
	return (
		<div>
			{name}
			<br />
			{phone}
		</div>
	)
}

export function renderSizePerPageDropDown(props) {
	return (
		<div className="btn-group">
			{[10, 20, 50, 100].map((n, idx) => {
				const isActive = n === props.currSizePerPage ? 'active' : null
				return (
					<button key={idx} type="button" className={`btn ${isActive}`} onClick={() => props.changeSizePerPage(n)}>
						{n}
					</button>
				)
			})}
		</div>
	)
}
