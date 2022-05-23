import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'

class extensionDialog extends React.Component {
	state = {
		lockerNo: null
	}

	handleCancel = () => {
		this.props.onClose(null)
	}

	handleSend = () => {
		let data = {
			moveLocker: true,
			lockerNo: this.state.lockerNo
		}
		this.props.onClose(data)
		this.setState({
			lockerNo: null
		})
	}

	//기본
	handleChange = (name, event) => {
		this.setState({ [name]: event.target.value })
	}

	onlyNumber = event => {
		event = event || window.event
		var keyID = event.which ? event.which : event.keyCode
		if ((keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39) return
		else return false
	}

	removeChar = event => {
		event = event || window.event
		var keyID = event.which ? event.which : event.keyCode
		if (keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39) return
		else event.target.value = event.target.value.replace(/[^0-9]/g, '')
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleCancel} aria-labelledby="event-dialog">
				<DialogContent>
					<div className={'row dialog_row'} style={{ marginTop: '20px', marginBottom: '-20px' }}>
						<input
							placeholder="락커번호"
							className={classNames('form-control', 'col-md-4')}
							type="text"
							maxLength="3"
							rows="1"
							onKeyDown={this.onlyNumber}
							onKeyUp={this.removeChar}
							value={this.state.information}
							onChange={event => this.handleChange('lockerNo', event)}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleCancel} variant="outlined">
						취소
					</Button>
					<Button onClick={this.handleSend} variant="outlined" color="primary">
						락커이동
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
