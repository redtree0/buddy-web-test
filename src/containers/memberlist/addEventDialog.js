import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
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
			placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
			name: this.state.name,
			phone: this.state.phone,
			memo: this.state.memo,
			regManagerSeq: sessionStorage.getItem('manager_seq')
		}

		await axios
			.post('/member', data)
			.then(res => {
				if (res.data.result === 'success') {
					this.props.onClose('add')
					this.closeDialogReweighing()
					this.setState({
						name: '',
						phone: '',
						memo: ''
					})
				} else if (res.data.message) {
					this.props.onClose('error', res.data.message)
				} else {
					this.props.onClose('error', '에러가 발생하였습니다. 관리자에게 문의해주세요.')
				}
			})
			.catch(error => {
				console.error(error)
				alert('에러가 발생하였습니다.\n관리자에게 문의해주세요.' + error.message)
			})
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
					title={'회원 신규등록'}
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
								전화번호
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
							<TextField
								placeholder="메모를 입력해주세요"
								style={{ width: '270px', marginLeft: '8px', marginRight: '8px' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								multiline
								rows="4"
								value={this.state.memo}
								onChange={e => this.handleFormFieldChange('memo', e.target.value)}
							/>
						</div>
					</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
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
