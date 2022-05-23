import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import axios from '../../wrapper/axios'

import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'

import './chart.css'

let today = new Date(),
	year = today.getFullYear(),
	month = today.getMonth() + 1,
	day = today.getDate()

class Timephased extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			firstDate: '',
			lastDate: ''
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

		setTimeout(() => {
			const first = new Date(year, month - 1, 1),
				last = new Date(year, month, 0),
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

			this.loadValue()
		}, 200)
	}

	loadValue = async () => {
		await axios
			.get('/sales/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/analysis/time', {
				params: {
					from: this.state.firstDate,
					to: this.state.lastDate
				}
			})
			.then(res => {
				if (res.status === 200) {
					const perUnit_data =
						res.data &&
						res.data.perUnit &&
						res.data.perUnit.map((el, i) => {
							return {
								hour:
									el.timeUnit === '00~03'
										? '늦은밤\n00~03시'
										: el.timeUnit === '03~06'
										? '새벽\n03~06시'
										: el.timeUnit === '06~09'
										? '아침\n06~09시'
										: el.timeUnit === '09~12'
										? '오전\n09~12시'
										: el.timeUnit === '12~15'
										? '낮\n12~15시'
										: el.timeUnit === '15~18'
										? '오후\n15~18시'
										: el.timeUnit === '18~21'
										? '저녁\n18~21시'
										: el.timeUnit === '21~24'
										? '밤\n21~24시'
										: '',
								amount: el.amount || 0,
								salesCount: el.salesCount || 0
							}
						})
					// const sales_data = res.data && res.data.perHour && res.data.perHour.map((el, i) => {
					//   return {
					//     hour: el.hour + '시',
					//     amount: el.amount || 0,
					//     salesCount: el.salesCount || 0
					//   };
					// });
					this.setChart(perUnit_data)
				}
			})
			.catch(error => console.error(error))
	}

	setChart = chartData => {
		// Create Chart
		let chart = am4core.create('chartdiv', am4charts.XYChart) // here Saleschart is the ID of a div

		// Add data
		chart.data = chartData

		// Create axes
		let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
		categoryAxis.renderer.grid.template.location = 0
		categoryAxis.dataFields.category = 'hour'
		categoryAxis.renderer.minGridDistance = 20
		categoryAxis.title.align = 'center'

		let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
		valueAxis.min = 0

		// Create series
		let series1 = chart.series.push(new am4charts.ColumnSeries())
		series1.dataFields.categoryX = 'hour'
		series1.dataFields.valueY = 'amount'
		series1.tooltipText = '[bold font-size: 16]매출 : {valueY}원\n이용 : {salesCount}건[/]'
		series1.strokeWidth = 3

		// let series2 = chart.series.push(new am4charts.ColumnSeries());
		// series2.dataFields.categoryX  = 'hour';
		// series2.dataFields.valueY = 'salesCount';
		// series2.strokeWidth = 3;

		// Add cursor
		chart.cursor = new am4charts.XYCursor()
		chart.cursor.snapToSeries = series1
		chart.cursor.xAxis = valueAxis
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

	handleChange = prop => event => {
		this.setState({ [prop]: event.target.value })
	}

	/**
	 * 날짜 0 추가용
	 */
	addZero = n => {
		let zero = ''
		n = n.toString()
		if (n.length < 2) {
			for (let i = 0; i < 2 - n.length; i++) zero += '0'
		}
		return zero + n
	}

	render() {
		return (
			<div className={'time_chart_main'}>
				<div className={'row chart_date_div'}>
					<TextField
						id="date"
						type="date"
						className={'chart_date_select'}
						InputLabelProps={{
							shrink: true
						}}
						value={this.state.firstDate}
						onChange={this.handleChange('firstDate')}
					/>

					<span className={'chart_date_span'}>~</span>

					<TextField
						id="date"
						type="date"
						className={'chart_date_select'}
						InputLabelProps={{
							shrink: true
						}}
						value={this.state.lastDate}
						onChange={this.handleChange('lastDate')}
					/>

					<Button variant="outlined" color="secondary" className={'chart_date_btn'} onClick={() => this.loadValue()}>
						조회
					</Button>
				</div>
				<div className={'time_chart_layout'}>
					<div id="chartdiv" className={'time_chart_div'}></div>
				</div>
				<div className="hidden_"></div>
			</div>
		)
	}
}

export default Timephased
