import React from 'react'
import axios from '../../wrapper/axios'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import './chart.css'

class Funnels extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			placeStats: [],
			recentStats: [],
			allStats: []
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
			this.loadValue()
		}, 200)
	}

	loadValue = () => {
		axios
			.get('/survey/stats', {
				params: {
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq
				}
			})
			.then(res => {
				if (res.status === 200) {
					this.setState({ placeStats: res.data.data })
					this.setChart('chartdiv1', res.data.data)
				}
			})
			.catch(error => console.error(error))

		axios
			.get('/survey/stats', {
				params: {
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
					isRecent: true
				}
			})
			.then(res => {
				if (res.status === 200) {
					this.setState({ recentStats: res.data.data })
					this.setChart('chartdiv2', res.data.data)
				}
			})
			.catch(error => console.error(error))

		axios
			.get('/survey/stats')
			.then(res => {
				if (res.status === 200) {
					this.setState({ allStats: res.data.data })
				}
			})
			.catch(error => console.error(error))
	}

	setChart = (id, chartData) => {
		let chart = am4core.create(id, am4charts.PieChart) // here Saleschart is the ID of a div
		chart.data = chartData

		//series
		let pieSeries = chart.series.push(new am4charts.PieSeries())
		pieSeries.dataFields.value = 'answerCount'
		pieSeries.dataFields.category = 'answerText'
		pieSeries.slices.template.stroke = am4core.color('#fff')
		pieSeries.slices.template.strokeWidth = 2
		pieSeries.slices.template.strokeOpacity = 1
		pieSeries.slices.template.adapter.add('tooltipText', function(text, target) {
			if (target.dataItem) {
				return '[bold font-size: 16]{category} {value}건[/]'
			}
			return text
		})
		pieSeries.slices.template.alwaysShowTooltip = false
		pieSeries.labels.template.disabled = false
		pieSeries.ticks.template.disabled = false
		pieSeries.hiddenState.properties.opacity = 1
		pieSeries.hiddenState.properties.endAngle = -90
		pieSeries.hiddenState.properties.startAngle = -90
		//legend
		chart.legend = new am4charts.Legend()
		chart.legend.position = 'bottom'
		chart.legend.valueLabels.template.text = '{value.value}건'

		this.chart = chart
	}

	componentWillUnmount() {
		if (this.chart) {
			this.chart.dispose()
		}
	}

	render() {
		return (
			<div id="analysis" style={{ padding: '34px', width: '100%' }}>
				<div className={'row analysis_chart_row'}>
					<div className={'col-md-6'} style={{ padding: '14px' }}>
						<h4>전체 기간</h4>
						<div id="chartdiv1" style={{ height: '400px' }}></div>
					</div>
					<div className={'col-md-6'} style={{ padding: '14px' }}>
						<h4>최근 1개월</h4>
						<div id="chartdiv2" style={{ height: '400px' }}></div>
					</div>
				</div>
				<div className={'row'}>
					<div className={'analysis_chart_row Table'} style={{ padding: '24px', marginTop: '14px' }}>
						<h4>비교분석</h4>
						<table className={'product_chart_table'}>
							<colgroup>
								<col width="20%" />
								<col width="20%" />
								<col width="15%" />
								<col width="10%" />
								<col width="15%" />
								<col width="10%" />
								<col width="10%" />
							</colgroup>
							<tbody>
								<tr className={'product_chart_tHeader'}>
									<td>유입경로</td>
									<td>스터디모아 평균</td>
									<td>전체 기간</td>
									<td>차이(전체-평균)</td>
									<td>최근 1개월</td>
									<td>차이(최근-평균)</td>
									<td>차이(최근-전체)</td>
								</tr>
								{this.state.allStats.map((item, i) => {
									const placeRow = this.state.placeStats.find(el => el.answerCode === item.answerCode) || { ratio: 0 }
									const recentRow = this.state.recentStats.find(el => el.answerCode === item.answerCode) || { ratio: 0 }
									return (
										<tr key={i} className={'product_chart_tr'}>
											<td>{item.answerText}</td>
											<td>{item.ratio}%</td>
											<td>{placeRow.ratio}%</td>
											<td
												style={{
													color:
														placeRow.ratio - item.ratio > 10
															? 'blue'
															: placeRow.ratio - item.ratio < -10
															? 'red'
															: ''
												}}
											>
												({(placeRow.ratio - item.ratio).toFixed(1)}%)
											</td>
											<td>{recentRow.ratio}%</td>
											<td
												style={{
													color:
														recentRow.ratio - item.ratio > 10
															? 'blue'
															: recentRow.ratio - item.ratio < -10
															? 'red'
															: ''
												}}
											>
												({(recentRow.ratio - item.ratio).toFixed(1)}%)
											</td>
											<td
												style={{
													color:
														recentRow.ratio - placeRow.ratio > 10
															? 'blue'
															: recentRow.ratio - placeRow.ratio < -10
															? 'red'
															: ''
												}}
											>
												({(recentRow.ratio - placeRow.ratio).toFixed(1)}%)
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

export default Funnels
