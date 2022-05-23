import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import axios from '../../wrapper/axios'

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

class addEventDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,

			name: '', //이름
			phone: '', //전화번호
			passNum: '', //비밀번호
			memo: '' //메모
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
	}

	closeDialogReweighing = () => {
		this.setState({ stateDialogReweighing: false })
		this.customDialog.handleClose()
	}

	//등록
	handleSend = async () => {
		if (this.state.name === '' || this.state.name === null || this.state.phone === '' || this.state.phone === null) {
			this.props.onClose('check')
			return
		}

		const data = {
			name: this.state.name,
			phone: this.state.phone,
			passNum: this.state.passNum,
			memo: this.state.memo
		}

		await axios
			.post('/user/register', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('add')
					this.closeDialogReweighing()
					this.setState({
						name: '',
						phone: '',
						passNum: '',
						memo: ''
					})
				}
			})
			.catch(error => console.error(error))
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

	render() {
		const { classes } = this.props
		return (
			<div>
				<CustomDialog
					title={'유저 등록'}
					className={'addDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton btnText="등록" btnContextual="btn-info" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					{/* <DialogTitle id="addEventDialog">{this.props.title}</DialogTitle> */}
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<div className={'row'} style={{ width: '300px' }}>
							<span
								className={'col-md-2'}
								style={{ textAlign: 'left', marginTop: '20px', width: '100px', display: 'inline-block' }}
							>
								이름
							</span>
							<TextField
								placeholder=""
								style={{ width: '120px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								value={this.state.name}
								onChange={e => this.handleFormFieldChange('name', e.target.value)}
							/>
						</div>
						<div className={'row'} style={{ width: '300px' }}>
							<span
								className={'col-md-2'}
								style={{ textAlign: 'left', marginTop: '20px', width: '100px', display: 'inline-block' }}
							>
								&thinsp;*전화번호
							</span>
							<TextField
								required
								placeholder="000-0000-0000"
								style={{ width: '120px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								value={this.state.phone}
								onChange={e => this.handleFormFieldChange('phone', e.target.value)}
							/>
						</div>

						<div className={'row'} style={{ width: '300px' }}>
							<span
								className={'col-md-2'}
								style={{ textAlign: 'left', marginTop: '20px', width: '100px', display: 'inline-block' }}
							>
								비밀번호
							</span>
							<TextField
								placeholder=""
								style={{ width: '120px' }}
								className={'col-md-2'}
								margin="normal"
								type="number"
								min="0"
								max="999999"
								maxlength="6"
								value={this.state.passNum}
								onChange={e => this.handleFormFieldChange('passNum', e.target.value)}
							/>
						</div>

						<div className={'row'} style={{ width: '300px' }}>
							<TextField
								placeholder="메모를 입력해주세요"
								style={{ width: '270px', marginLeft: '15px', marginRight: '15px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								value={this.state.memo}
								onChange={e => this.handleFormFieldChange('memo', e.target.value)}
							/>
						</div>
					</DialogContent>

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
