import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

class checkoutDialog extends React.Component {
	state = {
		checkout: true,
		selectedRefund: 'false',
		cancelFreeDesk: 'false'
	}

	handleCancel = () => {
		this.props.onClose(null)
	}

	handleSend = () => {
		this.props.onClose('checkout', {
			isRefund: this.state.selectedRefund === 'true',
			cancelFreeDesk: this.state.cancelFreeDesk === 'true'
		})
	}

	//기본
	handleChange = (name, event) => {
		this.setState({ [name]: event.target.value })
	}

	render() {
		return (
			<Dialog open={this.props.open} onClose={this.handleCancel} aria-labelledby="event-dialog">
				<DialogTitle>{'해당 좌석을 퇴실처리 하시겠습니까?'}</DialogTitle>
				<div style={{ marginTop: '10px', paddingLeft: '40px' }}>
					<RadioGroup
						aria-label="Payment"
						name="Payment"
						row={true}
						value={this.state.selectedRefund}
						onChange={event => this.handleChange('selectedRefund', event)}
					>
						<FormControlLabel value={'false'} control={<Radio />} label="퇴실만" />
						<FormControlLabel value={'true'} control={<Radio disabled={this.props.timeType === 'char'} />} label="환불처리" />
					</RadioGroup>
				</div>
				{this.props.timeType === 'free' ? (
					<div style={{ paddingLeft: '40px' }}>
						<hr style={{ margin: '0 140px 0 0' }} />
						<RadioGroup
							aria-label="cancelFreeDesk"
							name="cancelFreeDesk"
							row={true}
							value={this.state.cancelFreeDesk}
							onChange={event => this.handleChange('cancelFreeDesk', event)}
						>
							<FormControlLabel value={'false'} control={<Radio />} label="오늘만" />
							<FormControlLabel value={'true'} control={<Radio />} label="기간/충전권 취소" />
						</RadioGroup>
					</div>
				) : (
					''
				)}
				<DialogActions>
					<Button onClick={this.handleCancel} variant="outlined" style={{ marginBottom: '8px', marginRight: '10px' }}>
						취소
					</Button>
					<Button
						onClick={this.handleSend}
						variant="outlined"
						color="primary"
						style={{ marginBottom: '8px', marginRight: '20px' }}
					>
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
