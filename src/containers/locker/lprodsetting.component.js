import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import withWidth from '@material-ui/core/withWidth'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import ProdDetailDialog from './prodDetailDialog'
import axios from '../../wrapper/axios'
import update from 'react-addons-update'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import 'react-notifications-component/dist/theme.css'

import themeStyles from './lprodsetting.theme.style'

class LProdSetting extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			products: [], //상품 List

			editData: null, //수정할 상품 Data
			editRow: null,
			productSeq: null,

			add_order: '', //순서
			add_day: '', //일
			add_title: '', //명칭
			add_price: '', //금액
			add_isAppPublic: true, //앱노출

			cancelboxisOn: false,
			saveStatus: false // 저장 버튼 상태
		}
	}

	/**
	 * 좌석 페이지에서 좌석 정보 받아와서 세팅
	 */
	componentWillMount = async () => {
		await setTimeout(() => {
			axios
				.get('/product/locker/' + JSON.parse(localStorage.getItem('manager_place')).seq + '?all=true')
				.then((res) => {
					if (res.status === 200) {
						this.setState({ products: res.data, add_order: res.data && res.data.length + 1 })
					}
				})

				.catch((error) => console.error(error))
		}, 0)
	}

	componentDidMount = () => {}

	//체크박스 onChange
	checkdChange = (prop, value) => {
		this.setState({ [prop]: value })
	}

	//기본 onChange
	handleFormFieldChange = (prop, value) => {
		this.setState({ [prop]: value })
	}

	//순서 & 시간/일 onChange
	handleChange = (prop, value) => {
		const re = /^[0-9,]+$/
		if (value === '' || re.test(value)) {
			this.setState({ [prop]: value })
		}

		if (prop === 'add_day') {
			this.setState({
				add_title: value === '' ? '' : `락커 ${value >= 7 && value % 7 === 0 ? value / 7 + '주' : value + '일'}`
			})
		}
	}

	//금액 체크
	payChange = (prop, value) => {
		const re = /^[0-9,]+$/
		if (value === '' || re.test(value)) {
			value = value.replace(/,/gi, '')
			value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			this.setState({ [prop]: value })
		}
	}

	//체크박스 onChange
	handleChecked = () => {
		this.setState({ add_isAppPublic: !this.state.add_isAppPublic })
	}

	//추가 Event
	onCreate = () => {
		if (this.state.add_order === '') {
			this.alertMessage('경고', '순서를 입력해주세요', 'danger')
			return
		} else if (this.state.add_day === '') {
			this.alertMessage('경고', '일 수를 입력해주세요.', 'danger')
			return
		} else if (this.state.add_title === '') {
			this.alertMessage('경고', '명칭을 입력해주세요.', 'danger')
			return
		} else if (this.state.add_price === '') {
			this.alertMessage('경고', '금액을 입력해주세요.', 'danger')
			return
		}

		let data = {
			placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
			managerSeq: parseInt(sessionStorage.getItem('manager_seq'), 10),
			serviceType: 'lock',
			order: Number(this.state.add_order),
			deskType: null,
			timeType: 'day',
			time: null,
			day: parseInt(this.state.add_day, 10),
			name: this.state.add_title,
			title: this.state.add_title,
			price: this.state.add_price && parseInt(this.state.add_price.replace(/,/gi, ''), 10),
			isAppPublic: this.state.add_isAppPublic || false,
			isLive: true
		}

		const _products = this.state.products.slice()
		_products.push(data)
		this.setState({
			products: _products,
			add_order: Number(this.state.add_order) + 1, //Seq
			add_day: '', //일
			add_title: '', //명칭
			add_price: '' //금액
		})
	}

	//상품 저장 Event
	productsSave = async () => {
		if (this.state.saveStatus === false) {
			this.setState({ saveStatus: true })
			await axios
				.post('/product/locker/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/batch', this.state.products)
				.then((res) => {
					if (res.data.result === 'success') {
						setTimeout(() => {
							this.setState({ saveStatus: false })
						}, 1000)
						this.alertMessage('알림', '저장이 완료되었습니다', 'success')
						return
					}
				})
				.catch((error) => {
					setTimeout(() => {
						this.setState({ saveStatus: false })
					}, 1000)
					console.error(error)
					this.alertMessage('에러', error.message, 'danger')
					return
				})
		}
	}

	//Dialog Close Event(수정)
	closeEvent = async (data) => {
		if (!data) return

		if (data === 'datacheck') {
			this.alertMessage('경고', '항목을 입력해주세요.', 'danger')
			return
		}

		//삭제 처리
		if (data === 'delete') {
			if (this.state.productSeq !== undefined) {
				await axios
					.delete('/product/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/' + this.state.productSeq)
					.then((res) => {
						if (res.data.result === 'success') {
							this.alertMessage('알림', '삭제 되었습니다.', 'success')
							this.reLoad()
							return
						}
					})
					.catch((error) => {
						console.error(error)
						this.alertMessage('에러', error.message, 'danger')
						return
					})
			} else {
				await this.setState({
					products: update(this.state.products, {
						$splice: [[this.state.editRow, 1]]
					})
				})
				return
			}
		}

		//수정 처리
		if (data.e === 'add') {
			await this.setState({
				products: update(this.state.products, {
					[this.state.editRow]: { $set: data.value }
				})
			})
			return
		}
	}

	reLoad = async () => {
		await setTimeout(() => {
			axios
				.get('/product/locker/' + JSON.parse(localStorage.getItem('manager_place')).seq + '?all=true')
				.then((res) => {
					if (res.status == 200) {
						this.setState({ products: res.data })
					}
				})
				.catch((error) => console.error(error))
		}, 0)
	}

	//Message 출력
	alertMessage = (title, message, type) => {
		Store.addNotification({
			title: title,
			message: message.toString(),
			type: type,
			insert: 'top',
			container: 'top-center',
			animationIn: ['animated', 'fadeIn'],
			animationOut: ['animated', 'fadeOut'],
			dismiss: { duration: 3000 },
			dismissable: { click: true }
		})
	}

	//수정 버튼 Click Event
	onClickEdit = async (cell, row, rowIndex) => {
		const data = await row
		const index = await this.state.products.indexOf(row)
		await this.setState({ editData: data, editRow: index, productSeq: row.seq })

		await document.getElementById('detailDialog_btn').click()
	}

	//순서 Format
	orderFormat = (cell, row) => {
		return parseInt(cell, 10)
	}

	//일 Format
	timeFormat = (cell, row) => {
		return row.day + '일'
	}

	//금액 Format
	payFormat = (cell, row) => {
		return cell ? cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'
	}

	//Table 체크박스
	checkBoxFormat = (cell, row) => {
		return (
			<div>
				<input type="checkbox" checked={cell} onChange={this.checkdChange} style={{ width: '20px', height: '20px' }} />
			</div>
		)
	}

	//Table 수정버튼
	cellButton(cell, row, enumObject, rowIndex) {
		const { classes } = this.props
		return (
			<div>
				<Button
					variant="outlined"
					color="secondary"
					className={classNames(classes.prodBtn_edit)}
					onClick={() => this.onClickEdit(cell, row, rowIndex)}
				>
					수정
				</Button>
			</div>
		)
	}

	/**
	 * 취소 버튼
	 */
	onCancel = async () => {
		this.props.history.goBack()
	}
	boxClose = () => {
		this.setState({ cancelboxisOn: false, confirmboxisOn: false })
		document.getElementById('cancel_box').style.display = 'none'
	}
	cancelBack = () => {
		this.setState({ cancelboxisOn: false })
		document.getElementById('cancel_box').style.display = 'none'
		window.location.href = '/locker'
	}

	render() {
		const { classes } = this.props
		const products = this.state.products
		const options = {
			defaultSortName: 'order', // default sort column name
			defaultSortOrder: 'esc' // default sort order
		}
		return (
			<div id="prod_main" style={{ height: '100%', marginLeft: '10%', marginRight: '10%', marginTop: '0px' }}>
				<ReactNotifications />
				<Grid container spacing={16} style={{ height: '100%' }}>
					<Grid
						key={2}
						item
						xs={12}
						sm={12}
						md={12}
						className={classNames(classes.portalWidget)}
						style={{ height: '90%', width: '100%', minWidth: '800px', paddingTop: '40px' }}
					>
						<div className={'row'} style={{ height: '40px', verticalAlign: 'middle' }}>
							<Typography variant="title" component="p" style={{ paddingTop: '0px' }}>
								상품
							</Typography>
						</div>
						<div>
							<BootstrapTable
								data={products}
								options={options}
								// keyBoardNav
								trStyle={{ backgroundColor: 'white' }}
								hover
								className={'study_place_bs'}
							>
								<TableHeaderColumn dataField="seq" isKey={true} hidden={true} dataAlign="center">
									Seq
								</TableHeaderColumn>
								<TableHeaderColumn dataField="order" width="10%" dataFormat={this.orderFormat} dataAlign="center">
									순서
								</TableHeaderColumn>
								<TableHeaderColumn dataField="day" width="15%" dataFormat={this.timeFormat} dataAlign="center">
									일수
								</TableHeaderColumn>
								<TableHeaderColumn dataField="title" width="20%" dataAlign="center">
									상품명
								</TableHeaderColumn>
								<TableHeaderColumn dataField="price" width="20%" dataFormat={this.payFormat} dataAlign="center">
									금액
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="isAppPublic"
									width="10%"
									dataFormat={this.checkBoxFormat}
									editable={{ type: 'checkbox', options: { values: 'true:false' } }}
									dataAlign="center"
								>
									앱노출
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="button"
									width="15%"
									dataAlign="center"
									dataFormat={this.cellButton.bind(this)}
								></TableHeaderColumn>
							</BootstrapTable>

							<table id="prod_table" style={{ marginTop: '20px', border: 'solid 1px #dddddd' }}>
								<colgroup>
									<col width="10%" />
									<col width="15%" />
									<col width="20%" />
									<col width="20%" />
									<col width="10%" />
									<col width="15%" />
								</colgroup>
								<tbody>
									<tr>
										<td className={classes.bg_td}>
											<input
												type="number"
												className={classNames('form-control', classes.prodset_textarea)}
												maxLength="3"
												rows="1"
												id="textarea1"
												value={this.state.add_order}
												placeholder="순서"
												onChange={(e) => this.handleChange('add_order', e.target.value)}
											/>
										</td>
										<td className={classes.bg_td}>
											<input
												type="text"
												className={classNames('form-control', classes.prodset_textarea)}
												rows="1"
												maxLength="3"
												min="1"
												max="999"
												id="textarea1"
												value={this.state.add_day}
												placeholder="일수"
												onChange={(e) => this.handleChange('add_day', e.target.value)}
											/>
										</td>
										<td className={classes.bg_td}>
											<input
												type="text"
												className={classNames('form-control', classes.prodset_textarea)}
												rows="1"
												maxLength="15"
												id="textarea1"
												style={{ padding: '0px' }}
												value={this.state.add_title}
												placeholder="명칭"
												onChange={(e) => this.handleFormFieldChange('add_title', e.target.value)}
											/>
										</td>
										<td className={classes.bg_td}>
											<input
												type="text"
												className={classNames('form-control', classes.prodset_textarea)}
												rows="1"
												maxLength="7"
												min="0"
												max="9999999"
												id="textarea1"
												value={this.state.add_price}
												placeholder="0원"
												onChange={(e) => this.payChange('add_price', e.target.value)}
											/>
										</td>
										<td className={classes.bg_td}>
											<input
												type="checkbox"
												checked={this.state.add_isAppPublic}
												style={{ width: '20px', height: '20px' }}
												onChange={this.handleChecked}
											/>
										</td>
										<td className={classes.bg_td}>
											<Button
												variant="outlined"
												color="primary"
												className={classNames(classes.prodBtn_add)}
												onClick={this.onCreate}
											>
												추가
											</Button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Grid>

					<Grid
						key={3}
						item
						xs={12}
						sm={12}
						md={12}
						className={classes.portalWidget}
						style={{ height: '10%', display: 'table', textAlign: 'center' }}
					>
						<div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
							<Button variant="outlined" size="large" color="default" className={classes.button} onClick={this.onCancel}>
								취소
							</Button>
							<Button
								variant="outlined"
								size="large"
								color="primary"
								className={classes.button}
								style={{ marginLeft: '20px' }}
								onClick={this.productsSave}
								disabled={this.state.saveStatus === true}
							>
								저장
							</Button>
						</div>
					</Grid>
				</Grid>
				<div className="hidden_">
					<ProdDetailDialog editData={this.state.editData} onClose={this.closeEvent} />
				</div>

				<div id="cancel_box" className={classes.cancel_box}>
					<span className={classes.cancel_box_span}>취소하시겠습니까?</span>
					<button className={classes.cancel_box_button_cancel} onClick={this.boxClose}>
						취소
					</button>
					<button className={classes.cancel_box_button_confirm} onClick={this.cancelBack}>
						확인
					</button>
				</div>
			</div>
		)
	}
}

LProdSetting.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(LProdSetting)
