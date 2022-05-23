import { Typography } from '@material-ui/core'
import React from 'react'
const plh = {
	'이용안내 및 주의사항':
		'구매자에게 안내 할 중요정보들을 기입해주세요.\n예)\n정문 비밀번호 : *1234*\n화장실 비밀번호 : *1234*\n와이파이 : STUDYCAFE / a1234567890',
	'구매자 안내사항':
		'이용안내 및 주의사항을 입력해주세요.\n예)\n좌석이용시에는 취소 및 환불이 되지 않습니다.\n좌석미용시 전액 환불처리 가능합니다.'
}
function GuideInput({ title, register, value }) {
	return (
		<div className={'editinfo_div_bottom'}>
			<div style={{ position: 'relative', paddingLeft: '10px' }}>
				<Typography variant="title" component="h2" gutterBottom style={{ paddingTop: '40px' }}>
					{title}
				</Typography>
			</div>
			<div style={{ position: 'relative', padding: '0px 20px' }}>
				<textarea
					placeholder={plh[title]}
					className="form-control editinfo_textarea"
					rows="10"
					id="textarea1"
					defaultValue={value}
					// onChange={(event) => this.handleChange('guides', event)}
					{...register}
				/>
			</div>
		</div>
	)
}

export default GuideInput
