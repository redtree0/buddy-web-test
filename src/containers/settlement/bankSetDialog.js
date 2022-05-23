import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import axios from '../../wrapper/axios'
import MobileDetect from 'mobile-detect'

import bankSWIFT from './data/bankcode.json'

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

class BankSetDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,
			placeSeq: null, //공간 Seq
			bankCode: '', //은행코드
			bankName: '', //은행명
			depositor: '', //예금주명
			accountNum: '' //계좌번호
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
		this.loadValue()
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false, productSeq: 'select' })
		this.reset()
		this.customDialog.handleClose()
	}

	loadValue = () => {
		axios
			.get('/place/' + JSON.parse(localStorage.getItem('manager_place')).seq)
			.then(res => {
				if (res.status === 200) {
					this.setState({
						placeSeq: res.data.seq ? res.data.seq : '',
						bankCode: res.data.bankCode ? res.data.bankCode : '', //은행코드
						depositor: res.data.depositor ? res.data.depositor : '', //예금주명
						accountNum: res.data.accountNum ? res.data.accountNum : '' //계좌번호
					})
				}
			})
			.catch(error => console.error(error))
	}

	//저장
	handleSend = async () => {
		let data = ''
		if (this.state.bankCode === '' || this.state.bankCode === null) {
			this.props.onClose('bankCodeChk')
			return
		}

		if (this.state.depositor === '' || this.state.depositor === null) {
			this.props.onClose('depositorChk')
			return
		}
		if (this.state.accountNum === '' || this.state.accountNum === null) {
			this.props.onClose('accountNumChk')
			return
		}

		data = {
			placeSeq: this.state.placeSeq,
			bankCode: this.state.bankCode, //은행코드
			bankName: this.state.bankName, //은행명
			depositor: this.state.depositor, //예금주명
			accountNum: this.state.accountNum //계좌번호
		}

		await axios
			.post('/place/' + JSON.parse(localStorage.getItem('manager_place')).seq + '/bank', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('success')
					this.closeDialogReweighing()
				}
			})
			.catch(error => console.error(error))
	}

	//기본
	handleFormFieldChange = (prop, value) => {
		if (prop === 'bankCode') {
			const bank = bankSWIFT.find(el => el.value === value)
			this.setState({ bankCode: bank.value, bankName: bank.label })
		} else {
			this.setState({ [prop]: value })
		}
	}

	reset = () => {
		this.setState({
			bankCode: '',
			bankName: '',
			depositor: '',
			accountNum: ''
		})
	}

	render() {
		return (
			<div>
				<CustomDialog
					className={'bankSetDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={
						<InsertButton id="bankSetDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />
					}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px', padding: md.mobile() ? '0px' : '0 24px 24px' }}>
						<div className={'row'} style={{ width: md.mobile() ? '100%' : '400px' }}>
							<span
								className={'col-md-12'}
								style={{ textAlign: 'left', width: '250px', fontSize: '26px', fontWeight: '700' }}
							>
								{'계좌 설정'}
							</span>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '400px', margin: md.mobile() ? '0' : null }}>
							<div style={{ margin: '20px 16px 0px 16px' }}>
								<Select
									value={this.state.bankCode ? this.state.bankCode : 'select'}
									onChange={e => this.handleFormFieldChange('bankCode', e.target.value)}
									style={{ width: md.mobile() ? '130px' : '140px' }}
								>
									{bankSWIFT.map(bankSWIFT => (
										<MenuItem key={bankSWIFT.value} value={bankSWIFT.value}>
											{bankSWIFT.label}
										</MenuItem>
									))}
								</Select>

								<div style={{ display: 'inline-block' }}>
									<TextField
										placeholder={'계좌번호 입력'}
										inputProps={{ maxLength: 30 }}
										style={{ width: md.mobile() ? '150px' : '218px', marginLeft: '10px' }}
										value={this.state.accountNum}
										onChange={e => this.handleFormFieldChange('accountNum', e.target.value)}
									/>
								</div>
							</div>
						</div>

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '400px', margin: md.mobile() ? '0' : null }}>
							<div style={{ margin: '20px 16px 0px 16px' }}>
								<span style={{ display: 'inline-block', width: md.mobile() ? '50px' : '140px' }}>{'예금주'}</span>

								<div style={{ display: 'inline-block' }}>
									<TextField
										placeholder={'예금주 입력'}
										inputProps={{ maxLength: 10 }}
										style={{ width: md.mobile() ? '230px' : '218px', marginLeft: '10px' }}
										value={this.state.depositor}
										onChange={e => this.handleFormFieldChange('depositor', e.target.value)}
									/>
								</div>
							</div>
						</div>

						<div
							className={'row'}
							style={{
								width: md.mobile() ? '100%' : '400px',
								margin: md.mobile() ? '0' : null,
								marginTop: '10px',
								textAlign: 'center'
							}}
						>
							<Button
								variant="outlined"
								onClick={this.closeDialogReweighing}
								color="secondary"
								style={{ width: '130px', margin: '10px' }}
							>
								취소
							</Button>
							<Button variant="outlined" onClick={this.handleSend} color="primary" style={{ width: '130px', margin: '10px' }}>
								등록
							</Button>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(BankSetDialog)
