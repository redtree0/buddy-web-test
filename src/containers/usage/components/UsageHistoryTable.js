import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import SortBtn from './SortBtn'

function UsageHistoryTable({ data, options, orderClick, sort }) {
	return (
		<BootstrapTable data={data} options={options} hover className={'study_place_bs'} condensed={true}>
			<TableHeaderColumn isKey={true} dataField="no" width="60px" dataAlign="center">
				<SortBtn sort={sort} title="No" orderClick={() => orderClick('seq')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="userName" width="80px" dataAlign="center">
				<SortBtn sort={sort} title="이름" orderClick={() => orderClick('userName')} />
			</TableHeaderColumn>
			<TableHeaderColumn
				dataField="userPhone"
				width="94px"
				dataAlign="center"
				dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}
			>
				<SortBtn sort={sort} title="전화번호" orderClick={() => orderClick('userPhone')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="action" width="110px" dataAlign="center">
				<SortBtn sort={sort} title="행동" orderClick={() => orderClick('action')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="memo" width="200px" dataAlign="center">
				<SortBtn sort={sort} title="내용" orderClick={() => orderClick('memo')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="wdate" width="100px" dataAlign="center">
				<SortBtn sort={sort} title="발생시간" orderClick={() => orderClick('wdate')} />
			</TableHeaderColumn>
		</BootstrapTable>
	)
}

export default UsageHistoryTable
