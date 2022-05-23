import React from 'react'
import axios from '../../../../wrapper/axios'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import scss from './table-widget.module.scss'
import Button from '@material-ui/core/Button'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import MobileDetect from 'mobile-detect'
import { parseData, productTypeFormat } from './libs/parseData'

const md = new MobileDetect(window.navigator.userAgent)

momentDurationFormatSetup(moment)

class TableWidgetDeskUsage extends React.Component {
	state = {
		activeTabIndex: 0,
		page: 0,
		rowsPerPage: 5,
		place_seq: JSON.parse(localStorage.getItem('manager_place')).seq || null,
		usageData: []
	}

	componentDidMount() {
		if (sessionStorage.getItem('manager_seq') !== '' && sessionStorage.getItem('manager_seq') !== null) {
			this.loadValue()
		}
	}

	loadValue = async () => {
		await axios
			.get(`/desk/${this.state.place_seq}/usage`)
			.then((res) => {
				const usageData = res.data.usage && parseData(res.data.usage)
				this.setState({ usageData })
			})
			.catch((error) => console.error(error))
	}

	// handleChangePage = (event, page) => {
	// 	this.setState({ page })
	// }

	userFormat(cell, row, rowIndex) {
		let name = row['member'] ? row['member'].name : ''
		let phone = row['member'] ? ` (${row['member'].phone})` : ''

		return (
			<div>
				{name}
				<br />
				{phone}
			</div>
		)
	}

	productFormat(cell, row, rowIndex) {
		let type = productTypeFormat(row['timeType'])
		let name = row['product']?.name ?? ''
		return <span style={{ whiteSpace: 'normal' }}>{type + name}</span>
	}

	dateFormat(cell, row, rowIndex) {
		return (
			<span style={{ whiteSpace: 'normal' }}>
				{row['startDT']} ~{row['endDT']} ({row['duration']})
			</span>
		)
	}

	amountFormat(cell, row, rowIndex) {
		return cell ? Number(cell).toLocaleString() + '원' : '-'
	}

	//페이지당 Row 갯수 설정
	renderSizePerPageDropDown = (props) => {
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

	sendGroupSMS = () => {
		if (!md.mobile()) {
			alert('스마트폰에서 가능한 기능입니다.')
			return
		}
		const agent = window.navigator.userAgent.toLowerCase()
		let link = 'sms:'
		if (agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) {
			link += '//open?addresses='
		}
		this.state.usageData.forEach((m) => {
			if (m.user && m.user.phone) link += m.user.phone + ','
		})
		window.location.href = link
	}

	render() {
		const { usageData } = this.state
		const options = {
			defaultSortName: '', // default sort column name
			defaultSortOrder: 'asc', // default sort order
			sizePerPageDropDown: this.renderSizePerPageDropDown,
			sizePerPage: 5,
			noDataText: '데이터 없음'
		}

		return (
			<div id="dashboard_deskusage" className={scss['portal-chart-tabs']}>
				<div>
					<Button
						variant="outlined"
						size="small"
						style={{ float: 'right', marginTop: '-43px', marginRight: md.mobile() ? null : '10px' }}
						onClick={this.sendGroupSMS}
					>
						단체문자
					</Button>
				</div>
				<div style={{ minWidth: md.mobile() ? '100%' : '650px', margin: md.mobile() ? null : '10px' }}>
					<BootstrapTable data={usageData} options={options} pagination hover className={'study_place_bs'}>
						<TableHeaderColumn dataField="deskNo" isKey dataSort searchable={false} width="90px" dataAlign="center">
							좌석번호
						</TableHeaderColumn>
						<TableHeaderColumn
							width="100px"
							dataField="userName"
							dataSort
							dataFormat={this.userFormat.bind(this)}
							dataAlign="center"
						>
							회원
						</TableHeaderColumn>
						<TableHeaderColumn
							width="150px"
							dataField="productType"
							dataSort
							dataFormat={this.productFormat.bind(this)}
							dataAlign="center"
						>
							상품명
						</TableHeaderColumn>
						<TableHeaderColumn
							width="150px"
							dataField="startDT"
							dataSort
							dataFormat={this.dateFormat.bind(this)}
							searchable={false}
							dataAlign="center"
						>
							기간
						</TableHeaderColumn>
						<TableHeaderColumn
							width="120px"
							dataField="salesHistory"
							dataSort
							dataFormat={this.amountFormat.bind(this)}
							searchable={false}
							dataAlign="center"
						>
							사용금액
						</TableHeaderColumn>
						<TableHeaderColumn
							width="120px"
							dataField="usersCash"
							dataSort
							dataFormat={this.amountFormat.bind(this)}
							searchable={false}
							dataAlign="center"
						>
							보유캐시
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		)
	}
}

export default TableWidgetDeskUsage
