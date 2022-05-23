import React, { useEffect, useRef, useState } from 'react'
import { loadData, makePreview, postData, blobToUrl } from './libs/utils'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import UploadIcon from './images/upload-signature.png'
import EditImage from './components/EditImage'
import { useForm } from 'react-hook-form'
import { PortalDashboardPageWrapper } from './EditInfo.styled'
import TextInput from './components/TextInput'
import GuideInput from './components/GuideInput'

import './editinfo.css'
import { useNavigate } from 'react-router-dom'
function EditInfo() {
	const uploadBtn = useRef()
	const [state, setState] = useState()
	const { register, handleSubmit, control } = useForm()
	const navigate = useNavigate()

	const handleImageChange = async (e) => {
		const { files } = e.target
		if (state.imageUrls.length + files.length >= 10) {
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
		try {
			const [result, filesObj] = makePreview(files, state.imageUrls.length)
			setState((prev) => ({
				...prev,
				filesObj,
				imageUrls: [...prev.imageUrls, ...result]
			}))
		} catch (error) {
			console.error(error)
			return
		}
	}

	const onValid = async (data) => {
		const body = {
			seq: state.seq,
			key: state.key,
			managerSeq: state.managerSeq,
			managerId: state.managerId,
			managerNm: state.managerNm,
			managerEmail: state.managerEmail,
			...data
		}
		try {
			const parseImg = await Promise.all(state.imageUrls.map((image) => blobToUrl(image, state.filesObj, body.key)))
			for (let i = 1; i <= 10; i++) {
				if (parseImg[i - 1]) {
					body[`imgUrl${i}`] = parseImg[i - 1]
				} else {
					body[`imgUrl${i}`] = null
				}
			}
			const res = await postData(body.seq, body)
			if (res) {
				alertMessage('완료', '저장되었습니다.', 'success')
				setTimeout(() => navigate('dashboard'), 1000)
			} else {
				throw new Error('서버에러')
			}
		} catch (error) {
			alertMessage('에러', String(error.message), 'danger')
		}
	}

	const alertMessage = (title, message, type) => {
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

	useEffect(() => {
		loadData(setState)
	}, [])

	return state ? (
		<PortalDashboardPageWrapper style={{ height: '100%' }}>
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
									{state.placeType}
								</span>
								<TextField className={'col-md-8 editinfo_tf'} margin="normal" value={state.name} disabled />
							</div>
							<TextInput title="운영시간" value={state.operatingTime} control={control} name="operatingTime" />
							<TextInput title="전화번호" value={state.phone} control={control} name="phone" />
							<TextInput title="관리메일" value={state.managerEmail} control={control} name="managerEmail" text="email" />
							<TextInput title="카톡채널" value={state.kakaoId} control={control} name="kakaoId" />
							<TextInput title="입구비번" value={state.pwGate} control={control} name="pwGate" />
							<TextInput title="화장실비번" value={state.pwToilet} control={control} name="pwToilet" />
							<TextInput title="Wi-Fi" value={state.pwWifi} control={control} name="pwWifi" />
						</div>
						<GuideInput title="이용안내 및 주의사항" register={register('guides')} value={state.guides} />
					</div>
				</div>

				<div className={'col-md-12 col-lg-4 editinfo_row'}>
					<div className={'editinfo_div'}>
						<div className={'editinfo_div_top'}>
							<TextInput
								title="관리자"
								admin
								value={state.managerNm == null ? '' : state.managerNm + ' (' + state.managerNum + ')'}
								disabled
							/>
							<TextInput title="대표자명" admin value={state.ceoName == null ? '' : state.ceoName} disabled />
							<TextInput title="사업자등록번호" admin value={state.bizRegNum == null ? '' : state.bizRegNum} disabled />

							<TextInput title="사업자이메일" admin value={state.bizEmail == null ? '' : state.bizEmail} disabled />

							<TextInput
								title="주소"
								admin
								value={state.city + ' ' + state.state + ' ' + state.addr1 + ' ' + state.addr2}
								disabled
							/>
							<TextInput
								title="정산계좌"
								admin
								value={
									state.bankCode == null ? '' : state.bankCode + ' ' + state.accountNum == null ? '' : state.accountNum
								}
								disabled
							/>
						</div>
						<GuideInput title="구매자 안내사항" register={register('buyerInfo')} value={state.buyerInfo} />
					</div>
				</div>

				<div className={'col-md-12 col-lg-4 editinfo_row'}>
					<div className={'editinfo_div'}>
						<div style={{ verticalAlign: 'top' }}>
							<div style={{ position: 'relative' }}>
								<Typography variant="title" component="h2" gutterBottom style={{ paddingTop: '20px', marginLeft: '20px' }}>
									공간 이미지
								</Typography>
							</div>

							<input
								id="selectImages"
								className="form-control hidden_"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								ref={uploadBtn}
								multiple
							/>

							<div style={{ position: 'relative', marginTop: '20px' }}>
								{state.imageUrls.map((data, i) => (
									<EditImage data={data} setState={setState} i={i} key={i} />
								))}
								{state.imageUrls.length < 10 ? (
									state.imageUrls.length > 0 ? (
										<div className="col-md-6 img_empty_div">
											<img
												src={UploadIcon}
												className="img-rounded img-responsive img_empty"
												onClick={() => uploadBtn.current.click()}
											/>
											<br />
										</div>
									) : (
										<div className="col-md-12 img_empty_div_first">
											<img
												src={UploadIcon}
												className="img-rounded img-responsive img_empty_first"
												onClick={() => uploadBtn.current.click()}
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
					<Button variant="outlined" size="large" color="primary" onClick={handleSubmit(onValid)}>
						저장
					</Button>
				</div>
			</div>
		</PortalDashboardPageWrapper>
	) : (
		'Loading...'
	)
}

export default EditInfo
