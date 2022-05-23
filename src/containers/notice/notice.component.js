import React from 'react'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import axios from '../../wrapper/axios'
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import TextField from '@material-ui/core/TextField'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import DetailDialog from './detailDialog'
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent)

const styles = (theme) => ({
	tableLayout: {
		background: 'white',
		border: 'solid 2px #dddddd',
		padding: '20px',
		margin: '10px',
		borderRadius: '12px'
	},
	messageLayout: {
		background: 'white',
		border: 'solid 2px #dddddd',
		padding: '20px',
		margin: '10px',
		borderRadius: '12px',
		width: '320px'
	},
	messageTitle: {
		display: 'block',
		textAlign: 'left',
		marginBottom: '10px',
		fontSize: '20px',
		fontWeight: '600'
	},
	messageTxt: {
		resize: 'none',
		marginTop: '20px',
		width: '100%'
	},
	messageBtn: {
		width: '100%',
		marginTop: '20px'
	}
})

class Notice extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			messageData: [],
			messageValue: '',
			startDate: moment().format('YYYY-MM-DD'),
			endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
			defaultOrder: 'seq',
			order: 'desc'
		}
	}

	componentDidMount() {
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	loadData = async () => {
		axios
			.get('/notice/list', {
				params: {
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq
				}
			})
			.then((res) => {
				const _messageData = res.data.list.map((el, i) => ({
					...el,
					no: res.data.list.length - i,
					wdate: moment(el.wdate).format('YYYY-MM-DD')
				}))
				this.setState({ messageData: _messageData })
			})
			.catch((error) => console.error(error))

		axios
			.get('/msg/types')
			.then((res) => {
				if (res && res.data && res.data.list) {
					this.setState({ msgTemplates: res.data.list.map((el, i) => ({ ...el, no: i + 1 })) })
				}
			})
			.catch((error) => console.error(error))
	}

	//Dialog Close Event
	closeEvent = (data) => {
		if (!data) return
		else if (data === 'check') {
			this.alertMessage('경고', '공지내용을 입력해주세요.', 'danger')
			return
		} else if (data === 'edit') {
			this.alertMessage('알림', '수정 되었습니다', 'success')
		} else if (data === 'delete') {
			this.alertMessage('알림', '삭제 되었습니다', 'success')
		}
		this.loadData()
	}

	messageSend = async () => {
		if (!this.state.startDate || !this.state.endDate) {
			this.alertMessage('알림', '공지 시작/종료일을 설정하세요', 'danger')
			return
		}
		if (this.state.messageValue === null || this.state.messageValue === '') {
			this.alertMessage('알림', '내용을 입력해주세요', 'danger')
			return
		}

		await axios
			.post('/notice/add', {
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				contents: this.state.messageValue,
				startDate: this.state.startDate,
				endDate: this.state.endDate
			})
			.then((res) => {
				if (res.data.result === 'success') {
					this.alertMessage('알림', '등록 되었습니다', 'success')
					this.loadData()
					this.reset()
				} else {
					this.alertMessage('알림', res.data.message, 'danger')
				}
			})
			.catch((error) => console.error(error))
	}

	handleChange = (prop) => (event) => {
		this.setState({ [prop]: event.target.value })
	}

	alertMessage = (title, message, type) => {
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

	reset = () => {
		this.setState({
			messageValue: ''
		})
	}

	dataSort = async (dataField) => {
		if (this.state.defaultOrder !== dataField) {
			await this.setState({ defaultOrder: dataField, order: 'desc' })
		} else {
			this.setState({ defaultOrder: dataField })
			if (this.state.order === 'desc') {
				await this.setState({ order: 'asc' })
			} else {
				await this.setState({ order: 'desc' })
			}
		}

		this.loadData()
	}

	orderCheck = (value) => {
		if (value === this.state.defaultOrder) {
			return (
				<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
					{value === 'seq'
						? 'No'
						: value === 'startDate'
						? '시작일'
						: value === 'endDate'
						? '종료일'
						: value === 'wdate'
						? '등록일'
						: value}
					<span className={classNames('order', this.state.order === 'asc' ? 'dropup' : '')}>
						<span className="caret" style={{ margin: '10px 5px' }}></span>
					</span>
				</div>
			)
		} else {
			return (
				<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
					{value === 'seq'
						? 'No'
						: value === 'startDate'
						? '시작일'
						: value === 'endDate'
						? '종료일'
						: value === 'wdate'
						? '등록일'
						: value}
					<span className="order">
						<span className="dropdown">
							<span className="caret" style={{ margin: '10px 0px 10px 5px', color: 'rgb(204, 204, 204)' }}></span>
						</span>
						<span className="dropup">
							<span className="caret" style={{ margin: '10px 0px', color: 'rgb(204, 204, 204)' }}></span>
						</span>
					</span>
				</div>
			)
		}
	}

	render() {
		const { classes } = this.props
		const { messageData } = this.state
		const options = {
			defaultSortName: 'seq', // default sort column name
			noDataText: '데이터 없음',
			onRowClick: this.openDialog
		}
		return (
			<div style={{ padding: '5%', width: '100%' }}>
				<ReactNotifications />
				<div className={classNames('col-lg-8', 'col-md-12', 'col-sm-12', classes.tableLayout)}>
					<BootstrapTable data={messageData} options={options} hover>
						<TableHeaderColumn dataField="seq" isKey={true} hidden={true} dataAlign="center">
							Seq
						</TableHeaderColumn>
						<TableHeaderColumn dataField="no" width="50px" dataAlign="center">
							{/* No */}
							{this.orderCheck('seq')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="startDate" width="80px" dataAlign="center">
							{/* 시작일 */}
							{this.orderCheck('startDate')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="endDate" width="80px" dataAlign="center">
							{/* 시작일 */}
							{this.orderCheck('endDate')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="contents" width="300px" dataAlign="left">
							공지내용
						</TableHeaderColumn>
						<TableHeaderColumn dataField="wdate" width="80px" dataAlign="center">
							{/* 등록일 */}
							{this.orderCheck('wdate')}
						</TableHeaderColumn>
					</BootstrapTable>
				</div>
				<div className={classNames('col-lg-4', 'col-sm-12', classes.messageLayout)}>
					<span className={classes.messageTitle}>공지등록</span>

					<textarea
						className={classNames('form-control', classes.messageTxt)}
						rows="8"
						maxLength="200"
						placeholder="공지내용을 입력해주세요(최대 200자)"
						value={this.state.messageValue}
						onChange={this.handleChange('messageValue')}
					></textarea>

					<div className={'row'} style={{ width: md.mobile() ? '100%' : '300px', margin: md.mobile() ? '0' : null }}>
						<div style={{ margin: '10px 15px 0px 15px' }}>
							공지시작일 :
							<TextField
								type="date"
								className={classes.textField}
								InputLabelProps={{
									shrink: true
								}}
								value={this.state.startDate}
								onChange={this.handleChange('startDate')}
							/>
						</div>
					</div>

					<div className={'row'} style={{ width: md.mobile() ? '100%' : '300px', margin: md.mobile() ? '0' : null }}>
						<div style={{ margin: '10px 15px 0px 15px' }}>
							공지종료일 :
							<TextField
								type="date"
								className={classes.textField}
								InputLabelProps={{
									shrink: true
								}}
								value={this.state.endDate}
								onChange={this.handleChange('endDate')}
							/>
						</div>
					</div>

					<Button variant="outlined" onClick={this.messageSend} color="primary" className={classes.messageBtn}>
						등록
					</Button>
				</div>

				<div className="hidden_"></div>
				<DetailDialog setOpenDialog={(open) => (this.openDialog = open)} onClose={this.closeEvent} />
			</div>
		)
	}
}

export default withStyles(styles)(Notice)
