import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import axios from '../../wrapper/axios'
import sampleImg from './images/import_xls_sample.png'

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 240
	}
})

class excelDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false,
			file: null
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
		if (!this.state.file) {
			this.props.onClose('nofile')
			return
		}
		let formData = new FormData()
		formData.append('file', this.state.file)
		formData.append('placeSeq', JSON.parse(localStorage.getItem('manager_place')).seq)
		axios
			.post('/member/import', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(res => {
				if (res.data && res.data.result === 'success') {
					this.props.onClose('add')
					this.closeDialogReweighing()
					this.setState({ file: null })
				} else if (res.data && res.data.message) {
					this.props.onClose('error', res.data.message)
				} else {
					this.props.onClose('error', '에러가 발생하였습니다. 관리자에게 문의해주세요.')
				}
			})
			.catch(error => {
				console.error(error)
				alert('에러가 발생하였습니다.\n관리자에게 문의해주세요.' + error.message)
			})
	}

	handleFileChange = evt => {
		this.setState({ file: evt.target.files && evt.target.files[0] })
	}

	render() {
		const { classes } = this.props
		return (
			<div>
				<CustomDialog
					title={'회원 일괄등록'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton btnText="일괄등록" btnContextual="btn-info" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<div className={'row'} style={{ width: '400px' }}>
							엑셀파일로 다수의 회원을 한번에 등록 할 수 있습니다
							<br />
							<img src={sampleImg} />
							※ 동일한 전화번호가 존재하는 경우 충돌이 일어날 수 있습니다.
							<br />
						</div>
						<div className={'row'} style={{ width: '400px', margin: '20px' }}>
							<input
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
								className={classes.input}
								id="import-excel-file"
								name="file"
								type="file"
								onChange={this.handleFileChange}
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

export default withStyles(styles)(excelDialog)
