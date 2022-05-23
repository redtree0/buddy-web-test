import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import MenuItem from '@material-ui/core/MenuItem'
import axios from '../../wrapper/axios'

import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'

import './chart.css'

let today = new Date(),
	year = today.getFullYear(),
	month = today.getMonth() + 1,
	day = today.getDate()

class Statistics extends React.Component {
	constructor(props) {
		super(props)
		let _yearList = []
		for (let y = year - 5; y < year + 5; y++) {
			_yearList.push({ label: y, value: y })
		}
		let _monthList = []
		for (let m = 1; m < 13; m++) {
			_monthList.push({ label: m, value: m })
		}
		this.state = {
			yearList: _yearList,
			selectYear: year,
			monthList: _monthList,
			selectMonth: month
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

	loadValue = async () => {
		await axios
			.get('/sales/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/year/' + this.state.selectYear)
			.then((res) => {
				if (res.status === 200) {
					const sales_data =
						res.data &&
						res.data.map((el, i) => {
							if (!el) {
								return {
									date: this.state.selectYear + '-' + (i > 8 ? i + 1 : '0' + (i + 1)),
									total: 0,
									app: 0,
									cashNcard: 0
								}
							}
							return {
								date: this.state.selectYear + '-' + (i > 8 ? i + 1 : '0' + (i + 1)),
								total: el.total || 0,
								app: (el.app || 0) + (el.admin || 0),
								cashNcard: el.cashNcard || 0
							}
						})
					this.setChart(sales_data)
				}
			})
			.catch((error) => console.error(error))
	}

	setChart = (chartData) => {
		// Create Chart
		let chart = am4core.create('chartdiv', am4charts.XYChart) // here Saleschart is the ID of a div

		// Add data
		chart.data = chartData

		// Create axes
		let dateAxis = chart.xAxes.push(new am4charts.DateAxis())
		dateAxis.renderer.grid.template.location = 0
		dateAxis.renderer.minGridDistance = 20

		dateAxis.dateFormats.setKey('month', 'MM월')
		dateAxis.periodChangeDateFormats.setKey('month', 'MM월')

		let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
		valueAxis.min = 0

		// Create series
		let series1 = chart.series.push(new am4charts.LineSeries())
		series1.dataFields.valueY = 'total'
		series1.dataFields.dateX = 'date'
		series1.tooltipText = '[bold font-size: 16]총 : {valueY}원\n앱 : {app}원\n현장결제 : {cashNcard}원[/]'
		series1.strokeWidth = 3
		series1.bullets.push(new am4charts.CircleBullet())
		series1.tooltip.pointerOrientation = 'vertical'

		let series2 = chart.series.push(new am4charts.LineSeries())
		series2.dataFields.valueY = 'app'
		series2.dataFields.dateX = 'date'
		series2.strokeWidth = 3
		series2.bullets.push(new am4charts.CircleBullet())
		series2.tooltip.pointerOrientation = 'vertical'

		let series3 = chart.series.push(new am4charts.LineSeries())
		series3.dataFields.valueY = 'cashNcard'
		series3.dataFields.dateX = 'date'
		series3.strokeWidth = 3
		series3.bullets.push(new am4charts.CircleBullet())
		series3.tooltip.pointerOrientation = 'vertical'

		// Add cursor
		chart.cursor = new am4charts.XYCursor()
		chart.cursor.snapToSeries = series1
		chart.cursor.xAxis = dateAxis
		chart.cursor.behavior = 'none' // Zoom disabled

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

	render() {
		return (
			<div className={'stats_chart_main'}>
				<div className={'row stats_chart_row'}>
					<TextField select className={classNames('')} value={this.state.selectYear} onChange={this.handleChange('selectYear')}>
						{this.state.yearList.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<Button variant="outlined" color="secondary" style={{ marginLeft: '8px' }} onClick={() => this.loadValue()}>
						조회
					</Button>
				</div>
				<div className={'stats_chart_layout'}>
					<div id="chartdiv" className={'stats_chart_div'} style={{ height: '600px' }}></div>
				</div>
				<div className="hidden_"></div>
			</div>
		)
	}
}

export default Statistics
