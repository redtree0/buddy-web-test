import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import moment from 'moment'

import SortBtn from './SortBtn'
import { useEffect, useRef } from 'react'

function UsageDeskTable({ data, options, orderClick, sort }) {
	const ref = useRef()
	useEffect(() => {
		console.log(ref.current)
		// ref.current.addEventListener('touchstart', (e) => console.log(e))
	}, [])
	return (
		<BootstrapTable
			bodyStyle={{ position: 'relative', zIndex: 100000 }}
			ref={ref}
			data={data}
			options={options}
			hover
			className={'study_place_bs'}
		>
			<TableHeaderColumn dataField="seq" isKey searchable={false} width="60px">
				<SortBtn sort={sort} title="Seq" orderClick={() => orderClick('seq')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="memberName" width="76px">
				<SortBtn sort={sort} title="이름" orderClick={() => orderClick('member.name')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="memberPhone" width="100px" dataFormat={(cell) => <a href={'sms:' + cell}>{cell}</a>}>
				<SortBtn sort={sort} title="전화번호" orderClick={() => orderClick('member.phone')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="deskNo" width="60px">
				<SortBtn sort={sort} title="좌석" orderClick={() => orderClick('deskNo')} />
			</TableHeaderColumn>
			<TableHeaderColumn
				dataField="deskType"
				searchable={false}
				width="90px"
				dataFormat={(cell) =>
					cell == 'open'
						? '오픈형'
						: cell == 'semi'
						? '반폐쇄형'
						: cell == 'close'
						? '폐쇄형'
						: cell == 'round'
						? '오피스형'
						: cell == 'sofa'
						? '라운지형'
						: cell == 'dual'
						? '2인형'
						: cell
				}
			>
				<SortBtn sort={sort} title="좌석타입" orderClick={() => orderClick('deskType')} />
			</TableHeaderColumn>
			<TableHeaderColumn
				dataField="timeType"
				searchable={false}
				width="90px"
				dataFormat={(cell) =>
					cell == 'time'
						? '1회권'
						: cell == 'char'
						? '충전권'
						: cell == 'free'
						? '자유석'
						: cell == 'day'
						? '지정석'
						: cell == 'real'
						? '실시간'
						: cell
				}
			>
				<SortBtn sort={sort} title="이용타입" orderClick={() => orderClick('timeType')} />
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
			<TableHeaderColumn
				dataField="startDT"
				searchable={false}
				width="110px"
				dataFormat={(cell) => moment(cell).format('YY/M/D HH:mm')}
			>
				<SortBtn sort={sort} title="시작일시" orderClick={() => orderClick('startDT')} />
			</TableHeaderColumn>
			<TableHeaderColumn
				dataField="endDT"
				searchable={false}
				width="110px"
				dataFormat={(cell) => (cell ? moment(cell).format('M/D HH:mm') : '-')}
			>
				<SortBtn sort={sort} title="종료일시" orderClick={() => orderClick('endDT')} />
			</TableHeaderColumn>
			<TableHeaderColumn dataField="extendCount" searchable={false} width="60px" dataFormat={(cell) => (cell > 0 ? cell + '회' : '')}>
				연장
			</TableHeaderColumn>
			<TableHeaderColumn dataField="isExit" searchable={false} width="60px" dataFormat={(cell) => (cell == true ? '퇴실' : '')}>
				퇴실
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

export default UsageDeskTable
