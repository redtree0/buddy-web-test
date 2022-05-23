import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CloseIcon from './images/closeIcon.png'

class extensionDialog extends React.Component {
	state = {
		deskNo: null
	}

	handleCancel = () => {
		this.props.onClose(null)
	}

	handleSend = () => {
		let data = {
			moveDesk: true,
			deskNo: this.state.deskNo
		}
		this.props.onClose(data)
		this.setState({
			deskNo: null
		})
	}

	//기본
	handleChange = (name, event) => {
		this.setState({ [name]: event.target.value })
	}

	/*
	onlyNumber = event => {
	  event = event || window.event;
	  var keyID = event.which ? event.which : event.keyCode;
	  if (
	    (keyID >= 48 && keyID <= 57) ||
			(keyID >= 96 && keyID <= 105) ||
			keyID == 8 ||
			keyID == 46 ||
			keyID == 37 ||
			keyID == 39
	  )
	    return;
	  else return false;
	}

	removeChar = event => {
	  event = event || window.event;
	  var keyID = event.which ? event.which : event.keyCode;
	  if (keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39) return;
	  else event.target.value = event.target.value.replace(/[^0-9]/g, '');
	}
	*/

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleCancel} aria-labelledby="event-dialog">
				<DialogContent>
					<div className={'row dialog_row'} style={{ marginTop: '20px', marginBottom: '-20px' }}>
						<input
							placeholder="좌석번호"
							className={classNames('form-control', 'col-md-4')}
							type="text"
							maxLength="9"
							rows="1"
							value={this.state.information}
							onChange={event => this.handleChange('deskNo', event)}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleCancel} variant="outlined">
						취소
					</Button>
					<Button onClick={this.handleSend} variant="outlined" color="primary">
						좌석이동
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

extensionDialog.defaultProps = {
	event: null
}

extensionDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
}

export default extensionDialog
