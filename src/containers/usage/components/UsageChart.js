import React, { useState, useEffect } from 'react'

import classNames from 'classnames'
import moment from 'moment'
import MobileDetect from 'mobile-detect'
import scss from '../usage.module.scss'
import axios from '../../../wrapper/axios'
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import UsageDeskTable from './UsageDeskTable'
import UsageRoomTable from './UsageRoomTable'
import UsageLockerTable from './UsageLockerTable'
import Pagination from 'react-js-pagination'
import UsageHistoryTable from './UsageHistoryTable'

function TabContainer(props) {
	const { children, dir } = props

	return (
		<Typography component="div" dir={dir} style={{ padding: 8 * 3, zIndex: 100000 }}>
			{children}
		</Typography>
	)
}
const md = new MobileDetect(window.navigator.userAgent)

function UsageChart({ title, memberKey, lKey }) {
	const [data, setData] = useState([])
	const [page, setPage] = useState(1)
	const [perPage, setPerPage] = useState(10)
	const [total, setTotal] = useState(0)
	const [from, setFrom] = useState(moment().date(1).format('YYYY-MM-DD'))
	const [to, setTo] = useState(moment().add(1, 'months').date(0).format('YYYY-MM-DD'))
	const [sort, setSort] = useState({
		orderBy: null,
		align: null
	})
	const [member, setMember] = useState(null)

	const [search, setSearch] = useState(null)

	const orderClick = (orderBy) => {
		const alignList = ['asc', 'desc']
		let align
		if (sort.align === alignList[0]) {
			align = alignList[1]
		} else {
			align = alignList[0]
		}
		setSort({
			orderBy,
			align
		})
	}

	const xslDownload = async () => {
		const seq = JSON.parse(localStorage.getItem('manager_place')).seq
		const FILEPATH = `/${title}/usage/list/xls` + '?placeSeq=' + seq
		const params = {
			from,
			to,
			search
		}
		// if (this.state.memberKey) {
		// 	if (_search) {
		// 		FILEPATH = FILEPATH + '&memberKey=' + this.state.memberKey + '&search=' + _search
		// 	} else {
		// 		FILEPATH = FILEPATH + '&memberKey=' + this.state.memberKey
		// 	}
		// } else {
		// 	if (_search) FILEPATH = FILEPATH + '&search=' + _search
		// }

		await axios
			.get(FILEPATH, {
				responseType: 'blob',
				params
			})
			.then((res) => {
				const url = window.URL.createObjectURL(new Blob([res.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', `${title}이용내역_` + moment(new Date()).format('YYYYMMDD') + '.xlsx')
				document.body.appendChild(link)
				link.click()
				link.remove()
			})
			.catch((error) => console.error(error))
	}

	const fetch = (user, key) => {
		const seq = JSON.parse(localStorage.getItem('manager_place')).seq

		if (title !== 'history') {
			const url = `/${title}/usage/list`
			axios
				.get(url, {
					headers: { 'Content-type': 'application/json' },
					params: {
						placeSeq: seq,
						from,
						to,
						page,
						perPage,
						orderBy: sort.orderBy,
						align: sort.align,
						search,
						key: lKey,
						memberKey
					}
				})
				.then((res) => {
					const usageList =
						res.data.list &&
						res.data.list.map((el) => {
							return {
								...el,
								memberName: el.member.name,
								memberPhone: el.member.phone,
								productName: el.product ? el.product.name : el.timeType == 'real' ? '실시간' : '직접입력',
								roomName: el.room ? el.room.name : ''
							}
						})
					setData((prev) => [...usageList])
					setTotal(res.data.total)
				})
				.catch((err) => console.log(err.response))
		} else {
			axios
				.get('/history/user', {
					params: {
						placeSeq: seq,
						from,
						to,
						page,
						perPage,
						search,
						orderBy: sort.orderBy,
						align: sort.align,
						memberKey,
						userSeq: user?.userSeq
					}
				})
				.then((res) => {
					setData((prev) =>
						res.data.list.map((el) => ({
							...el,
							userName: el.user ? el.user.name || '이름없음' : '',
							userPhone: el.user ? el.user.phone : '',
							wdate: moment(el.wdate).format('M/D HH:mm')
						}))
					)
					setTotal(res.data.total)
				})
		}
	}

	const options = {
		defaultSortName: 'seq',
		noDataText: '데이터 없음'
	}

	const memberFecth = async () => {
		const res = await axios.get(`/member/${memberKey}`)
		setMember((prev) => ({ ...res.data.member, coupon: res.data.coupon }))
		return { ...res.data.member, coupon: res.data.coupon }
	}

	const handleSubmit = () => {
		fetch()
	}
	useEffect(() => {
		if (memberKey) {
			memberFecth().then((res) => fetch(res))
		} else {
			fetch()
		}
	}, [page, perPage, sort])

	return (
		<TabContainer dir="ltr">
			<div className="row">
				<div className={classNames('col-xs-12 col-sm-9 col-md-9 col-lg-9', scss.date_div)}>
					<div className="btn-group btn-group-sm" role="group">
						<TextField
							id="date"
							type="date"
							style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
							className={'sales_dateselect'}
							InputLabelProps={{
								shrink: false
							}}
							value={from}
							onChange={(e) => setFrom(e.target.value)}
						/>
						<span
							style={{
								width: md.mobile() ? '20px' : '30px',
								display: 'inline-block',
								textAlign: 'center',
								fontSize: md.mobile() ? '20px' : '30px',
								fontWeight: '400'
							}}
						>
							~
						</span>
						<TextField
							id="date"
							type="date"
							style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
							className={'sales_dateselect'}
							InputLabelProps={{
								shrink: false
							}}
							value={to}
							onChange={(e) => setTo(e.target.value)}
						/>
						<Button
							variant="outlined"
							color="default"
							className={classNames('sales_datebtn', scss.searchBtn)}
							onClick={() => fetch()}
						>
							조회
						</Button>

						{title !== 'history' && (
							<Button variant="outlined" size="small" className={scss.xslBtn} onClick={() => xslDownload()}>
								엑셀 다운로드
							</Button>
						)}
					</div>
				</div>
				<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
					<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
						<input
							className="form-control "
							type="text"
							placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, 없을시 전화번호'}
							value={search ?? ''}
							onChange={(e) => setSearch(e.target.value)}
							style={{ zIndex: '0' }}
							onKeyDown={(e) => {
								if (e.code === 'Enter') {
									handleSubmit()
								}
							}}
						/>
						<span className="input-group-btn">
							<button className="btn btn-default" onClick={handleSubmit}>
								검색
							</button>
						</span>
					</div>
				</div>
			</div>
			{title === 'desk' && <UsageDeskTable data={data} options={options} orderClick={orderClick} sort={sort} />}
			{title === 'room' && <UsageRoomTable data={data} options={options} orderClick={orderClick} sort={sort} />}
			{title === 'locker' && <UsageLockerTable data={data} options={options} orderClick={orderClick} sort={sort} />}
			{title === 'history' && <UsageHistoryTable data={data} options={options} orderClick={orderClick} sort={sort} />}
			<div className="btn-group" style={{ width: '100%', padding: md.mobile() ? '0' : null }}>
				{[10, 25, 50].map((n, idx) => {
					const isActive = n === perPage ? 'active' : null
					return (
						<button
							key={idx}
							type="button"
							style={{ margin: md.mobile() ? '10px 0 0' : '20px 0' }}
							className={`btn ${isActive}`}
							onClick={() => setPerPage(n)}
						>
							{n}
						</button>
					)
				})}
				<div style={{ float: 'right', width: md.mobile() ? '100%' : null, textAlign: md.mobile() ? 'right' : null }}>
					<Pagination
						activePage={page}
						itemsCountPerPage={perPage}
						totalItemsCount={total}
						pageRangeDisplayed={5}
						onChange={(value) => setPage(value)}
					/>
				</div>
			</div>
		</TabContainer>
	)
}

export default UsageChart
