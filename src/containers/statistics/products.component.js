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
	date = today.getDate()

class Products extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			firstDate: '',
			lastDate: '',
			chartData: []
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
			.get('/sales/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/analysis/product', {
				params: {
					from: this.state.firstDate,
					to: this.state.lastDate
				}
			})
			.then(res => {
				if (res.status === 200) {
					const chartData =
						res.data &&
						res.data.result &&
						res.data.result.map((el, i) => {
							return {
								product: el.product ? el.product.name : el.roomUsage ? el.roomUsage.room.name : '실시간',
								rank: el.rank,
								salesCount: el.salesCount || 0,
								amount: this.payFormat(el.amount) || 0,
								ratio: el.ratio
							}
						})
					this.setState({ chartData })
					this.setChart(chartData)
				}
			})
			.catch(error => console.error(error))
	}

	setChart = chartData => {
		// Create Chart
		let chart = am4core.create('chartdiv', am4charts.TreeMap) // here Saleschart is the ID of a div
		chart.hiddenState.properties.opacity = 0 // this makes initial fade in effect

		// Add data
		chart.data = chartData
		chart.maxLevels = 1

		chart.dataFields.value = 'amount'
		chart.dataFields.name = 'product'

		chart.zoomable = false

		/* Configure top-level series */
		var level1 = chart.seriesTemplates.create('0')
		var level1_column = level1.columns.template
		// level1_column.column.cornerRadius(10, 10, 10, 10);
		level1_column.fillOpacity = 1
		level1_column.stroke = am4core.color('#fff')
		level1_column.strokeWidth = 1
		level1_column.strokeOpacity = 1

		/* Add bullet labels */
		var level1_bullet = level1.bullets.push(new am4charts.LabelBullet())
		level1_bullet.locationY = 0.5
		level1_bullet.locationX = 0.5
		level1_bullet.label.text = '{product}'
		level1_bullet.label.fill = am4core.color('#fff')

		level1.columns.template.tooltipText = '[bold font-size: 16]{product}\n매출 : {amount}원\n이용 : {salesCount}건[/]'

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

	payFormat = pay => {
		return pay ? pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
	}

	render() {
		const chartData = this.state.chartData

		return (
			<div className={'product_chart_main'}>
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
				<div className={'row product_chart_row'}>
					<div className={'col-md-6 Chart'}>
						<div id="chartdiv" className={'product_chart_div'}></div>
					</div>
					<div className={'col-md-6 Table'}>
						<table className={'product_chart_table'}>
							<colgroup>
								<col width="20%" />
								<col width="40%" />
								<col width="40%" />
							</colgroup>
							<tbody>
								<tr className={'product_chart_tHeader'}>
									<td>순위</td>
									<td>상품명</td>
									<td>매출</td>
								</tr>
								{chartData.map((item, i) => {
									return (
										<tr key={i} className={'product_chart_tr'}>
											<td>{item.rank}</td>
											<td>{item.product}</td>
											<td className={'product_chart_amount'}>{item.amount}</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
				<div className="hidden_"></div>
			</div>
		)
	}
}

export default Products
