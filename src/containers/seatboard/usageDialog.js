import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import CloseIcon from './images/closeIcon.png'

class checkoutDialog extends React.Component {
	state = {
		checkout: true
	}

	handleCancel = () => {
		this.props.onClose(null)
	}

	handleSend = () => {
		this.props.onClose('continue')
	}

	//기본
	handleChange = (name, event) => {
		this.setState({ [name]: event.target.value })
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleCancel} aria-labelledby="event-dialog">
				<DialogTitle>
					{this.props.message}
					<br />
					{'그래도 신규 등록 하시겠습니까?'}
				</DialogTitle>
				<DialogActions>
					<Button onClick={this.handleCancel} variant="outlined">
						취소
					</Button>
					<Button onClick={this.handleSend} variant="outlined" color="secondary">
						추가등록
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

checkoutDialog.defaultProps = {
	event: null
}

checkoutDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
}

export default checkoutDialog
