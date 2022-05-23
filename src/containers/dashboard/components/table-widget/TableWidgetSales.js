import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import MobileDetect from 'mobile-detect'
import {
	amountSalesFormat,
	loadSalesData,
	payMethodFormat,
	productSalesFormat,
	renderSizePerPageDropDown,
	salesDataFormat
} from './libs/parseData'
import * as CP from './TableWedget.styled'

const md = new MobileDetect(window.navigator.userAgent)

function TableWidgetDeskUsage() {
	const [seq, _] = useState(JSON.parse(localStorage.getItem('manager_place'))?.seq || null)

	const [data, setData] = useState([])
	const options = {
		defaultSortName: 'no', // default sort column name
		defaultSortOrder: 'desc', // default sort order
		sizePerPageDropDown: renderSizePerPageDropDown,
		noDataText: '데이터 없음'
	}

	const load = () => {
		try {
			loadSalesData(seq, setData)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		if (sessionStorage.getItem('manager_seq') !== '' && sessionStorage.getItem('manager_seq') !== null) {
			load()
		}
	}, [])
	return (
		<CP.Wrapper id="dashboard_sales">
			<CP.Tables isMobile={md.mobile()}>
				<BootstrapTable data={data} options={options} pagination hover className={'study_place_bs'}>
					<TableHeaderColumn dataField="no" isKey dataSort searchable={false} width="60px" dataAlign="center">
						No
					</TableHeaderColumn>
					<TableHeaderColumn width="160px" dataField="memberName" dataSort dataAlign="center">
						회원
					</TableHeaderColumn>
					<TableHeaderColumn width="160px" dataField="productName" dataFormat={productSalesFormat} dataSort dataAlign="center">
						상품명
					</TableHeaderColumn>
					<TableHeaderColumn
						width="160px"
						dataField="amount"
						dataSort
						dataFormat={amountSalesFormat}
						searchable={false}
						dataAlign="center"
					>
						금액
					</TableHeaderColumn>
					<TableHeaderColumn
						width="160px"
						dataField="payMethod"
						dataSort
						dataFormat={payMethodFormat}
						searchable={false}
						dataAlign="center"
					>
						결제수단
					</TableHeaderColumn>
					<TableHeaderColumn
						width="160px"
						dataField="wdate"
						dataSort
						dataFormat={salesDataFormat}
						searchable={false}
						dataAlign="center"
					>
						등록시간
					</TableHeaderColumn>
				</BootstrapTable>
			</CP.Tables>
		</CP.Wrapper>
	)
}

export default TableWidgetDeskUsage
