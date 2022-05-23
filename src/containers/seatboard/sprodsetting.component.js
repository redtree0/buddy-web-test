import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import classNames from 'classnames'
import withWidth from '@material-ui/core/withWidth'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import ProdDetailDialog from './prodDetailDialog'
// eslint-disable-next-line import/no-unresolved
import axios from '../../wrapper/axios'
import update from 'react-addons-update'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import 'react-notifications-component/dist/theme.css'

import themeStyles from './sprodsetting.theme.style'

import kindData from './data/kindData.json'
import typeData from './data/typeData.json'

class SProdSetting extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			products: [], //상품 List
			deskPriceSeq: null,
			initMinutes: 0,
			initPrice: 0,
			unitTime: 0,
			unitPrice: 0,
			maxDeskTimeProduct: null,
			maxDeskDayProduct: null,
			maxDeskFreeProduct: null,
			maxDeskCharProduct: null,
			useRealtimeProduct: '0',

			editData: null, //수정할 상품 Data
			editRow: null,
			productSeq: null,

			add_order: '', // 순서
			add_deskType: 'all', // 좌석타입
			add_timeType: 'time', // 종류
			add_day: '', // 일
			add_time: '', // 시간
			add_title: '', // 상품명
			add_subtitle: '', // 설명
			add_price: '', // 금액
			add_isExtend: false, // true:연장전용상품
			add_isAppPublic: true, // true:앱노출/false:관리용

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
				.get('/product/desk/' + JSON.parse(localStorage.getItem('manager_place')).seq + '?all=true&isExtend=all')
				.then((res) => {
					if (res.status === 200) {
						const {
							products,
							deskPriceSeq,
							unitTime,
							unitPrice,
							maxDeskTimeProduct,
							maxDeskDayProduct,
							maxDeskFreeProduct,
							maxDeskCharProduct,
							useRealtimeProduct
						} = res.data
						const initMinutes = res.data.initMinutes ? res.data.initMinutes : 0
						const initPrice = res.data.initPrice ? res.data.initPrice : 0
						this.setState({
							products,
							deskPriceSeq,
							initMinutes,
							initPrice,
							unitTime,
							unitPrice,
							maxDeskTimeProduct,
							maxDeskDayProduct,
							maxDeskFreeProduct,
							maxDeskCharProduct,
							useRealtimeProduct,
							add_order: products && products.length + 1
						})
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
		if (prop === 'add_timeType') {
			if (value === 'time') {
				this.setState({
					add_day: '',
					add_title: this.state.add_time ? `${this.state.add_time}시간권` : '',
					add_subtitle: ''
				})
			} else if (value === 'char') {
				this.setState({
					add_day: '',
					add_title: this.state.add_time ? `${this.state.add_time}시간 충전권` : '',
					add_subtitle: '',
					add_isExtend: false
				})
			} else if (value === 'free') {
				this.setState({
					add_title: this.state.add_day ? `자유석 ${this.state.add_day}일권` : '',
					add_subtitle: this.state.add_time ? `1일 ${this.state.add_time}시간` : ''
				})
			} else if (value === 'day') {
				this.setState({
					add_title: this.state.add_day ? `지정석 ${this.state.add_day}일권` : '',
					add_subtitle: '',
					add_time: ''
				})
			}
		}
	}

	//순서 & 시간/일 onChange
	handleChange = (prop, value) => {
		const re = /(^\d+$)|(^\d+\.\d{1,2}$)/
		if (value === '' || re.test(value)) {
			this.setState({ [prop]: value })

			if (prop === 'add_day') {
				this.setState({
					add_title:
						value === ''
							? ''
							: `${this.state.add_timeType === 'free' ? '자유석 ' : '지정석 '}${
									value >= 7 && value % 7 == 0 ? value / 7 + '주' : value + '일'
							  }권`,
					add_subtitle: this.state.add_time ? `1일 ${this.state.add_time}시간` : ''
				})
			} else if (prop === 'add_time' && this.state.add_timeType === 'time') {
				this.setState({
					add_title: value === '' ? '' : value + '시간권'
				})
			} else if (prop === 'add_time' && this.state.add_timeType === 'char') {
				this.setState({
					add_title: value === '' ? '' : value + '시간 충전권'
				})
			} else if (prop === 'add_time' && this.state.add_timeType === 'free') {
				this.setState({
					add_subtitle: value === '' ? '' : `1일 ${value}시간`
				})
			}
		}
	}

	//금액 체크
	payChange = (prop, value) => {
		const re = /^[0-9\,]+$/
		if (value === '' || re.test(value)) {
			value = value.replace(/,/gi, '')
			value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			this.setState({ [prop]: value })
		}
	}

	//체크박스 onChange
	handleChecked = (e) => {
		this.setState({ [e.target.name]: !this.state[e.target.name] })
	}

	//추가 Event
	onCreate = () => {
		if (this.state.add_order === '') {
			this.alertMessage('경고', '순서를 입력해주세요.', 'danger')
			return
		} else if (this.state.add_timeType === 'day' && this.state.add_day === '') {
			this.alertMessage('경고', '일수를 입력해주세요.', 'danger')
			return
		} else if ((this.state.add_timeType === 'time' || this.state.add_timeType === 'char') && this.state.add_time === '') {
			this.alertMessage('경고', '시간을 입력해주세요.', 'danger')
			return
		} else if (this.state.add_timeType === 'free' && (this.state.add_time === '' || this.state.add_day === '')) {
			this.alertMessage('경고', '일수와 시간을 입력해주세요.', 'danger')
			return
		} else if (this.state.add_title === '') {
			this.alertMessage('경고', '명칭을 입력해주세요.', 'danger')
			return
		} else if (this.state.add_price === '') {
			this.alertMessage('경고', '금액을 입력해주세요.', 'danger')
			return
		}
		const data = {
			placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
			managerSeq: sessionStorage.getItem('manager_seq'),
			serviceType: 'desk',
			order: Number(this.state.add_order),
			deskType: this.state.add_deskType,
			timeType: this.state.add_timeType,
			time: this.state.add_time,
			day: this.state.add_day,
			name: this.state.add_title + (this.state.add_subtitle ? '(' + this.state.add_subtitle + ')' : ''),
			title: this.state.add_title,
			subtitle: this.state.add_subtitle,
			price: this.state.add_price.replace(/,/gi, ''),
			isExtend: this.state.add_isExtend,
			isAppPublic: this.state.add_isAppPublic
		}

		if (!this.state.add_isExtend && window.confirm('연장용 상품도 함께 추가할까요?')) {
			this.onCreateExtendProduct(data)
		} else {
			const _products = this.state.products.slice()
			_products.push(data)
			this.setState({
				products: _products,
				add_order: Number(this.state.add_order) + 1, //Seq
				add_time: '', //시간
				add_day: '', //일
				add_title: '', //상품명
				add_subtitle: '', //설명
				add_price: '' //금액
			})
		}
	}

	onCreateExtendProduct = (data) => {
		const extendData = {
			...data,
			name: this.state.add_title + ' 연장' + (this.state.add_subtitle ? '(' + this.state.add_subtitle + ')' : ''),
			title: this.state.add_title + ' 연장',
			isExtend: true
		}
		const _products = this.state.products.slice()
		_products.push(data, extendData)
		this.setState({
			products: _products,
			add_order: Number(this.state.add_order) + 1, //Seq
			add_time: '', //시간
			add_day: '', //일
			add_title: '', //상품명
			add_subtitle: '', //설명
			add_price: '' //금액
		})
	}

	//좌석 기본금액 저장 Event
	priceSave = async () => {
		if (this.state.saveStatus === false) {
			this.setState({ saveStatus: true })
			let priceData = {
				deskPriceSeq: this.state.deskPriceSeq,
				initMinutes: this.state.initMinutes,
				initPrice: this.state.initPrice ? parseInt(this.state.initPrice.toString().replace(/,/gi, '')) : 0,
				unitTime: this.state.unitTime,
				unitPrice: this.state.unitPrice ? parseInt(this.state.unitPrice.toString().replace(/,/gi, '')) : 0,
				maxDeskTimeProduct: this.state.maxDeskTimeProduct ? parseInt(this.state.maxDeskTimeProduct) : 0,
				maxDeskDayProduct: this.state.maxDeskDayProduct ? parseInt(this.state.maxDeskDayProduct) : 0,
				maxDeskFreeProduct: this.state.maxDeskFreeProduct ? parseInt(this.state.maxDeskFreeProduct) : 0,
				maxDeskCharProduct: this.state.maxDeskCharProduct ? parseInt(this.state.maxDeskCharProduct) : 0,
				useRealtimeProduct: this.state.useRealtimeProduct || false
			}

			await axios
				.post('/desk/price/' + JSON.parse(localStorage.getItem('manager_place')).seq, priceData)
				.then((res) => {
					if (res.data.result === 'success') {
						this.productsSave()
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

	//상품 저장 Event
	productsSave = async () => {
		await axios
			.post('/product/desk/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/batch', this.state.products)
			.then((res) => {
				if (res.status == 200) {
					setTimeout(() => {
						this.setState({ saveStatus: false })
						window.location.reload()
					}, 1000)
					this.alertMessage('알림', '저장되었습니다.', 'success')
				}
			})
			.catch(function (error) {
				setTimeout(() => {
					this.setState({ saveStatus: false })
				}, 1000)
				this.alertMessage('에러', error.message, 'danger')
				console.error(error)
			})
	}

	//Dialog Close Event(수정)
	closeEvent = async (data) => {
		if (!data) return
		else if (data === 'datacheck') {
			this.alertMessage('알림', '항목을 입력해주세요.', 'danger')
		}
		//삭제 처리
		else if (data === 'delete') {
			if (this.state.productSeq !== undefined) {
				await axios
					.delete('/product/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/' + this.state.productSeq)
					.then((res) => {
						if (res.data.result === 'success') {
							this.alertMessage('알림', '삭제가 완료되었습니다.', 'success')
							this.reLoad()
						}
					})
					.catch((error) => {
						console.error(error)
						this.alertMessage('에러', error.message, 'danger')
					})
			} else {
				await this.setState({
					products: update(this.state.products, {
						$splice: [[this.state.editRow, 1]]
					})
				})
			}
		}

		//수정 처리
		else if (data.e === 'add') {
			await this.setState({
				products: update(this.state.products, {
					[this.state.editRow]: { $set: data.value }
				})
			})
		}
	}

	reLoad = async () => {
		await setTimeout(() => {
			axios
				.get('/product/desk/' + JSON.parse(localStorage.getItem('manager_place')).seq + '?all=true&isExtend=all')
				.then((res) => {
					if (res.status == 200) {
						this.setState({
							products: res.data.products
						})
					}
				})
				.catch((error) => console.error(error))
		}, 0)
	}

	//Message 출력
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

	//수정 버튼 Click Event
	onClickEdit = async (cell, row, rowIndex) => {
		const data = await row
		const index = await this.state.products.indexOf(row)
		await this.setState({ editData: data, editRow: index, productSeq: row.seq })

		await document.getElementById('detailDialog_btn').click()
	}

	//순서 Format
	orderFormat = (cell, row) => {
		return parseInt(cell)
	}

	//좌석타입 Format
	deskFormat = (cell, row) => {
		return cell === 'all'
			? '전체'
			: cell === 'open'
			? '오픈형'
			: cell === 'semi'
			? '반폐쇄형'
			: cell === 'close'
			? '완전폐쇄형'
			: cell === 'round'
			? '오피스형'
			: cell === 'sofa'
			? '라운지형'
			: cell === 'dual'
			? '2인형'
			: '알수없음'
	}

	//종류 Format
	typeFormat = (cell, row) => {
		if (cell === 'time') return '1회권'
		else if (cell === 'char') return '충전권'
		else if (cell === 'free') return '기간권(자유석)'
		else if (cell === 'day') return '기간권(지정석)'
		else return ''
	}

	//시간/일 Format
	dayFormat = (cell, row) => {
		return row.day ? row.day + '일' : ''
	}
	timeFormat = (cell, row) => {
		return row.time ? row.time + '시간' + (row.timeType == 'free' ? '/일' : '') : ''
	}

	//금액 Format
	payFormat = (cell, row) => {
		return cell ? cell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원' : '0원'
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

	//슈퍼관리자용 템플릿 세팅 버튼
	onAddTemplate = () => {
		const fixedData = {
			placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
			managerSeq: sessionStorage.getItem('manager_seq'),
			serviceType: 'desk',
			deskType: 'all',
			isAppPublic: true
		}
		this.setState({
			useRealtimeProduct: true,
			initMinutes: 60,
			initPrice: 1000,
			unitTime: 15,
			unitPrice: 300,
			maxDeskTimeProduct: 999,
			maxDeskDayProduct: 60,
			maxDeskFreeProduct: 60,
			maxDeskCharProduct: 999,
			products: [
				...this.state.products,
				{
					...fixedData,
					order: 1,
					price: 3000,
					isExtend: false,
					timeType: 'time',
					time: 3,
					name: '3시간권',
					title: '3시간권',
					subtitle: ''
				},
				{
					...fixedData,
					order: 2,
					price: 5000,
					isExtend: false,
					timeType: 'time',
					time: 6,
					name: '6시간권',
					title: '6시간권',
					subtitle: ''
				},
				{
					...fixedData,
					order: 3,
					price: 7000,
					isExtend: false,
					timeType: 'time',
					time: 9,
					name: '9시간권',
					title: '9시간권',
					subtitle: ''
				},
				{
					...fixedData,
					order: 4,
					price: 9000,
					isExtend: false,
					timeType: 'time',
					time: 12,
					name: '12시간권',
					title: '12시간권',
					subtitle: ''
				},
				{
					...fixedData,
					order: 5,
					price: 50000,
					isExtend: false,
					timeType: 'char',
					time: 50,
					name: '50시간 충전권',
					title: '50시간 충전권',
					subtitle: ''
				},
				{
					...fixedData,
					order: 6,
					price: 95000,
					isExtend: false,
					timeType: 'char',
					time: 100,
					name: '100시간 충전권',
					title: '100시간 충전권',
					subtitle: ''
				},
				{
					...fixedData,
					order: 7,
					price: 55000,
					isExtend: false,
					timeType: 'free',
					day: 14,
					time: 10,
					name: '자유석 2주권(1일 10시간)',
					title: '자유석 2주권',
					subtitle: '1일 10시간'
				},
				{
					...fixedData,
					order: 8,
					price: 60000,
					isExtend: false,
					timeType: 'free',
					day: 14,
					time: 15,
					name: '자유석 2주권(1일 15시간)',
					title: '자유석 2주권',
					subtitle: '1일 15시간'
				},
				{
					...fixedData,
					order: 9,
					price: 99000,
					isExtend: false,
					timeType: 'free',
					day: 28,
					time: 10,
					name: '자유석 4주권(1일 10시간)',
					title: '자유석 4주권',
					subtitle: '1일 10시간'
				},
				{
					...fixedData,
					order: 10,
					price: 110000,
					isExtend: false,
					timeType: 'free',
					day: 28,
					time: 15,
					name: '자유석 4주권(1일 15시간)',
					title: '자유석 4주권',
					subtitle: '1일 15시간'
				},
				{
					...fixedData,
					order: 11,
					price: 159000,
					isExtend: false,
					timeType: 'day',
					day: 28,
					name: '지정석 4주',
					title: '지정석 4주',
					subtitle: ''
				},
				{
					...fixedData,
					order: 12,
					price: 1000,
					isExtend: true,
					timeType: 'time',
					time: 1,
					name: '1시간 연장',
					title: '1시간 연장',
					subtitle: ''
				},
				{
					...fixedData,
					order: 13,
					price: 2000,
					isExtend: true,
					timeType: 'time',
					time: 2,
					name: '2시간 연장',
					title: '2시간 연장',
					subtitle: ''
				},
				{
					...fixedData,
					order: 14,
					price: 3000,
					isExtend: true,
					timeType: 'time',
					time: 3,
					name: '3시간 연장',
					title: '3시간 연장',
					subtitle: ''
				},
				{
					...fixedData,
					order: 15,
					price: 1000,
					isExtend: true,
					timeType: 'char',
					time: 1,
					name: '1시간 추가 충전',
					title: '1시간 추가 충전',
					subtitle: ''
				},
				{
					...fixedData,
					order: 16,
					price: 2000,
					isExtend: true,
					timeType: 'char',
					time: 2,
					name: '2시간 추가 충전',
					title: '2시간 추가 충전',
					subtitle: ''
				},
				{
					...fixedData,
					order: 17,
					price: 50000,
					isExtend: true,
					timeType: 'char',
					time: 50,
					name: '50시간 추가 충전',
					title: '50시간 추가 충전',
					subtitle: ''
				},
				{
					...fixedData,
					order: 18,
					price: 95000,
					isExtend: true,
					timeType: 'char',
					time: 100,
					name: '100시간 추가 충전',
					title: '100시간 추가 충전',
					subtitle: ''
				},
				{
					...fixedData,
					order: 19,
					price: 55000,
					isExtend: true,
					timeType: 'free',
					day: 14,
					time: 10,
					name: '자유석 2주 연장(1일 10시간)',
					title: '자유석 2주 연장',
					subtitle: '1일 10시간'
				},
				{
					...fixedData,
					order: 20,
					price: 60000,
					isExtend: true,
					timeType: 'free',
					day: 14,
					time: 15,
					name: '자유석 2주 연장(1일 15시간)',
					title: '자유석 2주 연장',
					subtitle: '1일 15시간'
				},
				{
					...fixedData,
					order: 21,
					price: 95000,
					isExtend: true,
					timeType: 'free',
					day: 28,
					time: 10,
					name: '자유석 4주 연장(1일 10시간)',
					title: '자유석 4주 연장',
					subtitle: '1일 10시간'
				},
				{
					...fixedData,
					order: 22,
					price: 110000,
					isExtend: true,
					timeType: 'free',
					day: 28,
					time: 15,
					name: '자유석 4주 연장(1일 15시간)',
					title: '자유석 4주 연장',
					subtitle: '1일 15시간'
				},
				{
					...fixedData,
					order: 23,
					price: 159000,
					isExtend: true,
					timeType: 'day',
					day: 28,
					name: '지정석 4주',
					title: '지정석 4주 연장',
					subtitle: ''
				}
			]
		})
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
		window.location.href = '/desk'
	}

	render() {
		const { classes } = this.props
		const products = this.state.products
		const options = {
			defaultSortName: 'order', // default sort column name
			defaultSortOrder: 'esc' // default sort order
		}
		const permission = Number(sessionStorage.getItem('manager_permission'))

		return (
			<div id="prod_main" style={{ height: '100%', marginLeft: '10%', marginRight: '10%', marginTop: '0px' }}>
				<ReactNotifications />
				<Grid container spacing={16} style={{ height: '100%' }}>
					<Grid
						key={1}
						item
						xs={12}
						sm={12}
						md={12}
						className={classNames(classes.portalWidget)}
						style={{ height: '20%', display: 'table', paddingTop: '40px', paddingBottom: '30px' }}
					>
						{/* <div className={'row col-md-12'} style={{ verticalAlign: 'middle', padding: '0px' }}>
							<Typography variant="title" component="p">
								실시간요금제
							</Typography>
						</div> */}
						<div className={'row col-md-12'} style={{ minHeight: '40px', verticalAlign: 'middle' }}>
							<div className={'col-md-4'}>
								<span> 최초 </span>
								<input
									type="number"
									className={classNames('form-control', classes.prodset_textarea)}
									rows="1"
									id="textarea1"
									maxLength="3"
									style={{ padding: '0px', width: '40px' }}
									value={this.state.initMinutes}
									onChange={(e) => this.payChange('initMinutes', e.target.value)}
								/>
								<span>분</span>
								<input
									type="text"
									className={classNames('form-control', classes.prodset_textarea)}
									rows="1"
									id="textarea1"
									maxLength="7"
									style={{ padding: '0px', width: '50px' }}
									value={this.state.initPrice}
									onChange={(e) => this.payChange('initPrice', e.target.value)}
								/>
								<span>원 / 이후 </span>
								<input
									type="number"
									className={classNames('form-control', classes.prodset_textarea)}
									rows="1"
									id="textarea1"
									maxLength="3"
									style={{ padding: '0px', width: '40px' }}
									value={this.state.unitTime}
									onChange={(e) => this.payChange('unitTime', e.target.value)}
								/>
								<span>분 마다</span>
								<input
									type="text"
									className={classNames('form-control', classes.prodset_textarea)}
									rows="1"
									id="textarea1"
									maxLength="7"
									style={{ padding: '0px', width: '50px' }}
									value={this.state.unitPrice}
									onChange={(e) => this.payChange('unitPrice', e.target.value)}
								/>
								<span>원</span>
							</div>
							<div className={'col-md-2'} style={{ fontSize: '12px' }}>
								1회권+실시간 최대
								<input
									type="number"
									className={classNames('form-control', classes.prodset_textarea)}
									rows="1"
									id="textarea1"
									style={{ padding: '0px', width: '40px', marginLeft: '6px', marginRight: '6px' }}
									min="0"
									max="999"
									value={this.state.maxDeskTimeProduct}
									onChange={(e) => this.handleFormFieldChange('maxDeskTimeProduct', e.target.value)}
								/>
								석
							</div>
							<div className={'col-md-2'}>
								지정석 최대
								<input
									type="number"
									className={classNames('form-control', classes.prodset_textarea)}
									rows="1"
									id="textarea1"
									style={{ padding: '0px', width: '40px', marginLeft: '6px', marginRight: '6px' }}
									min="0"
									max="999"
									value={this.state.maxDeskDayProduct}
									onChange={(e) => this.handleFormFieldChange('maxDeskDayProduct', e.target.value)}
								/>
								석
							</div>
							<div className={'col-md-2'}>
								자유석 최대
								<input
									type="number"
									className={classNames('form-control', classes.prodset_textarea)}
									rows="1"
									id="textarea1"
									style={{ padding: '0px', width: '40px', marginLeft: '6px', marginRight: '6px' }}
									min="0"
									max="999"
									value={this.state.maxDeskFreeProduct}
									onChange={(e) => this.handleFormFieldChange('maxDeskFreeProduct', e.target.value)}
								/>
								개
							</div>
							<div className={'col-md-2'}>
								충전권 최대
								<input
									type="number"
									className={classNames('form-control', classes.prodset_textarea)}
									rows="1"
									id="textarea1"
									style={{ padding: '0px', width: '40px', marginLeft: '6px', marginRight: '6px' }}
									min="0"
									max="999"
									value={this.state.maxDeskCharProduct}
									onChange={(e) => this.handleFormFieldChange('maxDeskCharProduct', e.target.value)}
								/>
								개
							</div>
						</div>
						<div className={'row col-md-12'} style={{ verticalAlign: 'middle', paddingLeft: '30px', marginTop: '10px' }}>
							<input
								type="checkbox"
								checked={this.state.useRealtimeProduct}
								onChange={(e) => this.checkdChange('useRealtimeProduct', e.target.checked)}
								style={{ width: '20px', height: '20px', verticalAlign: 'bottom' }}
							/>
							실시간 요금제 사용
						</div>
					</Grid>

					<Grid
						key={2}
						item
						xs={12}
						sm={12}
						md={12}
						className={classNames(classes.portalWidget)}
						style={{ height: '70%', display: 'table', width: '100%', minWidth: '1200px' }}
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
								hover
								className={'study_place_bs'}
							>
								<TableHeaderColumn dataField="seq" isKey={true} hidden={true} dataAlign="center">
									Seq
								</TableHeaderColumn>
								<TableHeaderColumn dataField="order" width="80px" dataFormat={this.orderFormat} dataAlign="center">
									순서
								</TableHeaderColumn>
								<TableHeaderColumn dataField="deskType" width="80px" dataFormat={this.deskFormat} dataAlign="center">
									좌석타입
								</TableHeaderColumn>
								<TableHeaderColumn dataField="timeType" width="110px" dataFormat={this.typeFormat} dataAlign="center">
									종류
								</TableHeaderColumn>
								<TableHeaderColumn dataField="day" width="80px" dataFormat={this.dayFormat} dataAlign="center">
									기간
								</TableHeaderColumn>
								<TableHeaderColumn dataField="time" width="80px" dataFormat={this.timeFormat} dataAlign="center">
									시간
								</TableHeaderColumn>
								<TableHeaderColumn dataField="title" width="260px" dataAlign="center">
									상품명
								</TableHeaderColumn>
								<TableHeaderColumn dataField="subtitle" width="260px" dataAlign="center">
									설명
								</TableHeaderColumn>
								<TableHeaderColumn dataField="price" width="100px" dataFormat={this.payFormat} dataAlign="center">
									금액
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="isAppPublic"
									width="80px"
									dataFormat={(cell) => <div>{cell ? '앱 노출' : '관리전용'}</div>}
									dataAlign="center"
								>
									공개타입
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="isExtend"
									width="80px"
									dataFormat={(cell) => <div>{cell ? '연장전용' : ''}</div>}
									dataAlign="center"
								>
									연장용
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="button"
									width="100px"
									dataAlign="center"
									dataFormat={this.cellButton.bind(this)}
								></TableHeaderColumn>
							</BootstrapTable>

							<table id="prod_table" style={{ marginTop: '20px' }}>
								<colgroup>
									<col width="80px" />
									<col width="80px" />
									<col width="110px" />
									<col width="80px" />
									<col width="80px" />
									<col width="260px" />
									<col width="260px" />
									<col width="100px" />
									<col width="80px" />
									<col width="80px" />
									<col width="100px" />
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
											<TextField
												select
												style={{ width: '90%' }}
												className={classes.prod_textfield}
												margin="normal"
												type="text"
												value={this.state.add_deskType}
												onChange={(e) => this.handleFormFieldChange('add_deskType', e.target.value)}
											>
												{typeData.map((option) => (
													<MenuItem key={option.value} value={option.value}>
														{option.label}
													</MenuItem>
												))}
											</TextField>
										</td>
										<td className={classes.bg_td}>
											<TextField
												select
												style={{ width: '90%' }}
												className={classes.prod_textfield}
												margin="normal"
												type="text"
												value={this.state.add_timeType}
												onChange={(e) => this.handleFormFieldChange('add_timeType', e.target.value)}
											>
												{kindData.map((option) => (
													<MenuItem key={option.value} value={option.value}>
														{option.label}
													</MenuItem>
												))}
											</TextField>
										</td>
										<td className={classes.bg_td}>
											<input
												type="number"
												style={{ width: '90%' }}
												className={classNames('form-control', classes.prodset_textarea)}
												rows="1"
												maxLength="3"
												min="1"
												max="999"
												id="add_day_input"
												value={this.state.add_day}
												placeholder="기간"
												onChange={(e) => this.handleChange('add_day', e.target.value)}
												disabled={this.state.add_timeType === 'time' || this.state.add_timeType === 'char'}
											/>
										</td>
										<td className={classes.bg_td}>
											<input
												type="number"
												style={{ width: '90%' }}
												className={classNames('form-control', classes.prodset_textarea)}
												rows="1"
												maxLength="3"
												min="1"
												max="999"
												id="add_time_input"
												value={this.state.add_time}
												placeholder="시간"
												onChange={(e) => this.handleChange('add_time', e.target.value)}
												disabled={this.state.add_timeType === 'day'}
											/>
										</td>
										<td className={classes.bg_td}>
											<input
												type="text"
												className={classNames('form-control', classes.prodset_textarea)}
												rows="1"
												maxLength="14"
												id="textarea1"
												style={{ padding: '0px' }}
												value={this.state.add_title}
												placeholder="상품명"
												onChange={(e) => this.handleFormFieldChange('add_title', e.target.value)}
											/>
										</td>
										<td className={classes.bg_td}>
											<input
												type="text"
												className={classNames('form-control', classes.prodset_textarea)}
												rows="1"
												maxLength="14"
												id="textarea2"
												style={{ padding: '0px' }}
												value={this.state.add_subtitle}
												placeholder="설명"
												onChange={(e) => this.handleFormFieldChange('add_subtitle', e.target.value)}
											/>
										</td>
										<td className={classes.bg_td}>
											<input
												type="text"
												className={classNames('form-control', classes.prodset_textarea)}
												rows="1"
												maxLength="8"
												min="0"
												max="9999999"
												id="textarea3"
												value={this.state.add_price}
												placeholder="0원"
												onChange={(e) => this.payChange('add_price', e.target.value)}
											/>
										</td>
										<td className={classes.bg_td}>
											{/* <input
												type="checkbox"
												name="add_isAppPublic"
												checked={!this.state.add_isAppPublic}
												style={{ marginTop: '8px', width: '20px', height: '20px' }}
												onChange={this.handleChecked}
											/>
											<label style={{ marginBottom: '12px', marginLeft: '4px' }} for="add_isAppPublic">
												관리용
											</label> */}
											<FormControlLabel
												style={{ margin: '0px' }}
												control={
													<Checkbox
														style={{ width: '20px' }}
														name="add_isAppPublic"
														checked={!this.state.add_isAppPublic}
														onChange={this.handleChecked}
													/>
												}
												label={'관리용'}
											/>
										</td>
										<td className={classes.bg_td}>
											{/* <input
												type="checkbox"
												name="add_isExtend"
												checked={this.state.add_isExtend}
												style={{ marginTop: '8px', width: '20px', height: '20px' }}
												onChange={this.handleChecked}
											/>
											<label style={{ marginBottom: '12px', marginLeft: '4px' }} for="add_isExtend">
												연장용
											</label> */}
											<FormControlLabel
												style={{ margin: '0px' }}
												control={
													<Checkbox
														style={{ width: '20px' }}
														name="add_isExtend"
														checked={this.state.add_isExtend}
														onChange={this.handleChecked}
													/>
												}
												label={'연장용'}
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
								onClick={this.priceSave}
								disabled={this.state.saveStatus === true}
							>
								저장
							</Button>
							{permission >= 9 && (
								<Button
									variant="contained"
									size="medium"
									color="primary"
									style={{ float: 'right', color: 'white' }}
									onClick={this.onAddTemplate}
								>
									템플릿 세팅
								</Button>
							)}
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

SProdSetting.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(SProdSetting)
