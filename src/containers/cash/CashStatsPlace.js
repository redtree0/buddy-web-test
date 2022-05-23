import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications, Store } from 'react-notifications-component'
// import 'react-notifications-component/dist/theme.css'
import MobileDetect from 'mobile-detect'
import scss from '../sales/sales.module.scss'
import { loadData } from './libs/utils'

const md = new MobileDetect(window.navigator.userAgent)

function CashStats() {
	const [state, setState] = useState({
		firstDate: moment().format('YYYY-MM-DD'),
		lastDate: moment().format('YYYY-MM-DD')
	})
	const alertMessage = (title, message, type) => {
		Store.addNotification({
			title: title,
			message: message,
			type: type,
			insert: 'top',
			container: 'top-center',
			animationIn: ['animated', 'fadeIn'],
			animationOut: ['animated', 'fadeOut'],
			dismiss: { duration: 3000 },
			dismissable: { click: true }
		})
	}
	const options = {
		defaultSortName: 'seq', // default sort column name
		// defaultSortOrder: 'desc', // default sort order
		// clearSearch: true,
		// clearSearchBtn: this.createCustomClearButton,
		// searchField: this.createCustomSearchField,
		// sizePerPageDropDown: this.renderSizePerPageDropDown,
		noDataText: '데이터 없음'
	}

	useEffect(() => {
		loadData(state, setState, alertMessage)
	}, [])

	return (
		state.statsData && (
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
							value={state.firstDate}
							// onChange={this.handleChange('firstDate')}
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
							value={state.lastDate}
							// onChange={this.handleChange('lastDate')}
						/>

						<Button
							variant="outlined"
							color="default"
							className={classNames('sales_datebtn', scss.searchBtn)}
							onClick={() => loadData(state, setState, alertMessage)}
						>
							조회
						</Button>
					</div>
				</div>
				<div>
					<BootstrapTable
						data={state.statsData}
						options={options}
						hover
						className={'study_place_bs'}
						keyField="placeSeq"
						condensed={true}
					>
						<TableHeaderColumn dataField="placeSeq" width="80px" dataAlign="center">
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
	)
}

export default CashStats
