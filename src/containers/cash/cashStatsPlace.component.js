import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import MobileDetect from 'mobile-detect'
import scss from '../sales/sales.module.scss'

const md = new MobileDetect(window.navigator.userAgent)

class CashStats extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			statsData: [],
			firstDate: '',
			lastDate: ''
		}
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({
				firstDate: moment().format('YYYY-MM-DD'),
				lastDate: moment().format('YYYY-MM-DD')
			})
			this.loadData()
		}, 200)
	}

	loadData = async () => {
		if (this.state.firstDate === '' || this.state.firstDate === null || this.state.lastDate === '' || this.state.lastDate === null) {
			this.alertMessage('경고', '날짜를 선택해주세요.', 'danger')
			return
		}
		await axios
			.get('/cash/stats/place', {
				params: {
					from: this.state.firstDate,
					to: this.state.lastDate
				}
			})
			.then((res) => {
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
				this.setState({ statsData })
			})
			.catch((error) => console.error(error))
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value })
	}

	render() {
		const statsData = this.state.statsData
		const options = {
			defaultSortName: 'seq', // default sort column name
			// defaultSortOrder: 'desc', // default sort order
			// clearSearch: true,
			// clearSearchBtn: this.createCustomClearButton,
			// searchField: this.createCustomSearchField,
			// sizePerPageDropDown: this.renderSizePerPageDropDown,
			noDataText: '데이터 없음'
		}
		return (
			<div
				style={{
					padding: '20px',
					minWidth: md.mobile() ? '100%' : null,
					maxWidth: md.mobile() ? '600px' : '1400px',
					marginLeft: 'auto',
					marginRight: 'auto'
				}}
			>
				<ReactNotifications />

				<div className={classNames('row', scss.btn_layout)}>
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 sales_datesediv" style={{ padding: md.mobile() ? '0' : null }}>
						<TextField
							id="date"
							type="date"
							style={{ display: 'inline-block', width: md.mobile() ? '120px' : '160px' }}
							className={'sales_dateselect'}
							InputLabelProps={{
								shrink: false
							}}
							value={this.state.firstDate}
							onChange={this.handleChange('firstDate')}
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
								shrink: true
							}}
							value={this.state.lastDate}
							onChange={this.handleChange('lastDate')}
						/>

						<Button
							variant="outlined"
							color="default"
							className={classNames('sales_datebtn', scss.searchBtn)}
							onClick={() => this.loadData()}
						>
							조회
						</Button>
					</div>
				</div>
				<div>
					<BootstrapTable data={statsData} options={options} hover className={'study_place_bs'} condensed={true}>
						<TableHeaderColumn dataField="placeSeq" isKey={true} width="80px" dataAlign="center">
							Seq
						</TableHeaderColumn>
						<TableHeaderColumn dataField="placeName" width="140px" dataAlign="center">
							공간
						</TableHeaderColumn>
						<TableHeaderColumn
							dataField="sum"
							width="120px"
							dataFormat={(cell) => cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							dataAlign="center"
						>
							총액
						</TableHeaderColumn>
						<TableHeaderColumn dataField="count" width="120px" dataAlign="center">
							건수
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		)
	}
}

export default CashStats
