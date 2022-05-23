import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

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

class detailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			contents: ''
		}
		this.openDialogReweighing = this.openDialogReweighing.bind(this)
	}

	componentDidMount() {
		this.props.setOpenDialog(this.openDialogReweighing)
	}

	openDialogReweighing = async (contents = '') => {
		this.setState({ contents })
		this.customDialog.handleClickOpen()
	}

	closeDialogReweighing = () => {
		this.customDialog.handleClose()
	}

	render() {
		return (
			<div>
				<CustomDialog
					title={'알림톡 상세'}
					className={'addDialog'}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px' }}>
						<div className={'row'} style={{ width: '500px' }}>
							<pre>{this.state.contents}</pre>
						</div>
					</DialogContent>

					<DialogActions>
						<Button variant="outlined" onClick={this.closeDialogReweighing} color="default">
							닫기
						</Button>
					</DialogActions>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(detailDialog)
