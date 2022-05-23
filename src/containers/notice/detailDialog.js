import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import axios from '../../wrapper/axios'
import TextEditor from 'components/TextEditor'

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

class detailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			seq: null,
			contents: ''
		}
		this.openDialogReweighing = this.openDialogReweighing.bind(this)
	}

	componentDidMount() {
		this.props.setOpenDialog(this.openDialogReweighing)
	}

	openDialogReweighing = async ({ seq, contents = '' }) => {
		this.setState({ seq, contents })
		this.customDialog.handleClickOpen()
	}

	closeDialogReweighing = () => {
		this.customDialog.handleClose()
	}

	//저장
	handleSend = async () => {
		if (!this.state.contents) {
			this.props.onClose('check')
			return
		}

		await axios
			.post('/notice/edit', {
				seq: this.state.seq,
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				contents: this.state.contents
			})
			.then((res) => {
				if (res.data.result === 'success') {
					this.props.onClose('edit')
					this.closeDialogReweighing()
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}

	handleDelete = async () => {
		const result = window.confirm('해당 공지를 삭제하시겠습니까?')
		if (result) {
			await axios
				.post('/notice/edit', {
					seq: this.state.seq,
					placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
					isLive: false
				})
				.then((res) => {
					if (res.data.result === 'success') {
						this.props.onClose('delete')
						this.closeDialogReweighing()
					}
				})
				.catch((error) => {
					console.error(error)
				})
		}
	}

	handleChange = (prop) => (event) => {
		this.setState({ [prop]: event.target.value })
	}

	onChange = (value) => {
		this.setState({ contents: value })
	}

	render() {
		return (
			<div>
				<CustomDialog
					title={'공지내용'}
					className={'addDialog'}
					innerRef={(ref) => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<div className={'row'} style={{ width: '500px' }}>
							<TextField
								placeholder="공지내용을 입력해주세요(최대200자)"
								style={{ width: '100%' }}
								className={'col-md-2'}
								margin="normal"
								type="text"
								multiline
								rows="8"
								maxLength="200"
								value={this.state.contents}
								onChange={this.handleChange('contents')}
							/>
							{/* <TextEditor placeholder="1234" value={this.state.contents} onChange={this.onChange} /> */}
						</div>
					</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.handleDelete} color="secondary" style={{ float: 'left' }}>
							삭제
						</Button>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
							닫기
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

export default withStyles(styles)(detailDialog)
