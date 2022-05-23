import React from 'react'
import axios from '../../../../wrapper/axios'
import moment from 'moment'
import scss from './table-widget.module.scss'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent)

class TableWidgetSales extends React.Component {
	state = {
		activeTabIndex: 0,
		page: 0,
		rowsPerPage: 5,
		place_seq: null,
		salesData: []
	}

	componentDidMount() {
		if (sessionStorage.getItem('manager_seq') !== '' && sessionStorage.getItem('manager_seq') !== null) {
			setTimeout(() => {
				this.setState({ place_seq: JSON.parse(localStorage.getItem('manager_place')).seq })
				this.loadValue()
			}, 0)
		}
	}

	loadValue = () => {
		axios
			.get(`/sales/${this.state.place_seq}`, {
				params: {
					perPage: 50
				}
			})
			.then(res => {
				const salesData =
					res.data &&
					res.data.list &&
					res.data.list.map(el => {
						return {
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
						}
					})
				this.setState({ salesData })
			})
			.catch(error => console.error(error))
	}

	handleChangePage = (event, page) => {
		this.setState({ page })
	}

	productFormat(cell, row, rowIndex) {
		return <span style={{ whiteSpace: 'normal' }}>{cell}</span>
	}

	amountFormat(cell, row, rowIndex) {
		return cell ? cell.toLocaleString() : '0'
	}

	payMethodFormat = (cell, row) => {
		let rm =
			cell === 'app'
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
		return rm
	}

	dateFormat(cell, row, rowIndex) {
		return cell ? moment(cell).format('M/D HH:mm') : ''
	}

	//페이지당 Row 갯수 설정
	renderSizePerPageDropDown = props => {
		return (
			<div className="btn-group">
				{[10, 25, 50].map((n, idx) => {
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

	render() {
		const { salesData } = this.state
		const options = {
			defaultSortName: 'no', // default sort column name
			defaultSortOrder: 'desc', // default sort order
			sizePerPageDropDown: this.renderSizePerPageDropDown,
			noDataText: '데이터 없음'
		}
		return (
			<div id="dashboard_sales" className={scss['portal-chart-tabs']}>
				<div style={{ minWidth: md.mobile() ? '100%' : '400px', margin: md.mobile() ? null : '10px' }}>
					<BootstrapTable data={salesData} options={options} pagination hover className={'study_place_bs'}>
						<TableHeaderColumn dataField="no" isKey dataSort searchable={false} width="60px" dataAlign="center">
							No
						</TableHeaderColumn>
						<TableHeaderColumn width="160px" dataField="memberName" dataSort dataAlign="center">
							회원
						</TableHeaderColumn>
						<TableHeaderColumn
							width="160px"
							dataField="productName"
							dataFormat={this.productFormat.bind(this)}
							dataSort
							dataAlign="center"
						>
							상품명
						</TableHeaderColumn>
						<TableHeaderColumn
							width="160px"
							dataField="amount"
							dataSort
							dataFormat={this.amountFormat.bind(this)}
							searchable={false}
							dataAlign="center"
						>
							금액
						</TableHeaderColumn>
						<TableHeaderColumn
							width="160px"
							dataField="payMethod"
							dataSort
							dataFormat={this.payMethodFormat.bind(this)}
							searchable={false}
							dataAlign="center"
						>
							결제수단
						</TableHeaderColumn>
						<TableHeaderColumn
							width="160px"
							dataField="wdate"
							dataSort
							dataFormat={this.dateFormat.bind(this)}
							searchable={false}
							dataAlign="center"
						>
							등록시간
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		)
	}
}

export default TableWidgetSales
