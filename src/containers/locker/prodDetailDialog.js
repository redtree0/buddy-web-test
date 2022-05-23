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

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
	prod_textfield: {
		margin: '0px 8px !important'
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
			adornment: '일'
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })

		this.setValue()
	}

	setValue = () => {
		setTimeout(() => {
			const data = this.props.editData
			this.setState({
				data: this.props.editData
			})
			const price = this.props.editData.price
			this.payChange('price', String(price))
		}, 200)
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	//저장
	handleSend = async () => {
		if (this.state.data.order === '' || this.state.data.day === '' || this.state.data.name === '' || this.state.data.price === '') {
			this.props.onClose('datacheck')
			return
		}

		await this.setState({
			data: update(this.state.data, {
				price: { $set: parseInt(this.state.data['price'].replace(/,/gi, ''), 10) }
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
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px', padding: md.mobile() ? '0px' : '0 24px 24px' }}>
						<div className={'row'} style={{ margin: '0px', width: md.mobile() ? '100%' : '500px' }}>
							<TextField
								required
								label="순서"
								style={{ width: '60px' }}
								className={classNames('col-md-2', classes.prod_textfield)}
								margin="normal"
								type="text"
								inputProps={{ min: '1', max: '999', maxLength: 3, style: { textAlign: 'center' } }}
								value={this.state.data ? this.state.data.order : ''}
								onChange={e => this.handleChange('order', e.target.value)}
							/>

							<TextField
								required
								label="일수"
								style={{ width: '80px' }}
								className={classNames('col-md-2', classes.prod_textfield)}
								margin="normal"
								type="text"
								inputProps={{ min: '1', max: '999', maxLength: 3, style: { textAlign: 'right' } }}
								value={this.state.data ? (this.state.data.day ? this.state.data.day : '') : ''}
								onChange={e => this.handleChange('day', e.target.value)}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end" id="timeAdornment">
											{this.state.adornment}
										</InputAdornment>
									)
								}}
							/>

							<TextField
								required
								label="상품명"
								style={{ width: '120px' }}
								className={classNames('col-md-2', classes.prod_textfield)}
								margin="normal"
								type="text"
								value={this.state.data ? this.state.data.title : ''}
								onChange={e => this.handleFormFieldChange('title', e.target.value)}
							/>

							<TextField
								required
								label="금액"
								style={{ width: '100px' }}
								className={classNames('col-md-2', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
								margin="normal"
								type="text"
								inputProps={{ maxLength: 7, style: { textAlign: 'right' } }}
								value={this.state.data ? this.state.data.price : ''}
								onChange={e => this.payChange('price', e.target.value)}
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
								label="앱노출"
								style={{ width: '60px', textAlign: 'center' }}
								className={classNames('col-md-2', classes.prod_textfield, md.mobile() ? classes.marginTop : null)}
								margin="normal"
								type="text"
								value={this.state.data ? this.state.data.isAppPublic : true}
								onChange={e => this.handleFormFieldChange('isAppPublic', e.target.value)}
							>
								<MenuItem key={true} value={true}>
									{'Y'}
								</MenuItem>
								<MenuItem key={false} value={false}>
									{'N'}
								</MenuItem>
							</TextField>
						</div>
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
