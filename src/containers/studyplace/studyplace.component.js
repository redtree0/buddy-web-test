import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import themeStyles from './studyplace.theme.style'
import Button from '@material-ui/core/Button'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import AddEventDialog from './addEventDialog'
import CafeEditDialog from './cafeEditDialog'
import BizEditDialog from './bizEditDialog'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import classNames from 'classnames'
import axios from '../../wrapper/axios'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import scss from './studyplace.module.scss'
import MobileDetect from 'mobile-detect'
import kindData from './data/kindData.json'

const md = new MobileDetect(window.navigator.userAgent)

class StudyRoom extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			_placeList: [],
			placeList: [],
			eventDialogOpen: false,
			newData: null,

			placeSeq: null,
			selectedService: 'Y'
		}
	}

	componentWillMount() {
		if (!(sessionStorage.getItem('manager_permission') >= 7)) {
			window.location.href = '/dashboard'
		}
	}

	componentDidMount = async () => {
		window.kakao && window.kakao.maps ? null : await this.addScript()
		await this.loadData()
	}

	addScript = () => {
		try {
			const script = document.createElement('script')
			script.async = true
			script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=42443970b9dcfeeae637e6375b532d28&libraries=services&autoload=false'
			document.head.appendChild(script)
		} catch (error) {
			console.log(error)
		}
	}

	loadData = async () => {
		try {
			const res = await axios.get('/place', {
				headers: { 'Content-type': 'application/json' },
				params: { perPage: 1000 }
			})
			if (res.status == 200) {
				res.data &&
					res.data.list &&
					res.data.list.forEach((el) => {
						el.isPublic = el.isPublic ? '공개' : '미공개'
						el.isOpen = el.isOpen ? '오픈' : '비오픈'
					})
				this.setState({ _placeList: res.data.list })

				if (res.data.list.length) {
					let placeList
					if (this.state.selectedService === 'Y') {
						placeList = res.data.list.filter((el) => {
							return el.isService
						})
					} else if (this.state.selectedService === 'N') {
						placeList = res.data.list.filter((el) => {
							return !el.isService
						})
					} else {
						placeList = res.data.list
					}
					this.setState({ placeList: placeList })
				}
			} else {
				throw new Error(res)
			}
		} catch (error) {
			console.error(error)
		}
	}

	//Search 오른쪽 버튼 Custom
	createCustomClearButton = (onClick) => {
		return (
			<button className="btn btn-warning" onClick={onClick}>
				초기화
			</button>
		)
	}

	//페이지당 Row 갯수 설정

	renderSizePerPageDropDown = (props) => {
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

	//신규 등록 버튼 Custom

	createCustomInsertButton = (onClick) => {
		return <AddEventDialog onClose={this.closeEvent} />
	}

	//Dialog Close Event

	closeEvent = (data) => {
		if (!data || !data.flag) return
		else if (data.flag === 'success') {
			this.alertMessage('완료', data.message, 'success')
			this.loadData()
		} else if (data.flag === 'fail') {
			this.alertMessage('저장실패', data.message, 'danger')
		} else if (data.flag === 'error') {
			this.alertMessage('에러', data.message, 'danger')
		} else if (data.flag === 'delete') {
			axios
				.delete('/place/' + this.state.placeSeq)
				.then((res) => {
					if (res.data && res.data.result === 'success') {
						alert('삭제 되었습니다.')
						this.loadData()
					}
				})

				.catch((error) => {
					alert('에러가 발생하였습니다.[' + JSON.stringify(error) + ']')
					console.error(error)
				})
		}

		// this.setState({ newData: data });

		// this.setState({
		//   snackbarOpen: true,
		//   snackbarMessage: 'Event Saved'
		// });
	}

	//접속 버튼 Click Event
	onClickConnect(cell, row, rowIndex) {
		axios
			.get('/place/' + row['seq'] + '/connect')
			.then((res) => {
				if (res.data.result === 'success') {
					localStorage.setItem('manager_place', JSON.stringify({ key: row['key'], seq: row['seq'], name: row['name'] }))
					localStorage.setItem('access_token', res.data.access_token)
					axios.defaults.headers.common['access_token'] = res.data.access_token
					window.location.href = '/dashboard'
				}
			})
			.catch((error) => console.error(error))
	}

	// //수정 버튼 Click Event
	onClickEdit(cell, row, rowIndex, clickedDomId) {
		this.setState({ placeSeq: row['seq'] })
		const hiddenButton = document.getElementById(clickedDomId)
		if (hiddenButton) {
			hiddenButton.click()
		}
	}
	// 카페정보 클릭
	onClickCafeInfo(cell, row, rowIndex) {
		this.onClickEdit(cell, row, rowIndex, 'editDialog_btn')
	}
	// 사업자정보 클릭
	onClickCompany(cell, row, rowIndex) {
		this.onClickEdit(cell, row, rowIndex, 'companyDialog_btn')
	}

	/**
	 * Message 출력
	 */
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

	componentDidMount = async () => {
		window.kakao && window.kakao.maps ? null : await this.addScript()
		await this.loadData()
	}

	addScript = () => {
		try {
			const script = document.createElement('script')
			script.async = true
			script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=42443970b9dcfeeae637e6375b532d28&libraries=services&autoload=false'
			document.head.appendChild(script)
		} catch (error) {
			console.log(error)
		}
	}

	cellButton(cell, row, enumObject, rowIndex) {
		const { classes } = this.props
		return (
			<div className={scss.button_div}>
				<Button variant="outlined" className={scss.edit_btn} onClick={() => this.onClickCafeInfo(cell, row, rowIndex)}>
					{Number(window.sessionStorage.getItem('manager_permission')) === 9 ? '수정' : '상세'}
				</Button>
				<Button variant="outlined" className={scss.company_btn} onClick={() => this.onClickCompany(cell, row, rowIndex)}>
					사업자정보
				</Button>
				<Button variant="outlined" className={scss.connect_btn} onClick={() => this.onClickConnect(cell, row, rowIndex)}>
					접속
				</Button>
			</div>
		)
	}

	typeFormat(cell) {
		return kindData.find((e) => e.value === cell).label || ''
	}

	serviceTypeChange = (event, value) => {
		this.setState({ selectedService: value })
		if (this.state._placeList.length) {
			let placeList = []
			if (value === 'Y') {
				placeList = this.state._placeList.filter((el) => {
					return el.isService
				})
			} else if (value === 'N') {
				placeList = this.state._placeList.filter((el) => {
					return !el.isService
				})
			} else {
				placeList = this.state._placeList
			}
			this.setState({ placeList: placeList })
		}
	}

	render() {
		const { classes } = this.props
		const placeList = this.state.placeList
		const options = {
			defaultSortName: 'seq', // default sort column name
			defaultSortOrder: 'desc', // default sort order
			clearSearch: true,
			clearSearchBtn: this.createCustomClearButton,
			sizePerPageDropDown: this.renderSizePerPageDropDown,
			insertBtn: this.createCustomInsertButton
		}
		return (
			<div
				id="main"
				className={scss.study_place_div}
				style={{
					minWidth: md.mobile() ? '100%' : '800px',
					margin: md.mobile() ? '0' : null,
					fontSize: md.mobile() ? '0.8rem' : null,
					position: 'relative'
				}}
			>
				<ReactNotifications />
				<div
					className={classNames(
						'col-xs-6 col-sm-3 col-md-3 col-lg-7',
						md.mobile() ? scss.study_place_radio_group_m : scss.study_place_radio_group
					)}
				></div>
				<div style={{ margin: md.mobile() ? '5%' : null, position: 'relative' }}>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						row={true}
						className={`${classes.group} ${scss.select_bar}`}
						value={this.state.selectedService}
						onChange={this.serviceTypeChange}
					>
						<FormControlLabel value="" control={<Radio />} label="전체" />
						<FormControlLabel value="Y" control={<Radio />} label="입점" />
						<FormControlLabel value="N" control={<Radio />} label="미입점" />
					</RadioGroup>

					<BootstrapTable
						data={placeList}
						options={options}
						insertRow={Number(window.sessionStorage.getItem('manager_permission')) === 9}
						search
						pagination
						hover
						className={'study_place_bs'}
					>
						<TableHeaderColumn dataField="key" isKey dataSort width="0">
							Key
						</TableHeaderColumn>
						<TableHeaderColumn dataField="seq" dataSort width="70px">
							No.
						</TableHeaderColumn>
						<TableHeaderColumn dataField="placeType" dataSort dataFormat={this.typeFormat.bind(this)} width="90px">
							종류
						</TableHeaderColumn>
						<TableHeaderColumn dataField="name" dataSort width="200px">
							공간명
						</TableHeaderColumn>
						<TableHeaderColumn dataField="isPublic" dataSort width="90px">
							상태
						</TableHeaderColumn>
						<TableHeaderColumn dataField="isOpen" dataSort width="90px">
							오픈
						</TableHeaderColumn>
						<TableHeaderColumn dataField="button" dataFormat={this.cellButton.bind(this)} width="260px"></TableHeaderColumn>
					</BootstrapTable>
				</div>
				<div className="hidden_">
					<CafeEditDialog className="hidden_" placeSeq={this.state.placeSeq} onClose={this.closeEvent} />
					<BizEditDialog className="hidden_" placeSeq={this.state.placeSeq} onClose={this.closeEvent} />
				</div>
			</div>
		)
	}
}

StudyRoom.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(StudyRoom)
