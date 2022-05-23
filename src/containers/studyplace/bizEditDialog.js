import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { InsertButton } from 'react-bootstrap-table'
import axios from '../../wrapper/axios'

import bankSWIFT from './data/bankcode.json'

import scss from './studyplace.module.scss'
import MobileDetect from 'mobile-detect'

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
		managerSeq: _.managerSeq, //관리자 SEQ
		managerNm: _.managerNm, //관리자 성함
		ceoName: _.ceoName, //대표자명
		bizRegNum: _.bizRegNum, //사업자등록번호
		bizEmail: _.bizEmail, //사업자이메일
		taxPayer: _.taxPayer, // (일반 or 간이과) 과세자
		incomePeriodDays: _.incomePeriodDays, //정산주기일수(15 또는 31)
		bankCode: _.bankCode, //은행코드
		bankName: _.bankName, //은행명
		depositor: _.depositor, //예금주명
		accountNum: _.accountNum, //계좌번호
		managerId: _.managerId, //관리자 ID
		managerPW: _.managerPW, //관리자 Pw
		managerEmail: _.managerEmail, //관리자 이메일
		feeType: _.feeType, // 수수료
		feeFixedAmount: _.feeFixedAmount ? context.feeFixedAmount.toLocaleString() : '0', // 정액제
		feeRate: _.feeRate, // 매출 비율
		bizType: _.bizType, // 업종
		bizClass: _.bizClass, // 업태
		contactId: _.contactId, // 바로빌 계정
		companyName: _.companyName // 회사명
	}
}

class bizEditDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = makePlainData({})
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		this.init()
		setTimeout(() => {
			this.loadValue()
		}, 200)
	}

	init = () => {
		this.setState(makePlainData({}))
	}

	loadValue = async () => {
		try {
			const res = await axios.get('/place/' + this.props.placeSeq, {
				headers: { 'Content-type': 'application/json' }
			})
			const { data } = res
			if (data !== '' && data !== null) {
				this.setState(makePlainData(data))
			}
		} catch (error) {
			console.error(error)
		}
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	//저장
	handleSend = async () => {
		const { state } = this
		const params = makePlainData(state)
		if (params.feeFixedAmount) params.feeFixedAmount = Number(params.feeFixedAmount.replace(/,/gi, ''))

		try {
			const res = await axios.post(`/place/${state.seq}`, params)
			const { data } = res
			if (data.result === 'success') {
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
			this.setState({ [name]: event.target.value })
		}
	}

	//은행 변경
	handleBankChange = (event) => {
		const bank = bankSWIFT.find((el) => el.value === event.target.value)
		this.setState({ bankCode: bank.value, bankName: bank.label })
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
			this.setState({ feeFixedAmount })
		}
	}

	mobilePage = () => {
		const { classes } = this.props
		return (
			<div className={'row'} style={{ width: '240px', margin: '0px' }}>
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
						value={this.state.phone ? this.state.phone : ''}
						onChange={this.handleChange('phone')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '103px' }}>
						대표자명
					</span>
					<TextField
						placeholder=""
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.ceoName ? this.state.ceoName : ''}
						onChange={this.handleChange('ceoName')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						사업자등록번호
					</span>
					<TextField
						placeholder="000-00-00000"
						style={{ width: '130px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.bizRegNum ? this.state.bizRegNum : ''}
						onChange={this.handleChange('bizRegNum')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						사업자이메일
					</span>
					<TextField
						placeholder="abc@example.com"
						style={{ width: '130px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.bizEmail ? this.state.bizEmail : ''}
						onChange={this.handleChange('bizEmail')}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						과세 방식
					</span>
					<RadioGroup
						aria-label="TaxPayer"
						name="TaxPayer"
						style={{ marginTop: '6px' }}
						className={'col-md-5'}
						row={true}
						value={this.state.taxPayer}
						onChange={this.handleChange('taxPayer')}
					>
						<FormControlLabel value={'1'} control={<Radio />} label="일반과세자" />
						<FormControlLabel value={'2'} control={<Radio />} label="간이과세자" />
					</RadioGroup>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						정산주기
					</span>
					<RadioGroup
						aria-label="incomePeriodDays"
						name="incomePeriodDays"
						style={{ marginTop: '6px' }}
						className={'col-md-5'}
						row={true}
						value={this.state.incomePeriodDays}
						onChange={this.handleChange('incomePeriodDays')}
					>
						<FormControlLabel value={'15'} control={<Radio />} label="15일" />
						<FormControlLabel value={'31'} control={<Radio />} label="1개월" />
					</RadioGroup>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '103px' }}>
						정산계좌
					</span>
					<TextField
						className={'col-md-2'}
						id="select-currency-native"
						select
						value={this.state.bankCode || ''}
						onChange={this.handleBankChange}
						SelectProps={{
							native: true,
							MenuProps: {
								className: classes.menu
							}
						}}
						margin="normal"
					>
						{bankSWIFT.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</TextField>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '103px' }}>
						예금주명
					</span>
					<TextField
						placeholder="예금주명"
						style={{ width: '160px', marginLeft: '10px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.depositor ? this.state.depositor : ''}
						onChange={this.handleChange('depositor')}
					/>
				</div>
				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '103px' }}>
						계좌번호
					</span>
					<TextField
						placeholder="계좌번호"
						style={{ width: '160px', marginLeft: '10px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.accountNum ? this.state.accountNum : ''}
						onChange={this.handleChange('accountNum')}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						수수료
					</span>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						className={'col-md-2'}
						row={true}
						value={this.state.feeType}
						onChange={this.handleChange('feeType')}
					>
						<FormControlLabel value={'fixed'} control={<Radio />} label="정액제" />
						<FormControlLabel value={'rate'} control={<Radio />} label="매출비율" />
					</RadioGroup>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px', paddingLeft: '0px' }}>
						{this.state.feeType === 'rate' ? '매출비율' : '정액제'}
					</span>
					<TextField
						placeholder=""
						style={{ width: '150px', display: this.state.feeType === 'fixed' ? 'none' : '' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						inputProps={{ style: { textAlign: 'right' } }}
						value={this.state.feeRate}
						onChange={this.handleChange('feeRate')}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end" id="payAdornment">
									%
								</InputAdornment>
							)
						}}
					/>
					<TextField
						placeholder=""
						style={{ width: '150px', display: this.state.feeType === 'rate' ? 'none' : '' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						inputProps={{ style: { textAlign: 'right' } }}
						value={this.state.feeFixedAmount}
						onChange={this.amountChange}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end" id="payAdornment">
									원
								</InputAdornment>
							)
						}}
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
						바로빌 계정
					</span>
					<TextField
						placeholder="바로빌 계정"
						style={{ width: '160px', marginLeft: '10px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.contactId ? this.state.contactId : ''}
						onChange={this.handleChange('contactId')}
					/>
				</div>
			</div>
		)
	}

	pcPage = () => {
		const { classes } = this.props
		return (
			<div>
				<div className={'row'} style={{ width: '800px' }}>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						회사명
					</span>
					<TextField
						placeholder=""
						style={{ width: '150px' }}
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.companyName ? this.state.companyName : ''}
						onChange={this.handleChange('companyName')}
					/>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						대표자명
					</span>
					<TextField
						placeholder=""
						style={{ width: '90px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.ceoName == null ? '' : this.state.ceoName}
						onChange={this.handleChange('ceoName')}
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
						업태
					</span>
					<TextField
						placeholder=""
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.bizType ? this.state.bizType : ''}
						onChange={this.handleChange('bizType')}
					/>
					<span
						className={'col-md-2'}
						style={{
							textAlign: 'right',
							marginTop: '20px',
							width: '103px'
						}}
					>
						업종
					</span>
					<TextField
						placeholder=""
						style={{ width: '200px' }}
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.bizClass ? this.state.bizClass : ''}
						onChange={this.handleChange('bizClass')}
					/>
				</div>

				<div className={'row'}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						사업자등록번호
					</span>
					<TextField
						placeholder="000-00-00000"
						style={{ width: '110px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.bizRegNum == null ? '' : this.state.bizRegNum}
						onChange={this.handleChange('bizRegNum')}
					/>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px' }}>
						사업자이메일
					</span>
					<TextField
						placeholder="abc@example.com"
						style={{ width: '200px' }}
						className={'col-md-2'}
						margin="normal"
						type="email"
						value={this.state.bizEmail ? this.state.bizEmail : ''}
						onChange={this.handleChange('bizEmail')}
					/>
				</div>

				<div className={'row'} style={{ width: '800px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						과세 방식
					</span>
					<RadioGroup
						aria-label="TaxPayer"
						name="TaxPayer"
						style={{ marginTop: '6px' }}
						className={'col-md-5'}
						row={true}
						value={this.state.taxPayer}
						onChange={this.handleChange('taxPayer')}
					>
						<FormControlLabel value={'1'} control={<Radio />} label="일반과세자" />
						<FormControlLabel value={'2'} control={<Radio />} label="간이과세자" />
					</RadioGroup>
				</div>

				<div className={'row'} style={{ width: '800px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						정산주기
					</span>
					<RadioGroup
						aria-label="incomePeriodDays"
						name="incomePeriodDays"
						style={{ marginTop: '6px' }}
						className={'col-md-5'}
						row={true}
						value={this.state.incomePeriodDays}
						onChange={this.handleChange('incomePeriodDays')}
					>
						<FormControlLabel value={'15'} control={<Radio />} label="15일" />
						<FormControlLabel value={'31'} control={<Radio />} label="1개월" />
					</RadioGroup>
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
						정산계좌
					</span>
					<TextField
						className={'col-md-2'}
						id="select-currency-native"
						select
						value={this.state.bankCode ? this.state.bankCode : ''}
						onChange={this.handleBankChange}
						SelectProps={{
							native: true,
							MenuProps: {
								className: classes.menu
							}
						}}
						margin="normal"
					>
						{bankSWIFT.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</TextField>
					<TextField
						placeholder="예금주명"
						style={{ width: '160px', marginLeft: '10px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.depositor ? this.state.depositor : ''}
						onChange={this.handleChange('depositor')}
					/>
					<TextField
						placeholder="계좌번호"
						style={{ width: '200px', marginLeft: '10px' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						value={this.state.accountNum ? this.state.accountNum : ''}
						onChange={this.handleChange('accountNum')}
					/>
				</div>

				<div className={'row'} style={{ width: '800px' }}>
					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px' }}>
						수수료
					</span>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						style={{ marginTop: '6px' }}
						className={'col-md-4'}
						row={true}
						value={this.state.feeType}
						onChange={this.handleChange('feeType')}
					>
						<FormControlLabel value={'fixed'} control={<Radio />} label="정액제" />
						<FormControlLabel value={'rate'} control={<Radio />} label="매출비율" />
					</RadioGroup>

					<span className={'col-md-2'} style={{ textAlign: 'right', marginTop: '20px', width: '120px', paddingLeft: '0px' }}>
						{this.state.feeType === 'rate' ? '매출비율' : this.state.feeType === 'fixed' ? '정액제' : ''}
					</span>
					<TextField
						placeholder=""
						style={{ width: '150px', display: this.state.feeType === 'rate' ? '' : 'none' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						inputProps={{ style: { textAlign: 'right' } }}
						value={this.state.feeRate}
						onChange={this.handleChange('feeRate')}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end" id="payAdornment">
									%
								</InputAdornment>
							)
						}}
					/>
					<TextField
						placeholder=""
						style={{ width: '150px', display: this.state.feeType === 'fixed' ? '' : 'none' }}
						className={'col-md-2'}
						margin="normal"
						type="text"
						inputProps={{ style: { textAlign: 'right' } }}
						value={this.state.feeFixedAmount}
						onChange={this.amountChange}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end" id="payAdornment">
									원
								</InputAdornment>
							)
						}}
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
						바로빌 계정
					</span>
					<TextField
						placeholder=""
						style={{ width: '200px' }}
						className={'col-md-4'}
						margin="normal"
						type="text"
						value={this.state.contactId ? this.state.contactId : ''}
						onChange={this.handleChange('contactId')}
					/>
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
				<CustomDialog
					title={'사업자정보'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="companyDialog_btn" btnText="수정" btnContextual="btn-warning" className="hidden_" />}
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

export default withStyles(styles)(bizEditDialog)
