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
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Checkbox from '@material-ui/core/Checkbox'
import { InsertButton } from 'react-bootstrap-table'
import axios from '../../wrapper/axios'
import kindData from './data/kindData.json'
import scss from './studyplace.module.scss'
import MobileDetect from 'mobile-detect'
import KakaoMap from './kakao-map/kakao-map'
/* global kakao */

const styles = (theme) => ({
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

const makePlainData = (context) => {
	const handler = {
		get: function (target, name) {
			return Object.prototype.hasOwnProperty.call(target, name) ? target[name] : ''
		}
	}
	const _ = new Proxy(context, handler)

	return {
		seq: _.seq,
		key: _.key,
		name: _.name, //공간명
		placeType: _.placeType, //종류
		operatingTime: _.operatingTime, // 운영시간
		phone: _.phone, //전화번호
		kakaoId: _.kakaoId, //플러스 친구ID

		postcode: _.postcode, // 우편번호
		city: _.city,
		state: _.state,
		addr1: _.addr1,
		roadAddress: _.city && _.state && _.addr1 ? _.city + ' ' + _.state + ' ' + _.addr1 : '',
		addr2: _.addr2,

		longitude: _.longitude,
		latitude: _.latitude,
		managerSeq: _.managerSeq, //관리자 SEQ
		managerNm: _.managerNm, //관리자성함
		ceoName: _.ceoName, //대표자명
		bizRegNum: _.bizRegNum, //사업자등록번호
		bizEmail: _.bizEmail, //사업자이메일
		managerNum: _.managerNum, //관리자 연락처
		bankCode: _.bankCode, //은행코드
		depositor: _.depositor, //예금주명
		accountNum: _.accountNum, //계좌번호
		managerId: _.managerId, //관리자ID
		managerPW: _.managerPW, //관리자 비밀번호
		managerEmail: _.managerEmail, //관리자 이메일

		option1: _.option1 ? true : false,
		option2: _.option2 ? true : false,
		option3: _.option3 ? true : false,
		option4: _.option4 ? true : false,
		option5: _.option5 ? true : false,
		option6: _.option6 ? true : false,
		option7: _.option7 ? true : false,
		option8: _.option8 ? true : false,
		option9: _.option9 ? true : false,
		option10: _.option10 ? true : false,
		option11: _.option11 ? true : false,
		option12: _.option12 ? true : false,
		service1: _.service1 ? true : false,
		service2: _.service2 ? true : false,
		service3: _.service3 ? true : false,
		service4: _.service4 ? true : false,
		isPublic: _.isPublic ? true : false,
		isOpen: _.isOpen ? true : false,
		isService: _.isService ? true : false
	}
}
class cafeEditDialog extends React.Component {
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
			isService: false,
			...makePlainData({})
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true, ...makePlainData({}) })
		setTimeout(() => {
			this.loadValue()
		}, 200)
	}

	loadValue = async () => {
		try {
			const res = await axios.get(`/place/${this.props.placeSeq}`, {
				headers: { 'Content-type': 'application/json' }
			})
			const { data } = res
			if (data) {
				this.setState(makePlainData(data))

				if (data.latitude !== null && data.latitude.length > 0 && data.longitude !== null && data.longitude.length > 0) {
					let marker = [
						{
							name: data.city + ' ' + data.state + ' ' + data.addr1,
							lat: parseFloat(data.latitude),
							lng: parseFloat(data.longitude)
						}
					]
					this.setState({ marker: marker, activeMarker: marker[0], defaultZoom: 5 })
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, marker: [] })
		this.customDialog.handleClose()
	}

	//Dialog Close Event
	closeEvent = (data) => {
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

	callGeocode = async (GeocodeName) => {
		try {
			let geocoder = new kakao.maps.services.Geocoder()
			const vm = this
			await geocoder.addressSearch(GeocodeName, function (result, status) {
				if (status === kakao.maps.services.Status.OK) {
					let marker = [{ name: GeocodeName, lat: result[0].y, lng: result[0].x }]
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

	//저장
	handleSend = async () => {
		try {
			const params = makePlainData(this.state)
			const res = await axios.post('/place/' + this.state.seq, params)
			if (res.data.result === 'success') {
				this.props.onClose({ flag: 'success', message: '저장되었습니다.' })
				this.closeDialogReweighing()
			} else {
				this.props.onClose({ flag: 'fail', message: res.data.message })
			}
		} catch (error) {
			this.props.onClose({ flag: 'error', message: String(error.message) })
			console.error(error)
		}
	}

	//삭제
	onDelete = () => {
		this.props.onClose({ flag: 'delete' })
		this.closeDialogReweighing()
	}

	//기본
	handleChange = (name) => (event) => {
		if (event.target) {
			let val = event.target.value
			if (val === 'true') val = true
			else if (val === 'false') val = false
			this.setState({ [name]: val })
		}
	}

	//은행 변경
	handleBankChange = (event) => {
		this.setState({ bankCode: event.target.value })
	}

	//옵션&서비스 체크박스
	checkedChange = (name) => (event) => {
		this.setState({ [name]: event.target.checked })
	}

	//금액
	amountChange = async (event) => {
		const { value } = event.target
		const re = /^[0-9\,]+$/
		if (value === '' || re.test(value)) {
			const feeFixedAmount = value
				.replace(/,/gi, '')
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			console.log(this.state.feeFixedAmount)
			this.setState({ feeFixedAmount })
		}
	}

	//우편번호 검색
	selectPost = () => {
		if (this.state.postisOpen) {
			this.setState({ postisOpen: false })
		} else {
			this.setState({ postisOpen: true })
		}
	}

	onMarkerClick = (marker) => () => {
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
						onChange={this.handleChange('name')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						종류
					</span>
					<TextField
						className="col-md-2 select_kind"
						id="select-currency-native"
						select
						value={this.state.placeType || 'auto'}
						onChange={this.handleChange('placeType')}
						SelectProps={{
							native: true,
							MenuProps: {
								className: classes.menu
							}
						}}
						margin="normal"
					>
						{kindData.map((option) => (
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
						onChange={this.handleChange('operatingTime')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						전화번호
					</span>
					<TextField
						placeholder="0212345678"
						style={{ width: '130px' }}
						className="col-md-1 tf_phoneNum"
						margin="normal"
						type="tel"
						value={this.state.phone == null ? '' : this.state.phone}
						onChange={this.handleChange('phone')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						카카오톡채널
					</span>
					<TextField
						placeholder="채널ID (예:_abcdefg)"
						style={{ width: '100px' }}
						className="col-md-1 tf_phoneNum"
						margin="normal"
						type="text"
						value={this.state.kakaoId == null ? '' : this.state.kakaoId}
						onChange={this.handleChange('kakaoId')}
					/>
				</div>
				<div className={'row'} style={{ height: '202px', textAlign: '-webkit-center' }}>
					<div className={scss['portal-map-page-wrapper']}>
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
						onChange={this.handleChange('latitude')}
					/>
					<TextField
						placeholder="126.9610488"
						className={'col-xs-6'}
						margin="normal"
						type="text"
						value={this.state.longitude}
						onChange={this.handleChange('longitude')}
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
						value={this.state.postcode ? this.state.postcode : ''}
						onChange={this.handleChange('postcode')}
					/>
					<Button
						variant="outlined"
						className={classNames(scss.post_btn, 'col-md-2')}
						style={{ width: '80px', marginTop: '10px', marginLeft: '10px' }}
						onClick={() => this.selectPost()}
					>
						우편번호 찾기
					</Button>
				</div>
				<div className={'row'}>
					<TextField
						disabled
						placeholder="주소"
						style={{ marginLeft: '58px', marginTop: '5px', width: '79%' }}
						className={'col-md-8'}
						margin="normal"
						type="text"
						value={this.state.roadAddress ? this.state.roadAddress : ''}
						onChange={this.handleChange('roadAddress')}
					/>
				</div>
				<div className={'row'}>
					<TextField
						placeholder="상세주소"
						style={{ marginLeft: '58px', marginTop: '5px', width: '79%' }}
						className={'col-md-8'}
						margin="normal"
						type="text"
						value={this.state.addr2 == null ? '' : this.state.addr2}
						onChange={this.handleChange('addr2')}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						관리자명
					</span>
					<TextField type="hidden" name="managerSeq" value={this.state.managerSeq} onChange={this.handleChange('managerSeq')} />
					<TextField
						placeholder=""
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerNm == null ? '' : this.state.managerNm}
						onChange={this.handleChange('managerNm')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						ID
					</span>
					<TextField
						placeholder=""
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerId == null ? '' : this.state.managerId}
						onChange={this.handleChange('managerId')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						비밀번호
					</span>
					<TextField
						placeholder=""
						style={{ width: '150px' }}
						className={'col-md-2'}
						margin="normal"
						type="password"
						value={this.state.managerPW == null ? '' : this.state.managerPW}
						onChange={this.handleChange('managerPW')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						연락처
					</span>
					<TextField
						placeholder="- 없이 숫자만"
						style={{ width: '140px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.managerNum == null ? '' : this.state.managerNum}
						onChange={this.handleChange('managerNum')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						관리이메일
					</span>
					<TextField
						placeholder="abc@example.com"
						style={{ width: '140px' }}
						className={'col-md-2'}
						margin="normal"
						type="email"
						value={this.state.managerEmail == null ? '' : this.state.managerEmail}
						onChange={this.handleChange('managerEmail')}
					/>
				</div>

				<div id="point" className={'row'} style={{ marginTop: '20px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
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
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
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
							label={'카카오 알림톡'}
						/>
					</FormGroup>
				</div>

				<div className={'row'} style={{ marginTop: '20px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						상태
					</span>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						className={'col-md-4'}
						row={true}
						value={this.state.isPublic}
						onChange={this.handleChange('isPublic')}
					>
						<FormControlLabel value={true} control={<Radio />} label="공개" />
						<FormControlLabel value={false} control={<Radio />} label="비공개" />
					</RadioGroup>
				</div>
				<div className={'row'} style={{ marginTop: '20px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						오픈
					</span>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						className={'col-md-4'}
						row={true}
						value={this.state.isOpen}
						onChange={this.handleChange('isOpen')}
					>
						<FormControlLabel value={true} control={<Radio />} label="오픈" />
						<FormControlLabel value={false} control={<Radio />} label="비오픈" />
					</RadioGroup>
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
								onChange={this.handleChange('name')}
							/>

							<TextField
								className="col-md-2 select_kind"
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
								{kindData.map((option) => (
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
								onChange={this.handleChange('operatingTime')}
							/>
							<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
								전화번호
							</span>
							<TextField
								placeholder="0212345678"
								style={{ width: '130px' }}
								className="col-md-1 tf_phoneNum"
								margin="normal"
								type="tel"
								value={this.state.phone == null ? '' : this.state.phone}
								onChange={this.handleChange('phone')}
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
								onChange={this.handleChange('postcode')}
							/>

							<Button
								variant="outlined"
								className={classNames(scss.post_btn, 'col-md-2')}
								style={{ width: '80px', marginTop: '10px', marginLeft: '10px' }}
								onClick={() => this.selectPost()}
							>
								우편번호 찾기
							</Button>

							<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
								카카오톡채널
							</span>
							<TextField
								placeholder="예) _abcdefg"
								style={{ width: '100px' }}
								className="col-md-1 tf_phoneNum"
								margin="normal"
								type="text"
								value={this.state.kakaoId == null ? '' : this.state.kakaoId}
								onChange={this.handleChange('kakaoId')}
							/>
						</div>

						<div className={'row'}>
							<TextField
								disabled
								placeholder="주소"
								style={{ marginLeft: '88px', marginTop: '5px', width: '79%' }}
								className={'col-md-8'}
								margin="normal"
								type="text"
								value={this.state.roadAddress ? this.state.roadAddress : ''}
								onChange={this.handleChange('roadAddress')}
							/>
						</div>

						<div className={'row'}>
							<TextField
								placeholder="상세주소"
								style={{ marginLeft: '88px', marginTop: '5px', width: '79%' }}
								className={'col-md-8'}
								margin="normal"
								type="text"
								value={this.state.addr2 == null ? '' : this.state.addr2}
								onChange={this.handleChange('addr2')}
							/>
						</div>
					</div>

					<div className={'col-md-4'} style={{ height: '250px' }}>
						<div className={scss['portal-map-page-wrapper']}>
							<KakaoMap marker={this.state.marker} defaultZoom={this.state.defaultZoom} />
						</div>
						<div className={'row'}>
							<TextField
								placeholder="37.478073"
								className={'col-md-6'}
								margin="normal"
								type="text"
								value={this.state.latitude}
								onChange={this.handleChange('latitude')}
							/>
							<TextField
								placeholder="126.9610488"
								className={'col-md-6'}
								margin="normal"
								type="text"
								value={this.state.longitude}
								onChange={this.handleChange('longitude')}
							/>
						</div>
					</div>
				</div>

				<div className={'row'} style={{ width: '800px' }}>
					<TextField type="hidden" name="managerSeq" value={this.state.managerSeq} onChange={this.handleChange('managerSeq')} />

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
						onChange={this.handleChange('managerNm')}
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
						onChange={this.handleChange('managerId')}
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
						onChange={this.handleChange('managerPW')}
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
						placeholder="010-0000-0000"
						onChange={this.handleChange('managerNum')}
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
						onChange={this.handleChange('managerEmail')}
					/>
				</div>

				<div id="point" className={'row'} style={{ width: '800px', marginTop: '10px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '15px', width: '120px' }}>
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
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '15px', width: '120px' }}>
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
							label={'카카오 알림톡'}
						/>
					</FormGroup>
				</div>

				<div className={'row'} style={{ width: '800px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '15px', width: '120px' }}>
						상태
					</span>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						className={'col-md-4'}
						row={true}
						value={this.state.isPublic}
						onChange={this.handleChange('isPublic')}
					>
						<FormControlLabel value={true} control={<Radio />} label="공개" />
						<FormControlLabel value={false} control={<Radio />} label="비공개" />
					</RadioGroup>

					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '15px', width: '120px' }}>
						오픈
					</span>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						className={'col-md-4'}
						row={true}
						value={this.state.isOpen}
						onChange={this.handleChange('isOpen')}
					>
						<FormControlLabel value={true} control={<Radio />} label="오픈" />
						<FormControlLabel value={false} control={<Radio />} label="비오픈" />
					</RadioGroup>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '15px', width: '120px' }}>
						입점상태
					</span>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						className={'col-md-4'}
						row={true}
						value={this.state.isService}
						onChange={this.handleChange('isService')}
					>
						<FormControlLabel value={true} control={<Radio />} label="입점" />
						<FormControlLabel value={false} control={<Radio />} label="미입점" />
					</RadioGroup>
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
					title={'카페정보'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="editDialog_btn" btnText="카페정보" btnContextual="btn-warning" className="hidden_" />}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent>{this.renderPage()}</DialogContent>

					<DialogActions>
						{Number(window.sessionStorage.getItem('manager_permission')) === 9 && (
							<Button
								variant="outlined"
								onClick={this.onDelete}
								color="secondary"
								style={{ float: 'left', marginRight: 'auto' }}
							>
								삭제
							</Button>
						)}
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
							닫기
						</Button>
						{Number(window.sessionStorage.getItem('manager_permission')) === 9 && (
							<Button variant="outlined" onClick={this.handleSend} color="primary" autoFocus>
								저장
							</Button>
						)}
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(cafeEditDialog)
