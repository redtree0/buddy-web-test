import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import update from 'react-addons-update'
import MobileDetect from 'mobile-detect'

import kindData from './data/kindData.json'
import typeData from './data/typeData.json'

const styles = (theme) => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
	prod_textfield: {
		margin: '8px'
	},
	marginTop: {
		marginTop: '20px !important'
	}
})

const md = new MobileDetect(window.navigator.userAgent)

class prodDetailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,
			data: null,
			adornment: ''
		}
	}

	openDialogReweighing = () => {
		this.setState({ data: null })
		this.setState({ stateDialogReweighing: true })

		this.setValue()
	}

	setValue = () => {
		setTimeout(() => {
			const data = this.props.editData
			this.setState({
				data: this.props.editData
			})
			data.timeType === 'time' ? this.setState({ adornment: '시간' }) : this.setState({ adornment: '일' })
			const price = this.props.editData.price
			this.payChange('price', String(price))
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ data: null })
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	//등록
	handleSend = async () => {
		if (this.state.data.order === '' || this.state.data.title === '' || this.state.data.price === '') {
			this.props.onClose('datacheck')
			return
		}
		const price = this.state.data.price
		await this.setState({
			data: update(this.state.data, {
				price: { $set: parseInt(String(price).replace(/,/gi, ''), 10) },
				name: { $set: this.state.data['title'] + (this.state.data['subtitle'] ? '(' + this.state.data['subtitle'] + ')' : '') }
			})
		})
		let data = { e: 'add', value: this.state.data }
		this.props.onClose(data)
		this.closeDialogReweighing()
	}

	//삭제
	onDelete = () => {
		this.props.onClose('delete')
		this.closeDialogReweighing()
	}

	//기본
	handleFormFieldChange = async (prop, value) => {
		if (prop === 'timeType') {
			let adornment = ''
			value === 'time' ? (adornment = '1회권') : (adornment = '일권')
			value === 'time' ? this.setState({ adornment: '시간' }) : this.setState({ adornment: '일' })
			if (value === 'time') {
				await this.setState({
					data: update(this.state.data, {
						time: { $set: this.state.data.day },
						day: { $set: null },
						title: { $set: this.state.data.day ? this.state.data.day + adornment : '' }
					})
				})
			} else if (value === 'day') {
				await this.setState({
					data: update(this.state.data, {
						time: { $set: null },
						day: { $set: this.state.data.time },
						title: { $set: this.state.data.time ? this.state.data.time + adornment : '' }
					})
				})
			}
		}
		this.setState({
			data: update(this.state.data, {
				[prop]: { $set: value }
			})
		})
	}

	//금액 체크
	payChange = (prop, value) => {
		const re = /^[0-9\,]+$/
		if (value === '' || re.test(value)) {
			value = value.replace(/,/gi, '')
			value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			this.setState({
				data: update(this.state.data, {
					[prop]: { $set: value }
				})
			})
		}
	}

	//기본
	handleChange = async (prop, value) => {
		const re = /^[0-9\b]+$/
		if (value === '' || re.test(value)) {
			this.setState({
				data: update(this.state.data, {
					[prop]: { $set: value }
				})
			})
		}
	}

	render() {
		const { classes } = this.props
		return (
			<div>
				<CustomDialog
					title={'상품 수정'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="detailDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px', padding: md.mobile() ? '0px' : '0 10px 10px' }}>
						<div className={'row'} style={{ margin: '10px', width: md.mobile() ? '100%' : '540px' }}>
							<TextField
								required
								label="순서"
								style={{ width: '50px' }}
								className={classNames('col-md-2', classes.prod_textfield)}
								margin="normal"
								type="text"
								inputProps={{ min: '1', max: '999', maxLength: 3 }}
								value={this.state.data ? this.state.data.order : ''}
								onChange={(e) => this.handleChange('order', e.target.value)}
							/>

							<TextField
								required
								select
								label="좌석타입"
								style={{ width: '80px' }}
								className={classNames('col-md-2', classes.prod_textfield)}
								margin="normal"
								type="text"
								value={this.state.data ? this.state.data.deskType : ''}
								onChange={(e) => this.handleFormFieldChange('deskType', e.target.value)}
							>
								{typeData.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>

							<TextField
								required
								select
								label="종류"
								style={{ width: '140px' }}
								className={classNames('col-md-2', classes.prod_textfield)}
								margin="normal"
								type="text"
								value={this.state.data ? this.state.data.timeType : ''}
								onChange={(e) => this.handleFormFieldChange('timeType', e.target.value)}
							>
								{kindData.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>

							{this.state.data && this.state.data.timeType !== 'day' ? (
								<TextField
									required
									label="시간"
									style={{ width: '82px' }}
									className={classNames('col-md-2', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
									margin="normal"
									type="text"
									inputProps={{ min: '1', max: '999', maxLength: 3 }}
									value={this.state.data ? (this.state.data.time ? this.state.data.time : '') : ''}
									onChange={(e) => this.handleChange('time', e.target.value)}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" id="timeAdornment">
												시간
											</InputAdornment>
										)
									}}
								/>
							) : null}
							{this.state.data && (this.state.data.timeType === 'day' || this.state.data.timeType === 'free') ? (
								<TextField
									required
									label="기간"
									style={{ width: '82px' }}
									className={classNames('col-md-2', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
									margin="normal"
									type="text"
									inputProps={{ min: '1', max: '999', maxLength: 3 }}
									value={this.state.data ? (this.state.data.day ? this.state.data.day : '') : ''}
									onChange={(e) => this.handleChange('day', e.target.value)}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" id="timeAdornment">
												일
											</InputAdornment>
										)
									}}
								/>
							) : null}
							{this.state.data && this.state.data.timeType === 'char' ? (
								<TextField
									required
									label="유효기간"
									style={{ width: '82px' }}
									className={classNames('col-md-2', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
									margin="normal"
									type="text"
									inputProps={{ min: '0', max: '99', maxLength: 2 }}
									value={
										this.state.data ? (this.state.data.charPeriodMonth ? this.state.data.charPeriodMonth : '0') : '0'
									}
									onChange={(e) => this.handleChange('charPeriodMonth', e.target.value)}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end" id="timeAdornment">
												개월
											</InputAdornment>
										)
									}}
								/>
							) : null}
						</div>
						<div className={'row'} style={{ margin: '10px', width: md.mobile() ? '100%' : '540px' }}>
							<TextField
								required
								label="상품명"
								style={{ width: '200px' }}
								className={classNames('col-md-6', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
								margin="normal"
								type="text"
								value={this.state.data ? this.state.data.title : ''}
								onChange={(e) => this.handleFormFieldChange('title', e.target.value)}
							/>
							<TextField
								label="부제"
								style={{ width: '200px' }}
								className={classNames('col-md-6', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
								margin="normal"
								type="text"
								value={this.state.data ? this.state.data.subtitle : ''}
								onChange={(e) => this.handleFormFieldChange('subtitle', e.target.value)}
							/>
						</div>
						<div className={'row'} style={{ margin: '10px', width: md.mobile() ? '100%' : '540px' }}>
							<TextField
								required
								label="금액"
								style={{ width: '80px' }}
								className={classNames('col-md-2', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
								margin="normal"
								type="text"
								inputProps={{ maxLength: 8 }}
								value={this.state.data ? this.state.data.price : ''}
								onChange={(e) => this.payChange('price', e.target.value)}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end" id="payAdornment">
											원
										</InputAdornment>
									)
								}}
							/>

							<TextField
								required
								select
								label="공개타입"
								style={{ width: '80px' }}
								className={classNames('col-md-2', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
								margin="normal"
								type="text"
								value={this.state.data ? this.state.data.isAppPublic : true}
								onChange={(e) => this.handleFormFieldChange('isAppPublic', e.target.value)}
							>
								<MenuItem key={true} value={true}>
									{'앱노출'}
								</MenuItem>
								<MenuItem key={false} value={false}>
									{'관리용'}
								</MenuItem>
							</TextField>

							<TextField
								required
								select
								label="연장용"
								style={{ width: '120px' }}
								className={classNames('col-md-2', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
								margin="normal"
								type="text"
								value={this.state.data ? this.state.data.isExtend : false}
								disabled
							>
								<MenuItem key={true} value={true}>
									{'연장전용'}
								</MenuItem>
								<MenuItem key={false} value={false}>
									{'일반'}
								</MenuItem>
							</TextField>
						</div>
						<hr />
					</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.onDelete} style={{ float: 'left', marginRight: 'auto' }}>
							삭제
						</Button>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="secondary">
							취소
						</Button>
						<Button variant="outlined" onClick={this.handleSend} color="primary" autoFocus>
							저장
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(prodDetailDialog)
