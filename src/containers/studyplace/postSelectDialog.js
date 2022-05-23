import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import DaumPostcode from 'react-daum-postcode'

import moment from 'moment'

class postSelectDialog extends React.Component {
	state = {
		postData: null
	}

	handleCancel = () => {
		this.props.onClose(null)
	}

	handleSend = () => {
		this.props.onClose(this.state.postData)
	}

	handleData = data => {
		this.setState({ postData: data ? data : null })
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleCancel} aria-labelledby="event-dialog">
				<DialogTitle id="event-dialog">{this.props.title}</DialogTitle>
				<DialogContent>
					<div id="post_select" className={'row'} style={{ width: '500px' }}>
						<DaumPostcode onComplete={this.handleData} />
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleCancel} color="primary">
						취소
					</Button>
					<Button onClick={this.handleSend} color="primary" autoFocus>
						확인
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

postSelectDialog.defaultProps = {
	event: null
}

postSelectDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
}

export default postSelectDialog
