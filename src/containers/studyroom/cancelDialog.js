import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CloseIcon from './images/closeIcon.png'

class checkoutDialog extends React.Component {
	state = {
		cancel: true,
		selectedRefund: 'false'
	}

	handleCancel = () => {
		this.props.onClose(null)
	}

	handleSend = () => {
		this.props.onClose('cancel', this.state.selectedRefund === 'true' ? true : false)
	}

	//기본
	handleChange = (name, event) => {
		this.setState({ [name]: event.target.value })
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleCancel} aria-labelledby="event-dialog">
				<img src={CloseIcon} className="dialogCancle" onClick={this.handleCancel} />
				<DialogTitle>{'해당 예약을 취소 하시겠습니까?'}</DialogTitle>
				<div style={{ marginTop: '20px', textAlign: 'center' }}>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						row={true}
						style={{ justifyContent: 'center' }}
						value={this.state.selectedRefund}
						onChange={event => this.handleChange('selectedRefund', event)}
					>
						<FormControlLabel value={'true'} control={<Radio />} label="환불" />
						<FormControlLabel value={'false'} control={<Radio />} label="환불안함" />
					</RadioGroup>
				</div>
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

checkoutDialog.defaultProps = {
	event: null
}

checkoutDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
}

export default checkoutDialog
