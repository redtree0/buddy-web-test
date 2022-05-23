import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CloseIcon from './images/closeIcon.png'

class refundCheckDialog extends React.Component {
	state = {
		checkout: true,
		selectedRefund: 'false'
	}

	handleCancel = () => {
		this.props.onClose(null)
	}

	handleSend = () => {
		this.props.onClose('refund')
	}

	//기본
	handleChange = (name, event) => {
		this.setState({ [name]: event.target.value })
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleCancel} aria-labelledby="event-dialog">
				<DialogTitle>{'전액환불 및 이용취소 처리하시겠습니까?'}</DialogTitle>
				<DialogActions>
					<Button onClick={this.handleCancel} variant="outlined">
						취소
					</Button>
					<Button onClick={this.handleSend} variant="outlined" color="primary">
						확인
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

refundCheckDialog.defaultProps = {
	event: null
}

refundCheckDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
}

export default refundCheckDialog
