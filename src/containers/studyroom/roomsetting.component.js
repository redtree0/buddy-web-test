import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withStyles } from '@material-ui/core/styles'
import update from 'react-addons-update'
import axios from '../../wrapper/axios'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import UploadIcon from './images/upload-signature.png'
import RemoveIcon from './images/removeIcon.png'

import styles from './studyroom.theme.style'
import './roomsetting.css'
import withNavigation from 'components/withNavigation'

let hasChanges = false
class Roomsetting extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			placeKey: null,
			rooms: [], //스터디룸 Data
			images: [], //이미지 Data
			images_index: null //이미지 Data index 저장용
		}
	}

	/**
	 * 스터디룸 페이지에서 Room 정보 받아와서 세팅
	 */
	componentWillMount() {
		setTimeout(() => {
			const roomsLocalStr = localStorage.getItem('rooms')
			if (!roomsLocalStr) {
				window.location.href = '/room'
				return
			}
			this.setState({ rooms: JSON.parse(roomsLocalStr) })
			this.setState({ placeKey: JSON.parse(localStorage.getItem('manager_place')).key })

			//이미지 데이터 세팅
			for (let i = 0; i < this.state.rooms.length; i++) {
				this.setImageData(i)
			}

			window.onbeforeunload = function () {
				if (hasChanges) return '저장 버튼을 누르지 않으면 반영되지 않습니다.'
			}
		}, 100)
	}

	componentWillUnmount() {
		window.onbeforeunload = () => undefined
		localStorage.removeItem('rooms')
	}
	/**
	 * 이미지 데이터 처리용
	 */
	setImageData = (i) => {
		let images = this.state.images.slice()
		let _images = []
		if (this.state.rooms[i].imgUrl1 !== null) _images.push({ url: this.state.rooms[i].imgUrl1 })
		if (this.state.rooms[i].imgUrl2 !== null) _images.push({ url: this.state.rooms[i].imgUrl2 })
		if (this.state.rooms[i].imgUrl3 !== null) _images.push({ url: this.state.rooms[i].imgUrl3 })
		if (this.state.rooms[i].imgUrl4 !== null) _images.push({ url: this.state.rooms[i].imgUrl4 })
		if (this.state.rooms[i].imgUrl5 !== null) _images.push({ url: this.state.rooms[i].imgUrl5 })
		images.push(_images)
		this.setState({ images: images })
	}

	/**
	 * 저장 버튼 클릭 => 이름, 가격 입력여부 확인
	 */
	onSave = async () => {
		for (let i = 0; i < this.state.rooms.length; i++) {
			if (this.state.rooms[i].name === '' || this.state.rooms[i].name === null) {
				this.alertMessage('알림', '스터디룸 명칭을 입력해주세요.', 'danger', 3000)
				return
			} else if (this.state.rooms[i].pricePerTime === '' || this.state.rooms[i].pricePerTime === null) {
				this.alertMessage('알림', '요금을 입력해주세요.', 'danger', 3000)
				return
			} else if (
				this.state.rooms[i].chargeType === 'man' &&
				(!this.state.rooms[i].minPerson ||
					!this.state.rooms[i].maxPerson ||
					!(this.state.rooms[i].minPerson <= this.state.rooms[i].maxPerson))
			) {
				this.alertMessage('알림', '최소,최대인원수를 정확히 입력해주세요', 'danger', 3000)
				return
			} else if (this.state.rooms[i].priceBasic < 0) {
				this.alertMessage('알림', '추가요금을 제대로 입력해주세요', 'danger', 3000)
				return
			} else if (this.state.rooms[i].cancellableHour < 0) {
				this.alertMessage('알림', '취소가능시간을 제대로 입력해주세요', 'danger', 3000)
				return
			}
		}

		//이미지 데이터 Room 정보에 수정
		let images = this.state.images.slice()
		for (let x = 0; x < images.length; x++) {
			await this.setState({
				rooms: update(this.state.rooms, {
					[x]: {
						imgUrl1: { $set: this.state.images[x][0] == null ? null : this.state.images[x][0].url },
						imgUrl2: { $set: this.state.images[x][1] == null ? null : this.state.images[x][1].url },
						imgUrl3: { $set: this.state.images[x][2] == null ? null : this.state.images[x][2].url },
						imgUrl4: { $set: this.state.images[x][3] == null ? null : this.state.images[x][3].url },
						imgUrl5: { $set: this.state.images[x][4] == null ? null : this.state.images[x][4].url }
					}
				})
			})
		}
		const params = [...this.state.rooms]
		params.forEach((r) => {
			if (r.chargeType !== 'man') {
				r.minPerson = null
				r.maxPerson = null
			}
			r.timeUnit = parseInt(r.timeUnit || '60')
		})

		await axios
			.post('/room/' + JSON.parse(localStorage.getItem('manager_place')).seq, params)
			.then(function (res) {
				if (res.data.result === 'success') {
					hasChanges = false
					alert('저장되었습니다')
					//this.alertMessage('알림', '저장되었습니다.', 'success');
					setTimeout(() => {
						window.location.href = '/room'
					}, 1000)
				}
			})
			.catch(function (error) {
				//this.alertMessage('에러', error.message, 'danger');
				console.error(error)
			})
	}

	componentDidUpdate() {
		console.log(this.state)
	}

	/**
	 * 취소 버튼 클릭 => 스터디룸 페이지로 이동
	 */
	onCancel = () => {
		this.props.navigate(-1)
	}

	/**
	 * Message 출력
	 */
	alertMessage = (title, message, type, duration) => {
		Store.addNotification({
			title: title,
			message: message,
			type: type,
			insert: 'top',
			container: 'top-center',
			animationIn: ['animated', 'fadeIn'],
			animationOut: ['animated', 'fadeOut'],
			dismiss: { duration: duration },
			dismissable: { click: true }
		})
	}

	/**
	 * 이미지 업로드 클릭
	 */
	uploadClick = (index) => {
		this.setState({ images_index: index })
		document.getElementById('selectImages').click()
	}

	/**
	 * 이미지 선택 => 처리 (갯수 제한 5개)
	 */
	selectImages = (event) => {
		hasChanges = true
		const images_index = this.state.images_index
		if (this.state.images[images_index].length >= 5) {
			this.alertMessage('이미지가 너무 많습니다.', '최대 5개 까지 등록 가능합니다.', 'danger', 3000)
			return
		}

		//업로드할 이미지 리스트 셋팅
		let imgfiles = []
		for (let i = 0; i < event.target.files.length; i++) {
			imgfiles[i] = event.target.files[i]
		}
		//이미지 파일들만 필터
		imgfiles = imgfiles.filter((image) => image.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/))

		if (this.state.images[images_index].length + imgfiles.length > 5) {
			this.alertMessage('이미지가 너무 많습니다.', '최대 5개 까지 등록 가능합니다.', 'danger', 3000)
			return
		}

		this.uploadImages(imgfiles, images_index)
	}

	/**
	 * 이미지 업로드 API 연결
	 */
	uploadImages = async (imgfiles, images_index) => {
		for (let i = 0; i < imgfiles.length; i++) {
			const formData = new FormData()
			formData.append('file', imgfiles[i])
			formData.append('placeKey', this.state.placeKey)

			await axios
				.post('/image/upload', formData)
				.then((res) => {
					if (res.status === 200) {
						let _images = this.state.images.slice()
						_images[images_index].push({ url: res.data.url })
						this.setState({ images: _images })
					}
				})
				.catch((error) => console.error(error))
		}
	}

	/**
	 * 이미지 삭제
	 */
	deleteImage = (index, key) => {
		hasChanges = true
		let images = this.state.images.slice()
		images[index].splice(key, 1)
		this.setState({
			images: images
		})
	}

	/**
	 * 체크박스용 handler
	 */
	checkedChange = (name, i) => (event) => {
		hasChanges = true
		this.setState({
			rooms: update(this.state.rooms, {
				[i]: {
					[name]: { $set: event.target.checked }
				}
			})
		})
	}

	/**
	 * 기본 handler
	 */
	handleChange = (prop, value, i) => {
		hasChanges = true
		const additionalState = {}
		if (prop == 'chargeType' && value == 'man') {
			if (!this.state.rooms[i].minPerson) additionalState.minPerson = { $set: 1 }
			if (!this.state.rooms[i].maxPerson) additionalState.maxPerson = { $set: 2 }
		}
		this.setState({
			rooms: update(this.state.rooms, {
				[i]: {
					[prop]: { $set: value },
					...additionalState
				}
			})
		})
	}

	/**
	 * 스터디룸 추가 클릭
	 */
	addRoom = () => {
		hasChanges = true
		let _rooms = this.state.rooms.slice()
		_rooms.push({
			canReserve: true,
			imgUrl1: null,
			imgUrl2: null,
			imgUrl3: null,
			imgUrl4: null,
			imgUrl5: null,
			isLive: true,
			lockPassword: '',
			managerSeq: sessionStorage.getItem('manager_seq'),
			name: '',
			placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
			priceBasic: 0,
			pricePerTime: '',
			cancellableHour: 24
		})
		this.setState({ rooms: _rooms })

		let images = this.state.images.slice()
		images.push([])
		this.setState({ images: images })
	}

	/**
	 * 스터디룸 삭제 =>
	 * seq가 있으면 isLive:false
	 * seq가 없으면 state에서 제거
	 */
	deleteRoom = (i) => {
		hasChanges = true
		if (this.state.rooms[i].seq) {
			this.setState({
				rooms: update(this.state.rooms, {
					[i]: {
						isLive: { $set: false }
					}
				})
			})
		} else {
			let _rooms = this.state.rooms.slice()
			_rooms.splice(i, 1)
			this.setState({ rooms: _rooms })

			let _images = this.state.images.slice()
			_images.splice(i, 1)
			this.setState({ images: _images })
		}
	}

	render() {
		const { classes } = this.props
		const rooms = this.state.rooms
		const images = this.state.images

		return (
			<div className={classes.portalDashboardPageWrapper} style={{ padding: '3%', height: '100%', background: '#FAFAFA' }}>
				<ReactNotifications />
				<Grid item xs={12} style={{ height: '100%' }}>
					<Grid container justify="center" spacing={16} style={{ height: '100%' }}>
						<Grid item xs={12} sm={12} md={12}>
							{rooms.map((data, i) => {
								if (!rooms[i].timeUnit) {
									// 단위시간 기본 값 == 60분
									rooms[i].timeUnit = '60'
								} else {
									rooms[i].timeUnit = rooms[i].timeUnit.toString()
								}
								return rooms[i].isLive ? (
									<Grid key={i} item xs={12} sm={12} md={12} className={classNames('room_setting_body')}>
										<div className={'row col-md-12 room_setting_title'}>
											<div className={'col-md-3'}>
												<label>스터디룸 명칭</label>
												<input
													type="text"
													className={classNames('form-control', classes.prodset_textarea)}
													rows="1"
													id="textarea1"
													maxLength="20"
													style={{ padding: '6px', width: '100%', marginRight: '6px' }}
													value={rooms[i].name}
													placeholder="4인 스터디룸 A"
													onChange={(e) => this.handleChange('name', e.target.value, i)}
												/>
											</div>
											<div className={'col-md-2'}>
												<label>비밀번호</label>
												<input
													type="text"
													className={classNames('form-control', classes.prodset_textarea)}
													rows="1"
													id="textarea1"
													maxLength="20"
													style={{ padding: '6px', width: '100%', marginRight: '6px' }}
													value={rooms[i].lockPassword}
													placeholder="비밀번호 입력"
													onChange={(e) => this.handleChange('lockPassword', e.target.value, i)}
												/>
											</div>
											<div className={'col-md-7 room_setting_div'}>
												<input
													type="checkbox"
													className={classNames('canReserveBtn')}
													checked={rooms[i].canReserve}
													onChange={this.checkedChange('canReserve', i)}
													style={{ width: '20px', height: '20px', verticalAlign: 'middle' }}
												/>
												<span>예약 가능</span>
												<Button
													variant="outlined"
													size="medium"
													className={classNames('deleteRoomBtn', classes.button)}
													onClick={this.deleteRoom.bind(this, i)}
													style={{ marginLeft: '20px' }}
												>
													삭제
												</Button>
											</div>
										</div>

										<div className="room_setting_image row">
											<div className={'col-md-8'}>
												<input
													id="selectImages"
													className="form-control hidden_"
													type="file"
													accept=".jpg,.jpeg,.png,.gif"
													onChange={this.selectImages}
													multiple
												/>
												<div className="img_layout">
													{images[i]
														? images[i].map((data, x) =>
																data.url != null ? (
																	<div className="img_first" key={x}>
																		<div
																			className="deleteBtn"
																			index={x}
																			onClick={this.deleteImage.bind(this, i, x)}
																		>
																			<img src={RemoveIcon} className="deleteIcon" alt="" />
																			<p className="deleteText">삭제</p>
																		</div>
																		<img
																			src={data.url}
																			className={classNames(
																				'img_responsive',
																				'img_room',
																				'img-rounded'
																			)}
																			alt="not available"
																		/>
																		<br />
																	</div>
																) : (
																	<div className="img_next" key={x}>
																		<div
																			className="deleteBtn"
																			index={x}
																			onClick={this.deleteImage.bind(this, i, x)}
																		>
																			<img src={RemoveIcon} className="deleteIcon" alt="" />
																			<p className="deleteText">삭제</p>
																		</div>
																		<img
																			src={data.url}
																			className={classNames(
																				'img_responsive',
																				'img_room',
																				'img-rounded'
																			)}
																			alt="not available"
																		/>
																		<br />
																	</div>
																)
														  )
														: ''}
													{images[i] ? (
														images[i].length < 5 ? (
															images[i].length > 0 ? (
																<div className="img_next">
																	<img
																		src={UploadIcon}
																		className={classNames(
																			'img_responsive',
																			'img_upload',
																			'img-rounded'
																		)}
																		onClick={this.uploadClick.bind(this, i)}
																		alt=""
																	/>
																	<br />
																</div>
															) : (
																<div className="img_first">
																	<img
																		src={UploadIcon}
																		className={classNames(
																			'img_responsive',
																			'img_upload',
																			'img-rounded'
																		)}
																		onClick={this.uploadClick.bind(this, i)}
																		alt=""
																	/>
																	<br />
																</div>
															)
														) : (
															''
														)
													) : (
														''
													)}
												</div>
											</div>
											<div className={'col-md-4'}>
												<div style={{ margin: '8px' }}>
													<label>단위시간</label>
													<div>
														<RadioGroup
															aria-label="timeUnit"
															name="timeUnit"
															row={true}
															style={{ justifyContent: 'center', display: 'inline-block', marginLeft: '8px' }}
															className={classes.group}
															value={rooms[i].timeUnit}
															onChange={(e) => this.handleChange('timeUnit', e.target.value, i)}
														>
															<FormControlLabel
																value={'60'}
																control={<Radio size="small" />}
																label="1시간"
																style={{ marginBottom: '0' }}
															/>
															<FormControlLabel
																value={'30'}
																control={<Radio size="small" />}
																label="30분"
																style={{ marginBottom: '0' }}
															/>
														</RadioGroup>
													</div>
												</div>
												<div style={{ margin: '8px' }}>
													<label>요금</label>
													<div>
														<div style={{ position: 'relative', display: 'inline-block' }}>
															<input
																type="number"
																className={classNames('form-control', classes.prodset_textarea)}
																rows="1"
																style={{ padding: '6px', width: '120px', marginRight: '6px' }}
																min="0"
																max="999999"
																value={rooms[i].pricePerTime}
																placeholder="요금입력"
																onChange={(e) => this.handleChange('pricePerTime', e.target.value, i)}
															/>
															<span style={{ position: 'absolute', top: '8px', left: '100px' }}>원</span>
														</div>
														<RadioGroup
															aria-label="chargeType"
															name="chargeType"
															row={true}
															style={{ justifyContent: 'center', display: 'inline-block', marginLeft: '8px' }}
															className={classes.group}
															value={rooms[i].chargeType}
															onChange={(e) => this.handleChange('chargeType', e.target.value, i)}
														>
															<FormControlLabel
																value="room"
																control={<Radio size="small" />}
																label={'단위시간제'}
																style={{ marginBottom: '0' }}
															/>
															<FormControlLabel
																value="man"
																control={<Radio size="small" />}
																label={'단위시간X인원제'}
																style={{ marginBottom: '0' }}
															/>
														</RadioGroup>
													</div>
												</div>
												<div style={{ display: rooms[i].chargeType === 'man' ? 'block' : 'none', margin: '8px' }}>
													<label>인원수</label>
													<div>
														<div style={{ position: 'relative', display: 'inline-block' }}>
															<input
																type="number"
																className={classNames('form-control', classes.prodset_textarea)}
																rows="1"
																style={{ padding: '6px', width: '60px', marginRight: '6px' }}
																min="0"
																max="99"
																value={rooms[i].minPerson}
																placeholder="최소"
																onChange={(e) => this.handleChange('minPerson', e.target.value, i)}
															/>
															<span style={{ position: 'absolute', top: '8px', left: '40px' }}>명</span>
														</div>
														~&nbsp;
														<div style={{ position: 'relative', display: 'inline-block' }}>
															<input
																type="number"
																className={classNames('form-control', classes.prodset_textarea)}
																rows="1"
																style={{ padding: '6px', width: '60px', marginRight: '6px' }}
																min="0"
																max="99"
																value={rooms[i].maxPerson}
																placeholder="최대"
																onChange={(e) => this.handleChange('maxPerson', e.target.value, i)}
															/>
															<span style={{ position: 'absolute', top: '8px', left: '40px' }}>명</span>
														</div>
													</div>
												</div>
												<div style={{ margin: '8px' }}>
													<label>추가요금</label>
													<div>
														<div style={{ position: 'relative', display: 'inline-block' }}>
															<input
																type="number"
																className={classNames('form-control', classes.prodset_textarea)}
																rows="1"
																style={{ padding: '6px', width: '120px', marginRight: '6px' }}
																min="0"
																max="999999"
																value={rooms[i].priceBasic}
																placeholder="요금입력"
																onChange={(e) => this.handleChange('priceBasic', e.target.value, i)}
															/>
															<span style={{ position: 'absolute', top: '8px', left: '100px' }}>원</span>
														</div>
													</div>
												</div>
												<div style={{ margin: '8px' }}>
													<label>
														운영시간 <span style={{ fontSize: '11px', fontWeight: 500 }}>0~24</span>
													</label>
													<div>
														<div style={{ position: 'relative', display: 'inline-block' }}>
															<input
																type="number"
																className={classNames('form-control', classes.prodset_textarea)}
																rows="1"
																style={{ padding: '6px', width: '54px', marginRight: '6px' }}
																min="0"
																max="23"
																value={rooms[i].opStartHour}
																placeholder="0"
																onChange={(e) => this.handleChange('opStartHour', e.target.value, i)}
															/>
															<span style={{ position: 'absolute', top: '8px', left: '30px' }}>시</span>
														</div>
														~&nbsp;
														<div style={{ position: 'relative', display: 'inline-block' }}>
															<input
																type="number"
																className={classNames('form-control', classes.prodset_textarea)}
																rows="1"
																style={{ padding: '6px', width: '54px', marginRight: '6px' }}
																min="1"
																max="24"
																value={rooms[i].opEndHour}
																placeholder="24"
																onChange={(e) => this.handleChange('opEndHour', e.target.value, i)}
															/>
															<span style={{ position: 'absolute', top: '8px', left: '30px' }}>시</span>
														</div>
													</div>
												</div>
												<div style={{ margin: '8px' }}>
													<label>취소가능시간</label>
													<div>
														<div style={{ position: 'relative', display: 'inline-block' }}>
															<input
																type="number"
																className={classNames('form-control', classes.prodset_textarea)}
																rows="1"
																style={{ padding: '6px', width: '54px', marginRight: '6px' }}
																min="0"
																max="999"
																value={rooms[i].cancellableHour}
																placeholder="0"
																onChange={(e) => this.handleChange('cancellableHour', e.target.value, i)}
															/>
														</div>
														<span>시간 전까지</span>
													</div>
												</div>
											</div>
										</div>

										{/* <div style={{width: '100%', height: '3px', margin: '10px 0px', background: '#9E9E9E'}}></div> */}
									</Grid>
								) : (
									''
								)
							})}

							<div style={{ display: 'block', verticalAlign: 'middle', textAlign: 'center' }}>
								<Button variant="outlined" size="large" className={classes.button} onClick={this.addRoom}>
									스터디룸 추가
								</Button>
							</div>
						</Grid>

						<Grid
							key={3}
							item
							xs={12}
							sm={12}
							md={12}
							className={classes.portalWidget}
							style={{ height: '10%', display: 'block', verticalAlign: 'middle', textAlign: 'center' }}
						>
							<div>
								<Button
									variant="outlined"
									size="large"
									className={classes.button}
									onClick={this.onCancel}
									style={{ marginRight: '20px' }}
								>
									취소
								</Button>
								<Button variant="outlined" size="large" color="primary" className={classes.button} onClick={this.onSave}>
									저장
								</Button>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</div>
		)
	}
}

Roomsetting.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default withStyles(styles, { withTheme: true })(withNavigation(Roomsetting))
