import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import MobileDetect from 'mobile-detect'
import {
	amountFormat,
	amountPhoneNumber,
	dataFormat,
	loadData,
	productFormat,
	renderSizePerPageDropDown,
	userFormat
} from './libs/parseData'
import * as CP from './TableWedget.styled'
import { useQuery } from 'react-query'

const md = new MobileDetect(window.navigator.userAgent)

function TableWidgetDeskUsage() {
	const [seq, _] = useState(JSON.parse(localStorage.getItem('manager_place'))?.seq || null)

	// const [data, setData] = useState([])

	const options = {
		defaultSortName: '', // default sort column name
		defaultSortOrder: 'asc', // default sort order
		sizePerPageDropDown: renderSizePerPageDropDown,
		sizePerPage: 5,
		noDataText: '데이터 없음'
	}

	const { data, isLoading, error } = useQuery(['dashboard', 'tableWidgetDeskUsage'], () => loadData(seq))

	const sendGroupSMS = () => {
		if (!md.mobile()) {
			alert('스마트폰에서 가능한 기능입니다.')
			return
		}
		const agent = window.navigator.userAgent.toLowerCase()
		let link = 'sms:'
		if (agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) {
			link += '//open?addresses='
		}
		data.forEach((m) => {
			if (m.user && m.user.phone) link += m.user.phone + ','
		})

		window.location.href = link.slice(0, -1)
	}

	return (
		<CP.Wrapper id="dashboard_deskusage">
			<div>
				<Button
					variant="outlined"
					size="small"
					style={{ float: 'right', marginTop: '-43px', marginRight: md.mobile() ? null : '10px' }}
					onClick={sendGroupSMS}
				>
					단체문자
				</Button>
			</div>
			<CP.Tables isMobile={md.mobile()} isDesk={true}>
				<BootstrapTable data={data} options={options} pagination hover className={'study_place_bs'}>
					<TableHeaderColumn dataField="deskNo" isKey dataSort searchable={false} width="90px" dataAlign="center">
						좌석번호
					</TableHeaderColumn>
					<TableHeaderColumn width="100px" dataField="userName" dataSort dataFormat={userFormat} dataAlign="center">
						회원
					</TableHeaderColumn>
					<TableHeaderColumn width="150px" dataField="productType" dataSort dataFormat={productFormat} dataAlign="center">
						상품명
					</TableHeaderColumn>
					<TableHeaderColumn
						width="150px"
						dataField="startDT"
						dataSort
						dataFormat={dataFormat}
						searchable={false}
						dataAlign="center"
					>
						기간
					</TableHeaderColumn>
					<TableHeaderColumn
						width="120px"
						dataField="phoneNumber"
						dataFormat={amountPhoneNumber}
						searchable={false}
						dataAlign="center"
					>
						전화번호
					</TableHeaderColumn>
					<TableHeaderColumn
						width="120px"
						dataField="salesHistory"
						dataSort
						dataFormat={amountFormat}
						searchable={false}
						dataAlign="center"
					>
						사용금액
					</TableHeaderColumn>
					<TableHeaderColumn
						width="120px"
						dataField="usersCash"
						dataSort
						dataFormat={amountFormat}
						searchable={false}
						dataAlign="center"
					>
						보유캐시
					</TableHeaderColumn>
				</BootstrapTable>
			</CP.Tables>
		</CP.Wrapper>
	)
}

export default TableWidgetDeskUsage
