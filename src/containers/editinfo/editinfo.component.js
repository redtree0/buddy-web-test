import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import styles from './editinfo.style'
import UploadIcon from './images/upload-signature.png'
import RemoveIcon from './images/removeIcon.png'
import axios from '../../wrapper/axios'

import './editinfo.css'

class EditInfo extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			images: [],
			imageUrls: [],

			seq: '',
			key: '',
			name: '', //공간명
			placeType: 'auto', //종류
			operatingTime: '', //운영시간
			phone: '', //전화번호
			kakaoId: '', //플러스 친구 ID

			postcode: '', //우편번호
			state: '',
			city: '',
			addr1: '',
			addr2: '', //상세주소

			managerSeq: '', //관리자 SEQ
			managerId: '', //관리자 ID
			managerNm: '', //관리자 성함
			ceoName: '', //대표자명
			bizRegNum: '', //사업자등록번호
			bizEmail: '', //사업자이메일
			managerNum: '', //관리자 연락처
			bankCode: '', //은행코드
			depositor: '', //예금주명
			accountNum: '', //계좌번호

			pwGate: '',
			pwToilet: '',
			pwWifi: '',

			guides: '',
			buyerInfo: '',
			imgUrl1: '',
			imgUrl2: '',
			imgUrl3: '',
			imgUrl4: '',
			imgUrl5: '',
			imgUrl6: '',
			imgUrl7: '',
			imgUrl8: '',
			imgUrl9: '',
			imgUrl10: ''
		}
	}

	componentDidMount() {
		this.loadValue()
	}

	loadValue = () => {
		axios
			.get('/place/' + JSON.parse(localStorage.getItem('manager_place')).seq, {})
			.then((res) => {
				const data = res.data
				if (data !== '' && data !== null) {
					this.setState({
						seq: data.seq,
						key: data.key,
						name: data.name || '', //공간명
						placeType: data.placeType || '', //종류
						operatingTime: data.operatingTime || '', //운영시간
						phone: data.phone || '', //전화번호
						kakaoId: data.kakaoId || '', //플러스 친구 ID

						postcode: data.postcode || '', //우편번호
						city: data.city || '',
						state: data.state || '',
						addr1: data.addr1 || '',
						addr2: data.addr2 || '', //상세주소

						managerSeq: data.managerSeq || '', //관리자 SEQ
						managerId: data.managerId || '', //관리자 SEQ
						managerNm: data.managerNm || '', //관리자 성함
						ceoName: data.ceoName || '', //대표자명
						bizRegNum: data.bizRegNum || '', //사업자등록번호
						bizEmail: data.bizEmail || '', //사업자등록번호
						managerNum: data.managerNum || '', //관리자 연락처
						managerEmail: data.managerEmail || '', //관리자 이메일
						bankCode: data.bankCode || '', //은행코드
						depositor: data.depositor || '', //예금주명
						accountNum: data.accountNum || '', //계좌번호

						pwGate: data.pwGate || '',
						pwToilet: data.pwToilet || '',
						pwWifi: data.pwWifi || '',

						guides: data.guides ? data.guides.replace(/\\n/g, '\r\n') : '',
						buyerInfo: data.buyerInfo ? data.buyerInfo.replace(/\\n/g, '\r\n') : '',
						imgUrl1: data.imgUrl1,
						imgUrl2: data.imgUrl2,
						imgUrl3: data.imgUrl3,
						imgUrl4: data.imgUrl4,
						imgUrl5: data.imgUrl5,
						imgUrl6: data.imgUrl6,
						imgUrl7: data.imgUrl7,
						imgUrl8: data.imgUrl8,
						imgUrl9: data.imgUrl9,
						imgUrl10: data.imgUrl10
					})
					this.setImageData()
				}
			})
			.catch((error) => console.error(error))
		// localStorage.removeItem('place_seq');
	}

	setImageData = () => {
		let _images = []
		if (this.state.imgUrl1 !== null) _images.push({ url: this.state.imgUrl1 })
		if (this.state.imgUrl2 !== null) _images.push({ url: this.state.imgUrl2 })
		if (this.state.imgUrl3 !== null) _images.push({ url: this.state.imgUrl3 })
		if (this.state.imgUrl4 !== null) _images.push({ url: this.state.imgUrl4 })
		if (this.state.imgUrl5 !== null) _images.push({ url: this.state.imgUrl5 })
		if (this.state.imgUrl6 !== null) _images.push({ url: this.state.imgUrl6 })
		if (this.state.imgUrl7 !== null) _images.push({ url: this.state.imgUrl7 })
		if (this.state.imgUrl8 !== null) _images.push({ url: this.state.imgUrl8 })
		if (this.state.imgUrl9 !== null) _images.push({ url: this.state.imgUrl9 })
		if (this.state.imgUrl10 !== null) _images.push({ url: this.state.imgUrl10 })
		this.setState({ images: _images })
		this.setState({ orgImages: _images })
	}

	//기본
	handleChange = (name, event) => {
		this.setState({ [name]: event.target.value })
	}

	onSave = () => {
		const data = {
			seq: this.state.seq,
			key: this.state.key,
			operatingTime: this.state.operatingTime,
			phone: this.state.phone,
			managerSeq: this.state.managerSeq,
			managerId: this.state.managerId,
			managerNm: this.state.managerNm,
			managerEmail: this.state.managerEmail,
			kakaoId: this.state.kakaoId,
			guides: this.state.guides,
			buyerInfo: this.state.buyerInfo,
			pwGate: this.state.pwGate,
			pwToilet: this.state.pwToilet,
			pwWifi: this.state.pwWifi
		}
		const images = this.state.images
		// 이미지 삭제시 처리 null 값 url 추가
		if (this.state.orgImages.length > images.length) {
			const appendCnt = this.state.orgImages.length - images.length
			images.push(...new Array(appendCnt).fill({ url: null }))
		}
		images[0] && (data.imgUrl1 = images[0].url)
		images[1] && (data.imgUrl2 = images[1].url)
		images[2] && (data.imgUrl3 = images[2].url)
		images[3] && (data.imgUrl4 = images[3].url)
		images[4] && (data.imgUrl5 = images[4].url)
		images[5] && (data.imgUrl6 = images[5].url)
		images[6] && (data.imgUrl7 = images[6].url)
		images[7] && (data.imgUrl8 = images[7].url)
		images[8] && (data.imgUrl9 = images[8].url)
		images[9] && (data.imgUrl10 = images[9].url)
		axios
			.post('/place/' + this.state.seq, data)
			.then((res) => {
				if (res.status === 200) {
					this.alertMessage('완료', '저장되었습니다.', 'success')
				}
			})
			.catch((error) => {
				this.alertMessage('에러', String(error.message), 'danger')
			})
	}

	uploadClick = () => {
		document.getElementById('selectImages').click()
	}

	selectImages = (event) => {
		if (this.state.images.length >= 10) {
			Store.addNotification({
				title: '이미지 갯수 초과.',
				message: '최대 10개 까지 등록 가능합니다.',
				type: 'danger',
				insert: 'top',
				container: 'top-center',
				animationIn: ['animated', 'fadeIn'],
				animationOut: ['animated', 'fadeOut'],
				dismiss: { duration: 3000 },
				dismissable: { click: true }
			})
			return
		}

		//업로드할 이미지 리스트 셋팅
		let imgfiles = []
		for (let i = 0; i < event.target.files.length; i++) {
			imgfiles[i] = event.target.files[i]
		}
		//이미지 파일들만 필터
		imgfiles = imgfiles.filter((image) => image.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/))

		if (this.state.images.length + imgfiles.length > 10) {
			Store.addNotification({
				title: '이미지가 너무 많습니다.',
				message: '최대 10개 까지 등록 가능합니다.',
				type: 'danger',
				insert: 'top',
				container: 'top-center',
				animationIn: ['animated', 'fadeIn'],
				animationOut: ['animated', 'fadeOut'],
				dismiss: { duration: 3000 },
				dismissable: { click: true }
			})
			return
		}

		this.uploadImages(imgfiles)
	}

	//이미지 업로드 API 연결
	uploadImages = async (imgfiles) => {
		for (let i = 0; i < imgfiles.length; i++) {
			const formData = new FormData()
			formData.append('file', imgfiles[i])
			formData.append('placeKey', this.state.key)

			await axios
				.post('/image/upload', formData)
				.then((res) => {
					if (res.status == 200) {
						let _images = this.state.images
						_images.push({ url: res.data.url })
						this.setState({ images: _images })
					}
				})
				.catch((error) => console.error(error))
		}
	}

	deleteImage = (index) => {
		var images = this.state.images.slice()
		images.splice(index, 1)
		this.setState({
			images: images
		})
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

	render() {
		const { classes } = this.props

		return (
			<div className={classes.portalDashboardPageWrapper} style={{ height: '100%' }}>
				<ReactNotifications />

				<div className={'row'} style={{ height: '100%' }}>
					<div className={'col-md-12 col-lg-4 editinfo_row'}>
						<div className={'editinfo_div'}>
							<div className={'editinfo_div_top'}>
								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '86px', textAlign: 'left', marginTop: '20px' }}
									>
										공간명
									</span>
									<span className={'col-md-2 kind_span'} style={{ display: 'inline-block' }}>
										{this.state.placeType}
									</span>
									<TextField className={'col-md-8 editinfo_tf'} margin="normal" value={this.state.name} disabled />
								</div>

								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '100px', textAlign: 'left', marginTop: '20px' }}
									>
										운영시간
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_2'}
										margin="normal"
										type="text"
										value={this.state.operatingTime}
										onChange={(event) => this.handleChange('operatingTime', event)}
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '100px', textAlign: 'left', marginTop: '20px' }}
									>
										전화번호
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_2'}
										margin="normal"
										type="tel"
										value={this.state.phone}
										placeholder="- 없이 숫자만"
										onChange={(event) => this.handleChange('phone', event)}
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '100px', textAlign: 'left', marginTop: '20px' }}
									>
										관리메일
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_2'}
										margin="normal"
										type="email"
										value={this.state.managerEmail}
										placeholder="abc@example.com"
										onChange={(event) => this.handleChange('managerEmail', event)}
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block', marginTop: '-4px' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '100px', textAlign: 'left', marginTop: '20px' }}
									>
										카톡채널
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_2'}
										margin="normal"
										type="text"
										value={this.state.kakaoId}
										placeholder="예) _abcdefg"
										onChange={(event) => this.handleChange('kakaoId', event)}
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block', marginTop: '-4px' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '100px', textAlign: 'left', marginTop: '20px' }}
									>
										입구 비번
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_2'}
										margin="normal"
										type="text"
										value={this.state.pwGate}
										onChange={(event) => this.handleChange('pwGate', event)}
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block', marginTop: '-4px' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '100px', textAlign: 'left', marginTop: '20px' }}
									>
										화장실비번
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_2'}
										margin="normal"
										type="text"
										value={this.state.pwToilet}
										onChange={(event) => this.handleChange('pwToilet', event)}
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block', marginTop: '-4px' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '100px', textAlign: 'left', marginTop: '20px' }}
									>
										Wi-Fi
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_2'}
										margin="normal"
										type="text"
										value={this.state.pwWifi}
										onChange={(event) => this.handleChange('pwWifi', event)}
									/>
								</div>
							</div>

							<div className={'editinfo_div_bottom'}>
								<div style={{ position: 'relative', paddingLeft: '10px' }}>
									<Typography variant="title" component="h2" gutterBottom style={{ paddingTop: '40px' }}>
										이용안내 및 주의사항
									</Typography>
								</div>
								<div style={{ position: 'relative', padding: '0px 20px' }}>
									<textarea
										placeholder="이용안내 및 주의사항을 입력해주세요.&#13;&#10;예)&#13;&#10;좌석이용시에는 취소 및 환불이 되지 않습니다.&#13;&#10;좌석미용시 전액 환불처리 가능합니다."
										className={classNames('form-control', 'editinfo_textarea')}
										rows="10"
										id="textarea1"
										value={this.state.guides == null ? '' : this.state.guides}
										onChange={(event) => this.handleChange('guides', event)}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className={'col-md-12 col-lg-4 editinfo_row'}>
						<div className={'editinfo_div'}>
							<div className={'editinfo_div_top'}>
								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '130px', textAlign: 'left', marginTop: '20px' }}
									>
										관리자
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_3'}
										margin="normal"
										type="text"
										value={
											this.state.managerNm == null ? '' : this.state.managerNm + ' (' + this.state.managerNum + ')'
										}
										disabled
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '130px', textAlign: 'left', marginTop: '20px' }}
									>
										대표자명
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_3'}
										margin="normal"
										type="text"
										value={this.state.ceoName == null ? '' : this.state.ceoName}
										disabled
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '130px', textAlign: 'left', marginTop: '20px' }}
									>
										사업자등록번호
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_3'}
										margin="normal"
										type="text"
										value={this.state.bizRegNum == null ? '' : this.state.bizRegNum}
										disabled
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '130px', textAlign: 'left', marginTop: '20px' }}
									>
										사업자이메일
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_3'}
										margin="normal"
										type="email"
										value={this.state.bizEmail == null ? '' : this.state.bizEmail}
										disabled
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '130px', textAlign: 'left', marginTop: '20px' }}
									>
										주소
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_3'}
										margin="normal"
										type="text"
										value={this.state.city + ' ' + this.state.state + ' ' + this.state.addr1 + ' ' + this.state.addr2}
										disabled
									/>
								</div>

								<div style={{ width: '100%', display: 'inline-block' }}>
									<span
										className={'col-md-2'}
										style={{ display: 'inline-block', width: '130px', textAlign: 'left', marginTop: '20px' }}
									>
										정산계좌
									</span>
									<TextField
										className={'col-md-9 editinfo_tf_3'}
										margin="normal"
										type="text"
										value={
											this.state.bankCode == null
												? ''
												: this.state.bankCode + ' ' + this.state.accountNum == null
												? ''
												: this.state.accountNum
										}
										disabled
									/>
								</div>
							</div>

							<div className={'editinfo_div_bottom'}>
								<div style={{ position: 'relative', paddingLeft: '10px' }}>
									<Typography variant="title" component="h2" gutterBottom style={{ paddingTop: '40px' }}>
										구매자 안내사항
									</Typography>
								</div>
								<div style={{ position: 'relative', padding: '0px 20px' }}>
									<textarea
										placeholder="구매자에게 안내 할 중요정보들을 기입해주세요.&#13;&#10;예)&#13;&#10;정문 비밀번호 : *1234*&#13;&#10;화장실 비밀번호 : *1234*&#13;&#10;와이파이 : STUDYCAFE / a1234567890"
										className={classNames('form-control', 'editinfo_textarea')}
										rows="10"
										id="textarea1"
										value={this.state.buyerInfo == null ? '' : this.state.buyerInfo}
										onChange={(event) => this.handleChange('buyerInfo', event)}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className={'col-md-12 col-lg-4 editinfo_row'}>
						<div className={'editinfo_div'}>
							<div style={{ verticalAlign: 'top' }}>
								<div style={{ position: 'relative' }}>
									<Typography
										variant="title"
										component="h2"
										gutterBottom
										style={{ paddingTop: '20px', marginLeft: '20px' }}
									>
										공간 이미지
									</Typography>
								</div>

								<input
									id="selectImages"
									className="form-control hidden_"
									type="file"
									accept=".jpg,.jpeg,.png,.gif"
									onChange={this.selectImages}
									multiple
								/>

								<div style={{ position: 'relative', marginTop: '20px' }}>
									{this.state.images.map((data, i) => {
										return i == 0 ? (
											<div className="col-md-12" key={i}>
												<div className="deleteBtn" index={i} onClick={this.deleteImage.bind(this, i)}>
													<img src={RemoveIcon} className="deleteIcon" alt="" />
													<p className="deleteText">삭제</p>
												</div>
												<img src={data.url} className="img-rounded img-responsive img_first" alt="not available" />
												<br />
											</div>
										) : (
											<div className="col-md-6" key={i}>
												<div className="deleteBtn" index={i} onClick={this.deleteImage.bind(this, i)}>
													<img src={RemoveIcon} className="deleteIcon" alt="" />
													<p className="deleteText">삭제</p>
												</div>
												<img src={data.url} className="img-rounded img-responsive img_next" alt="not available" />
												<br />
											</div>
										)
									})}
									{this.state.images.length < 10 ? (
										this.state.images.length > 0 ? (
											<div className="col-md-6 img_empty_div">
												<img
													src={UploadIcon}
													className="img-rounded img-responsive img_empty"
													onClick={this.uploadClick}
												/>
												<br />
											</div>
										) : (
											<div className="col-md-12 img_empty_div_first">
												<img
													src={UploadIcon}
													className="img-rounded img-responsive img_empty_first"
													onClick={this.uploadClick}
												/>
												<br />
											</div>
										)
									) : (
										''
									)}
								</div>
							</div>
						</div>
					</div>

					<div
						className={'col-md-12'}
						style={{ textAlign: 'center', verticalAlign: 'middle', padding: '20px', marginBottom: '20px' }}
					>
						<Button variant="outlined" size="large" color="primary" className={classes.button} onClick={this.onSave}>
							저장
						</Button>
					</div>
				</div>
			</div>
		)
	}
}

EditInfo.propTypes = {
	classes: PropTypes.shape({}).isRequired
}

export default withStyles(styles, { withTheme: true })(EditInfo)
