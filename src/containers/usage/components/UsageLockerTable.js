import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import moment from 'moment'
import SortBtn from './SortBtn'

function UsageLockerTable({ data, options, orderClick, sort }) {
	return (
		<BootstrapTable data={data} options={options} hover className={'study_place_bs'}>
			<TableHeaderColumn dataField="seq" isKey searchable={false} width="60px">
				<SortBtn sort={sort} title="Seq" orderClick={() => orderClick('seq')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="memberName" width="76px">
				<SortBtn sort={sort} title="이름" orderClick={() => orderClick('member.name')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="memberPhone" width="100px" dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}>
				<SortBtn sort={sort} title="전화번호" orderClick={() => orderClick('member.phone')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="lockerNo" width="90px">
				<SortBtn sort={sort} title="락커번호" orderClick={() => orderClick('lockerNo')} />
			</TableHeaderColumn>
			<TableHeaderColumn
				dataField="productName"
				searchable={false}
				dataAlign="left"
				width="180px"
				dataFormat={(cell, row) => (row.isCanceled == true ? <s>{cell}</s> : cell)}
			>
				<SortBtn sort={sort} title="이용권" orderClick={() => orderClick('product.name')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="startDT" searchable={false} width="110px" dataFormat={(cell) => moment(cell).format('M/D HH:mm')}>
				<SortBtn sort={sort} title="시작일시" orderClick={() => orderClick('startDT')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="endDT" searchable={false} width="110px" dataFormat={(cell) => moment(cell).format('M/D HH:mm')}>
				<SortBtn sort={sort} title="종료일시" orderClick={() => orderClick('endDT')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="isCanceled" searchable={false} width="60px" dataFormat={(cell) => (cell == true ? '취소' : '')}>
				취소
			</TableHeaderColumn>
			<TableHeaderColumn dataField="mdate" searchable={false} width="94px" dataFormat={(cell) => moment(cell).format('M/D HH:mm')}>
				<SortBtn sort={sort} title="수정일시" orderClick={() => orderClick('mdate')} />
			</TableHeaderColumn>
		</BootstrapTable>
	)
}

export default UsageLockerTable
