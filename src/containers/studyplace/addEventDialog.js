import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import PostSelectDialog from './postSelectDialog'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { InsertButton } from 'react-bootstrap-table'
import axios from '../../wrapper/axios'

import KakaoMap from './kakao-map/kakao-map'
/* global kakao */

import bankSWIFT from './data/bankcode.json'
import kindData from './data/kindData.json'

import scss from './studyplace.module.scss'
import MobileDetect from 'mobile-detect'

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	}
})

const md = new MobileDetect(window.navigator.userAgent)

class addEventDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,
			postisOpen: false,
			roadAddressData: null,
			activeMarker: null,
			marker: [],
			defaultZoom: 5,
			location: '',
			description: '',
			start: '',
			end: '',
			id: '',

			name: '', //공간명
			placeType: 'auto', //종류
			operatingTime: '', //운영시간
			phone: '', //전화번호
			kakaoId: '', //플러스 친구 ID

			postcode: '', //우편번호
			state: '',
			city: '',
			addr1: '',
			roadAddress: '', //주소
			addr2: '', //상세주소

			longitude: '',
			latitude: '',
			managerNm: '', //관리자 성함
			managerNum: '', //관리자 연락처
			managerId: '', //관리자 ID
			managerPW: '', //관리자 비밀번호
			managerEmail: '', //관리자 이메일

			option1: true,
			option2: true,
			option3: true,
			option4: true,
			option5: true,
			option6: true,
			option7: true,
			option8: true,
			option9: true,
			option10: true,
			option11: false,
			option12: false,
			service1: true,
			service2: true,
			service3: true,
			service4: true
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		this.init()
	}

	init = () => {
		this.setState({
			name: '',
			placeType: 'auto',
			operatingTime: '',
			phone: '',
			kakaoId: '',

			postcode: '',
			state: '',
			city: '',
			addr1: '',
			roadAddress: '',
			addr2: '',

			longitude: '',
			latitude: '',
			managerNm: '',
			managerNum: '',
			managerId: '',
			managerPW: '',
			managerEmail: '',

			option1: false,
			option2: false,
			option3: false,
			option4: false,
			option5: false,
			option6: false,
			option7: false,
			option8: false,
			option9: false,
			option10: false,
			option11: false,
			option12: false,
			service1: false,
			service2: false,
			service3: false,
			service4: false
		})
	}

	closeDialogReweighing = () => {
		this.init()
		this.setState({ stateDialogReweighing: false, marker: [] })
		this.customDialog.handleClose()
	}

	//Dialog Close Event
	closeEvent = data => {
		this.setState({ postisOpen: false })
		if (!data) return
		const roadAddress = data['roadAddress'].split(' ')
		const city = roadAddress[0]
		const state = roadAddress[1]
		const addr1 = roadAddress[2] + ' ' + roadAddress[3]
		this.setState({
			roadAddressData: data,
			postcode: data['zonecode'],
			city: city,
			state: state,
			addr1: addr1,
			roadAddress: city + ' ' + state + ' ' + addr1
		})
		this.callGeocode(data['roadAddress'])
	}

	callGeocode = async data => {
		try {
			let geocoder = new kakao.maps.services.Geocoder()
			const vm = this
			await geocoder.addressSearch(data, function(result, status) {
				if (status === kakao.maps.services.Status.OK) {
					let marker = [{ name: data, lat: result[0].y, lng: result[0].x }]
					vm.setState({ marker, activeMarker: marker[0], defaultZoom: 5, latitude: result[0].y, longitude: result[0].x })
				}
			})
		} catch (error) {
			console.error(error)
		}
	}

	//취소
	handleCancel = () => {
		this.props.onClose(null)
	}

	//등록
	handleSend = () => {
		let data = {
			name: this.state.name,
			placeType: this.state.placeType,
			operatingTime: this.state.operatingTime,
			phone: this.state.phone,
			kakaoId: this.state.kakaoId,

			postcode: this.state.postcode,
			state: this.state.state,
			city: this.state.city,
			addr1: this.state.addr1,
			addr2: this.state.addr2,

			longitude: this.state.longitude,
			latitude: this.state.latitude,
			managerNm: this.state.managerNm,
			managerNum: this.state.managerNum,
			managerId: this.state.managerId,
			managerPW: this.state.managerPW,
			managerEmail: this.state.managerEmail,

			option1: this.state.option1,
			option2: this.state.option2,
			option3: this.state.option3,
			option4: this.state.option4,
			option5: this.state.option5,
			option6: this.state.option6,
			option7: this.state.option7,
			option8: this.state.option8,
			option9: this.state.option9,
			option10: this.state.option10,
			option11: this.state.option11,
			option12: this.state.option12,
			service1: this.state.service1,
			service2: this.state.service2,
			service3: this.state.service3,
			service4: this.state.service4
		}
		axios
			.post('/place', {
				data
			})
			.then(res => {
				if (res.data && res.data.result === 'success') {
					this.props.onClose({ flag: 'success', message: '저장되었습니다.' })
					this.closeDialogReweighing()
				} else {
					this.props.onClose({ flag: 'fail', message: res.data.message })
				}
			})
			.catch(error => {
				this.props.onClose({ flag: 'error', message: String(error.message) })
				console.error(error)
			})
		// this.props.onClose(this.state);
	}

	//기본
	handleFormFieldChange = (prop, value) => {
		this.setState({ [prop]: value })
	}

	//기본
	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
	}

	//옵션&서비스 체크박스
	checkedChange = name => event => {
		this.setState({ [name]: event.target.checked })
	}

	//우편번호 검색
	selectPost = onClick => {
		if (this.state.postisOpen) {
			this.setState({ postisOpen: false })
		} else {
			this.setState({ postisOpen: true })
		}
	}

	onMarkerClick = marker => () => {
		this.setState({ activeMarker: marker })
	}

	mobilePage = () => {
		const { classes } = this.props
		return (
			<div className={'row'} style={{ width: '240px', margin: '0px' }}>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						공간명
					</span>
					<TextField
						className={'col-md-4'}
						autoFocus
						placeholder="공간 이름을 입력해주세요"
						margin="normal"
						id="name"
						type="text"
						value={this.state.name == null ? '' : this.state.name}
						onChange={e => this.handleFormFieldChange('name', e.target.value)}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						종류
					</span>
					<TextField
						className={'col-md-2 select_kind'}
						id="select-currency-native"
						select
						value={this.state.placeType == null ? 'auto' : this.state.placeType}
						onChange={this.handleChange('placeType')}
						SelectProps={{
							native: true,
							MenuProps: {
								className: classes.menu
							}
						}}
						margin="normal"
					>
						{kindData.map(option => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</TextField>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						운영시간
					</span>
					<TextField
						placeholder="ex) 0시~24시 / 연중무휴"
						style={{ width: '160px' }}
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.operatingTime == null ? '' : this.state.operatingTime}
						onChange={e => this.handleFormFieldChange('operatingTime', e.target.value)}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						전화번호
					</span>
					<TextField
						placeholder="02-1234-5678"
						style={{ width: '130px' }}
						className={'col-md-1 tf_phoneNum'}
						margin="normal"
						type="tel"
						value={this.state.phone == null ? '' : this.state.phone}
						onChange={e => this.handleFormFieldChange('phone', e.target.value)}
					/>
				</div>
				<div className={'row'}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '120px'
						}}
					>
						카카오톡채널
					</span>
					<TextField
						placeholder="예) _abcdefg"
						style={{ width: '100px' }}
						className={'col-md-1 tf_phoneNum'}
						margin="normal"
						type="text"
						value={this.state.kakaoId == null ? '' : this.state.kakaoId}
						onChange={e => this.handleFormFieldChange('kakaoId', e.target.value)}
					/>
				</div>

				<div className={'row'} style={{ height: '202px', textAlign: '-webkit-center' }}>
					<div className={scss['portal-map-page-wrapper']}>
						{/* <Map
							markers={this.state.marker}
							activeMarker={this.state.activeMarker}
							onMarkerClick={this.onMarkerClick}
							defaultZoom={this.state.defaultZoom}
						/> */}
						<KakaoMap marker={this.state.marker} defaultZoom={this.state.defaultZoom} />
					</div>
				</div>
				<div className={'row'}>
					<TextField
						placeholder="37.478073"
						className={'col-xs-6'}
						margin="normal"
						type="text"
						value={this.state.latitude}
						onChange={e => this.handleFormFieldChange('latitude', e.target.value)}
					/>
					<TextField
						placeholder="126.9610488"
						className={'col-xs-6'}
						margin="normal"
						type="text"
						value={this.state.longitude}
						onChange={e => this.handleFormFieldChange('longitude', e.target.value)}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						주소
					</span>
					<TextField
						disabled
						placeholder=""
						style={{ width: '100px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.postcode == null ? '' : this.state.postcode}
						onChange={e => this.handleFormFieldChange('postcode', e.target.value)}
					/>

					<Button
						variant="outlined"
						className={classNames(scss.post_btn, 'col-md-2')}
						style={{
							width: '80px',
							marginTop: '10px',
							marginLeft: '10px'
						}}
						onClick={() => this.selectPost()}
					>
						우편번호 찾기
					</Button>
				</div>

				<div className={'row'}>
					<TextField
						disabled
						placeholder="주소"
						style={{
							marginLeft: '58px',
							marginTop: '5px',
							width: '79%'
						}}
						className={'col-md-8'}
						margin="normal"
						type="text"
						value={this.state.roadAddress == null ? '' : this.state.roadAddress}
						onChange={e => this.handleFormFieldChange('roadAddress', e.target.value)}
					/>
				</div>

				<div className={'row'}>
					<TextField
						placeholder="상세주소"
						style={{
							marginLeft: '58px',
							marginTop: '5px',
							width: '79%'
						}}
						className={'col-md-8'}
						margin="normal"
						type="text"
						value={this.state.addr2 == null ? '' : this.state.addr2}
						onChange={e => this.handleFormFieldChange('addr2', e.target.value)}
					/>
				</div>

				<div className={'row'}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						관리자명
					</span>
					<TextField
						placeholder=""
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerNm == null ? '' : this.state.managerNm}
						onChange={e => this.handleFormFieldChange('managerNm', e.target.value)}
					/>
				</div>
				<div className={'row'}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						ID
					</span>
					<TextField
						placeholder=""
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerId == null ? '' : this.state.managerId}
						onChange={e => this.handleFormFieldChange('managerId', e.target.value)}
					/>
				</div>
				<div className={'row'}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '120px'
						}}
					>
						비밀번호
					</span>
					<TextField
						// placeholder=""
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="password"
						value={this.state.managerPW == null ? '' : this.state.managerPW}
						placeholder="********"
						onChange={e => this.handleFormFieldChange('managerPW', e.target.value)}
					/>
				</div>

				<div className={'row'}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '120px'
						}}
					>
						연락처
					</span>
					<TextField
						// placeholder=""
						style={{ width: '140px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerNum == null ? '' : this.state.managerNum}
						placeholder="- 없이 숫자만"
						onChange={e => this.handleFormFieldChange('managerNum', e.target.value)}
					/>
				</div>
				<div className={'row'}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						관리이메일
					</span>
					<TextField
						style={{ width: '160px' }}
						className={'col-md-3'}
						margin="normal"
						type="email"
						value={this.state.managerEmail == null ? '' : this.state.managerEmail}
						placeholder="abc@example.com"
						onChange={e => this.handleFormFieldChange('managerEmail', e.target.value)}
					/>
				</div>

				<div id="point" className={'row'} style={{ marginTop: '20px' }}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '120px'
						}}
					>
						특징
					</span>
					<FormGroup row style={{ marginLeft: '14px' }}>
						<FormControlLabel
							control={<Checkbox checked={this.state.option1} onChange={this.checkedChange('option1')} value="option1" />}
							label={'CCTV'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option2} onChange={this.checkedChange('option2')} value="option2" />}
							label={'관리자'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option3} onChange={this.checkedChange('option3')} value="option3" />}
							label={'24시간'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option4} onChange={this.checkedChange('option4')} value="option4" />}
							label={'락커'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option5} onChange={this.checkedChange('option5')} value="option5" />}
							label={'음료'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option6} onChange={this.checkedChange('option6')} value="option6" />}
							label={'휴게실'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option7} onChange={this.checkedChange('option7')} value="option7" />}
							label={'주차시설'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option8} onChange={this.checkedChange('option8')} value="option8" />}
							label={'Wi-fi'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option9} onChange={this.checkedChange('option9')} value="option9" />}
							label={'개인콘센트'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option10} onChange={this.checkedChange('option10')} value="option10" />}
							label={'OA(프린트,복사)'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option11} onChange={this.checkedChange('option11')} value="option11" />}
							label={'현금결제'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option12} onChange={this.checkedChange('option12')} value="option12" />}
							label={'화장실 남/녀 구분'}
						/>
					</FormGroup>
				</div>

				<div id="point" className={'row'} style={{ marginTop: '20px' }}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '120px'
						}}
					>
						서비스
					</span>
					<FormGroup row style={{ marginLeft: '14px' }}>
						<FormControlLabel
							control={<Checkbox checked={this.state.service1} onChange={this.checkedChange('service1')} value="service1" />}
							label={'개인석'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.service2} onChange={this.checkedChange('service2')} value="service2" />}
							label={'스터디룸'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.service3} onChange={this.checkedChange('service3')} value="service3" />}
							label={'락커'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.service4} onChange={this.checkedChange('service4')} value="service4" />}
							label={'카카오톡 알림톡'}
						/>
					</FormGroup>
				</div>
			</div>
		)
	}

	pcPage = () => {
		const { classes } = this.props
		return (
			<div>
				<div className={'row'} style={{ width: '800px' }}>
					<div className={'col-md-8'}>
						<div className={'row'}>
							<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
								공간명
							</span>
							<TextField
								style={{ width: '200px' }}
								className={'col-md-4'}
								autoFocus
								placeholder="공간 이름을 입력해주세요"
								margin="normal"
								id="name"
								type="text"
								value={this.state.name == null ? '' : this.state.name}
								onChange={e => this.handleFormFieldChange('name', e.target.value)}
							/>

							<TextField
								className={'col-md-2 select_kind'}
								id="select-currency-native"
								select
								value={this.state.placeType == null ? 'auto' : this.state.placeType}
								onChange={this.handleChange('placeType')}
								SelectProps={{
									native: true,
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
							>
								{kindData.map(option => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</TextField>
						</div>

						<div className={'row'}>
							<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
								운영시간
							</span>
							<TextField
								placeholder="ex) 0시~24시 / 연중무휴"
								style={{ width: '200px' }}
								className={'col-md-4'}
								margin="normal"
								type="text"
								value={this.state.operatingTime == null ? '' : this.state.operatingTime}
								onChange={e => this.handleFormFieldChange('operatingTime', e.target.value)}
							/>
							<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
								전화번호
							</span>
							<TextField
								placeholder="02-1234-5678"
								style={{ width: '130px' }}
								className={'col-md-1 tf_phoneNum'}
								margin="normal"
								type="text"
								value={this.state.phone == null ? '' : this.state.phone}
								onChange={e => this.handleFormFieldChange('phone', e.target.value)}
							/>
						</div>

						<div className={'row'}>
							<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
								주소
							</span>
							<TextField
								disabled
								placeholder=""
								style={{ width: '100px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								value={this.state.postcode == null ? '' : this.state.postcode}
								onChange={e => this.handleFormFieldChange('postcode', e.target.value)}
							/>

							<Button
								variant="outlined"
								className={classNames(scss.post_btn, 'col-md-2')}
								style={{
									width: '80px',
									marginTop: '10px',
									marginLeft: '10px'
								}}
								onClick={() => this.selectPost()}
							>
								우편번호 찾기
							</Button>

							<span
								className={'col-md-2'}
								style={{
									textAlign: 'right',
									marginTop: '20px',
									width: '120px'
								}}
							>
								카카오톡채널
							</span>
							<TextField
								placeholder="예) _abcdefg"
								style={{ width: '100px' }}
								className={'col-md-1 tf_phoneNum'}
								margin="normal"
								type="text"
								value={this.state.kakaoId == null ? '' : this.state.kakaoId}
								onChange={e => this.handleFormFieldChange('kakaoId', e.target.value)}
							/>
						</div>

						<div className={'row'}>
							<TextField
								disabled
								placeholder="주소"
								style={{
									marginLeft: '88px',
									marginTop: '5px',
									width: '79%'
								}}
								className={'col-md-8'}
								margin="normal"
								type="text"
								value={this.state.roadAddress == null ? '' : this.state.roadAddress}
								onChange={e => this.handleFormFieldChange('roadAddress', e.target.value)}
							/>
						</div>

						<div className={'row'}>
							<TextField
								placeholder="상세주소"
								style={{
									marginLeft: '88px',
									marginTop: '5px',
									width: '79%'
								}}
								className={'col-md-8'}
								margin="normal"
								type="text"
								value={this.state.addr2 == null ? '' : this.state.addr2}
								onChange={e => this.handleFormFieldChange('addr2', e.target.value)}
							/>
						</div>
					</div>

					<div className={'col-md-4'} style={{ height: '250px' }}>
						<div className={scss['portal-map-page-wrapper']}>
							{/* <Map
								markers={this.state.marker}
								activeMarker={this.state.activeMarker}
								onMarkerClick={this.onMarkerClick}
								defaultZoom={this.state.defaultZoom}
							/> */}
							<KakaoMap marker={this.state.marker} defaultZoom={this.state.defaultZoom} />
						</div>
						<div className={'row'}>
							<TextField
								placeholder="37.478073"
								className={'col-md-6'}
								margin="normal"
								type="text"
								value={this.state.latitude}
								onChange={e => this.handleFormFieldChange('latitude', e.target.value)}
							/>
							<TextField
								placeholder="126.9610488"
								className={'col-md-6'}
								margin="normal"
								type="text"
								value={this.state.longitude}
								onChange={e => this.handleFormFieldChange('longitude', e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className={'row'} style={{ width: '800px' }}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						관리자명
					</span>
					<TextField
						placeholder=""
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerNm == null ? '' : this.state.managerNm}
						onChange={e => this.handleFormFieldChange('managerNm', e.target.value)}
					/>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						ID
					</span>
					<TextField
						placeholder=""
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerId == null ? '' : this.state.managerId}
						onChange={e => this.handleFormFieldChange('managerId', e.target.value)}
					/>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px',
							paddingLeft: '0px'
						}}
					>
						비밀번호
					</span>
					<TextField
						// placeholder=""
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="password"
						value={this.state.managerPW == null ? '' : this.state.managerPW}
						placeholder="********"
						onChange={e => this.handleFormFieldChange('managerPW', e.target.value)}
					/>
				</div>

				<div className={'row'} style={{ width: '800px' }}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						연락처
					</span>
					<TextField
						// placeholder=""
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerNum == null ? '' : this.state.managerNum}
						placeholder="- 없이 숫자만"
						onChange={e => this.handleFormFieldChange('managerNum', e.target.value)}
					/>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						관리이메일
					</span>
					<TextField
						style={{ width: '160px' }}
						className={'col-md-3'}
						margin="normal"
						type="email"
						value={this.state.managerEmail == null ? '' : this.state.managerEmail}
						placeholder="abc@example.com"
						onChange={e => this.handleFormFieldChange('managerEmail', e.target.value)}
					/>
				</div>

				<div id="point" className={'row'} style={{ width: '800px', marginTop: '10px' }}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '15px',
							width: '103px'
						}}
					>
						특징
					</span>
					<FormGroup row>
						<FormControlLabel
							control={<Checkbox checked={this.state.option1} onChange={this.checkedChange('option1')} value="option1" />}
							label={'CCTV'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option2} onChange={this.checkedChange('option2')} value="option2" />}
							label={'관리자'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option3} onChange={this.checkedChange('option3')} value="option3" />}
							label={'24시간'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option4} onChange={this.checkedChange('option4')} value="option4" />}
							label={'락커'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option5} onChange={this.checkedChange('option5')} value="option5" />}
							label={'음료'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option6} onChange={this.checkedChange('option6')} value="option6" />}
							label={'휴게실'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option7} onChange={this.checkedChange('option7')} value="option7" />}
							label={'주차시설'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option8} onChange={this.checkedChange('option8')} value="option8" />}
							label={'Wi-fi'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option9} onChange={this.checkedChange('option9')} value="option9" />}
							label={'개인콘센트'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option10} onChange={this.checkedChange('option10')} value="option10" />}
							label={'OA(프린트,복사)'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option11} onChange={this.checkedChange('option11')} value="option11" />}
							label={'현금결제'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.option12} onChange={this.checkedChange('option12')} value="option12" />}
							label={'화장실 남/녀 구분'}
						/>
					</FormGroup>
				</div>

				<div className={'row'} style={{ width: '800px' }}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '15px',
							width: '103px'
						}}
					>
						서비스
					</span>
					<FormGroup row>
						<FormControlLabel
							control={<Checkbox checked={this.state.service1} onChange={this.checkedChange('service1')} value="service1" />}
							label={'개인석'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.service2} onChange={this.checkedChange('service2')} value="service2" />}
							label={'스터디룸'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.service3} onChange={this.checkedChange('service3')} value="service3" />}
							label={'락커'}
						/>
						<FormControlLabel
							control={<Checkbox checked={this.state.service4} onChange={this.checkedChange('service4')} value="service4" />}
							label={'카카오톡 알림톡'}
						/>
					</FormGroup>
				</div>
			</div>
		)
	}

	renderPage = () => {
		return md.mobile() ? this.mobilePage() : this.pcPage()
	}

	render() {
		const { classes } = this.props
		return (
			<div>
				<PostSelectDialog open={this.state.postisOpen} title={'우편번호 검색'} onClose={this.closeEvent} />

				<CustomDialog
					title={'스터디공간 신규등록'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton btnText="신규등록" btnContextual="btn-warning" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent>{this.renderPage()}</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="secondary">
							취소
						</Button>
						<Button variant="outlined" onClick={this.handleSend} color="primary" autoFocus>
							등록
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(addEventDialog)
