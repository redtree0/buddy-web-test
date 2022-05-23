import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import MenuItem from '@material-ui/core/MenuItem'
import moment from 'moment'
import axios from '../../wrapper/axios'
import './calendar.css'

import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'

import './chart.css'

let today = new Date(),
	year = today.getFullYear(),
	month = today.getMonth() + 1,
	day = today.getDate(),
	date = today.getDate(),
	days = ['일', '월', '화', '수', '목', '금', '토'],
	getToday = year + '-' + (String(month).length < 2 ? '0' + month : month) + '-' + (String(date).length < 2 ? '0' + date : date)

class Analysis extends React.Component {
	constructor(props) {
		let _yearList = []
		for (let y = year - 10; y < year + 10; y++) {
			_yearList.push({ label: y, value: y })
		}
		let _monthList = []
		for (let m = 1; m < 13; m++) {
			_monthList.push({ label: m, value: m })
		}
		super(props)
		this.state = {
			yearList: _yearList,
			selectYear: year,
			monthList: _monthList,
			selectMonth: month,

			now: today.toLocaleDateString(),
			thisYear: year,
			thisMonth: month,
			thisDates: [],

			salesData: null,
			salesData_day: null
		}
	}

	componentDidMount() {
		//로그인 여부 체크
		if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
			window.location.href = '/login'
			return
		}

		// Use theme
		am4core.useTheme(am4themes_animated)

		this.loadValue()
	}

	componentDidUpdate() {
		//Update 될 때, .today, .click을 다시 찾아주지 않으면 기존에 있던 자리에 그대로 남아있게 된다.
		this._find_today()
		// this._click_date()
	}

	loadValue = async () => {
		await axios
			.get(
				'/sales/' +
					JSON.parse(localStorage.getItem('manager_place')).seq +
					'/' +
					this.state.selectYear +
					'/' +
					this.state.selectMonth +
					'/member'
			)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ salesData: res.data })
					const sales_data = [
						{
							member: '기존회원',
							value: res.data.existMembers.amount || 0,
							cnt: res.data.existMembers.salesCount || 0
						},
						{
							member: '신규회원',
							value: res.data.newMembers.amount || 0,
							cnt: res.data.newMembers.salesCount || 0
						}
					]
					this.setChart(sales_data)
				}
			})
			.catch((error) => console.error(error))

		await axios
			.get(
				'/sales/' +
					JSON.parse(localStorage.getItem('manager_place')).seq +
					'/' +
					this.state.selectYear +
					'/' +
					this.state.selectMonth
			)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ salesData_day: res.data })
				}
			})
			.catch((error) => console.error(error))

		year = this.state.selectYear
		month = this.state.selectMonth
		this._get_month(year, month)
	}

	setChart = (chartData) => {
		// Create Chart
		let chart = am4core.create('chartdiv', am4charts.PieChart) // here Saleschart is the ID of a div
		// Add data
		chart.data = chartData

		// Create series
		let pieSeries = chart.series.push(new am4charts.PieSeries())
		pieSeries.dataFields.value = 'value'
		pieSeries.dataFields.category = 'member'
		pieSeries.slices.template.stroke = am4core.color('#fff')
		pieSeries.slices.template.strokeWidth = 2
		pieSeries.slices.template.strokeOpacity = 1
		pieSeries.slices.template.tooltipText = '[bold font-size: 16]{category} {value.percent}%\n{cnt}건[/]'
		pieSeries.slices.template.adapter.add('tooltipText', function (text, target) {
			if (target.dataItem) {
				return '[bold font-size: 16]{category} ' + target.dataItem.values.value.percent.toFixed(0) + '%\n{cnt}건[/]'
			}
			return text
		})
		pieSeries.slices.template.alwaysShowTooltip = true

		pieSeries.labels.template.disabled = true
		pieSeries.ticks.template.disabled = true

		pieSeries.hiddenState.properties.opacity = 1
		pieSeries.hiddenState.properties.endAngle = -90
		pieSeries.hiddenState.properties.startAngle = -90

		// Add legend
		// chart.legend = new am4charts.Legend();
		// chart.legend.position = "top";

		this.chart = chart
	}

	componentWillUnmount() {
		if (this.chart) {
			this.chart.dispose()
		}
	}

	handleChange = (prop) => (event) => {
		this.setState({ [prop]: event.target.value })
	}

	/**
	 * 캘린더 날짜 세팅
	 */
	_get_month = (year, month) => {
		const first = new Date(year, month - 1, 1),
			last = new Date(year, month, 0),
			dates = [],
			first_day = first.getDay(),
			last_day = last.getDay(),
			firstDate =
				first.getFullYear().toString() +
				'-' +
				this.addZero((first.getMonth() + 1).toString()) +
				'-' +
				this.addZero(first.getDate().toString()),
			lastDate =
				last.getFullYear().toString() +
				'-' +
				this.addZero((last.getMonth() + 1).toString()) +
				'-' +
				this.addZero(last.getDate().toString())
		this.setState({
			firstDate: firstDate,
			lastDate: lastDate
		})

		for (var be = first_day; be > 0; be--) {
			//첫째 주 이전 달 부분
			const be_newDate = new Date(year, month - 1, 1 - be),
				be_month = be_newDate.getMonth() + 1,
				be_date = be_newDate.getDate(),
				be_fulldate = year + '-' + this.addZero(be_month) + '-' + this.addZero(be_date)
			dates.push({ month: be_month, date: be_date, fulldate: be_fulldate })
		}
		for (var i = 1; i <= last.getDate(); i++) {
			// 이번달 부분
			const this_newDate = new Date(year, month - 1, i),
				this_month = this_newDate.getMonth() + 1,
				this_date = this_newDate.getDate(),
				this_fulldate = year + '-' + this.addZero(this_month) + '-' + this.addZero(this_date)
			dates.push({ month: this_month, date: this_date, fulldate: this_fulldate, include: true })
		}
		for (var af = 1; af < 7 - last_day; af++) {
			// 마지막 주 다음달 부분
			const af_newDate = new Date(year, month, af),
				af_month = af_newDate.getMonth() + 1,
				af_date = af_newDate.getDate(),
				af_fulldate = year + '-' + this.addZero(af_month) + '-' + this.addZero(af_date)
			dates.push({ month: af_month, date: af_date, fulldate: af_fulldate })
		}
		this.setState({
			thisYear: year,
			thisMonth: month,
			thisDates: dates
		})
	}

	/**
	 * 오늘 날짜 Find
	 */
	_find_today = () => {
		const list = document.querySelectorAll('.dates')
		for (var i = 1; i < list.length; i++) {
			list[i].classList.remove('today')
			if (moment(list[i].dataset.fulldate).format('YYYY-MM-DD') === moment(new Date(getToday)).format('YYYY-MM-DD')) {
				list[i].classList.add('today')
			}
		}
	}

	/**
	 * 날짜 0 추가용
	 */
	addZero = (n) => {
		let zero = ''
		n = n.toString()
		if (n.length < 2) {
			for (let i = 0; i < 2 - n.length; i++) zero += '0'
		}
		return zero + n
	}

	payFormat = (pay) => {
		return pay ? pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
	}

	render() {
		const salesData = this.state.salesData
		const salesData_day = this.state.salesData_day

		return (
			<div id="analysis" style={{ padding: '5%', width: '100%' }}>
				<div className={'row'} style={{ height: '60px', verticalAlign: 'middle', padding: '0px 20px' }}>
					<TextField select className={classNames('')} value={this.state.selectYear} onChange={this.handleChange('selectYear')}>
						{this.state.yearList.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						className={classNames('')}
						style={{ marginLeft: '10px' }}
						value={this.state.selectMonth}
						onChange={this.handleChange('selectMonth')}
					>
						{this.state.monthList.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<Button variant="outlined" color="secondary" style={{ marginLeft: '8px' }} onClick={() => this.loadValue()}>
						조회
					</Button>
				</div>
				<div className={'row analysis_chart_row'}>
					<div className={'col-md-6 Chart'}>
						<div id="chartdiv" className={'analysis_chart_div'}></div>

						<table className={'analysis_chart_table'}>
							<colgroup>
								<col width="30%" />
								<col width="30%" />
								<col width="20%" />
								<col width="20%" />
							</colgroup>
							<tbody>
								<tr>
									<td>신규회원</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.newMembers && this.payFormat(salesData.newMembers.amount)) || 0}원
									</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.newMembers && salesData.newMembers.salesCount) || 0}건
									</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.newMembers && salesData.newMembers.memberCnt) || 0}명
									</td>
								</tr>
								<tr>
									<td>기존회원</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.existMembers && this.payFormat(salesData.existMembers.amount)) || 0}원
									</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.existMembers && salesData.existMembers.salesCount) || 0}건
									</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.existMembers && salesData.existMembers.memberCnt) || 0}명
									</td>
								</tr>
								<tr>
									<td>총 매출</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.total && this.payFormat(salesData.total.amount)) || 0}원
									</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.total && salesData.total.salesCount) || 0}건
									</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.total && salesData.total.memberCnt) || 0}명
									</td>
								</tr>
								<tr>
									<td>평균 객단가</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.total && this.payFormat(salesData.total.avgPerMember)) || 0}원
									</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td>평균 이용단가</td>
									<td className={'analysis_chart_td'}>
										{(salesData && salesData.total && this.payFormat(salesData.total.avgPerSales)) || 0}원
									</td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className={'col-md-6 Calendar'}>
						<section>
							<div className="days">
								{days.map((value, i) => {
									return (
										<span className="day" key={i}>
											{value}
										</span>
									)
								})}
							</div>
							<div className="main">
								{this.state.thisDates.map((value, i) => {
									let total = salesData_day
										? salesData_day[value.date - 1]
											? salesData_day[value.date - 1].total
											: 0
										: 0
									let count = salesData_day && salesData_day[value.date - 1] && salesData_day[value.date - 1].count
									if (value.include) {
										//해당 달에 날짜가 포함
										if (moment(getToday).isAfter(value['fulldate'])) {
											//과거
											return (
												<div
													className={'dates include c_after'}
													data-fulldate={value.fulldate}
													data-month={value.month}
													key={i}
												>
													<p className={'c_date'} data-fulldate={value.fulldate} data-month={value.month}>
														{value.date}
													</p>
													<p className={'c_total'}>{this.payFormat(total)}</p>
													<p className={'c_count'}>{count && `${count}건`}</p>
												</div>
											)
										} else {
											//현재
											return (
												<div
													className={'dates include'}
													data-fulldate={value.fulldate}
													data-month={value.month}
													key={i}
												>
													<p
														className={'c_date c_before'}
														data-fulldate={value.fulldate}
														data-month={value.month}
													>
														{value.date}
													</p>
													<p className={'c_total'}>{this.payFormat(total)}</p>
													<p className={'c_count'}>{count && `${count}건`}</p>
												</div>
											)
										}
									} else {
										//해당 달에 날짜가 미포함
										return (
											<div className={'dates others'} data-fulldate={value.fulldate} data-month={value.month} key={i}>
												<p className={'c_date'} data-fulldate={value.fulldate} data-month={value.month}>
													{/* {value.date} */}
												</p>
											</div>
										)
									}
								})}
							</div>
						</section>
					</div>
				</div>
				<div className="hidden_"></div>
			</div>
		)
	}
}

export default Analysis
