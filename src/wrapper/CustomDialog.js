import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

const DialogTitle = withStyles((theme) => ({
	root: {
		borderBottom: `1px solid ${theme.palette.divider}`,
		margin: 0,
		padding: theme.spacing.unit * 2
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing.unit,
		top: theme.spacing.unit,
		color: theme.palette.grey[500]
	}
}))((props) => {
	const { children, classes, onClose } = props
	return (
		<MuiDialogTitle disableTypography className={classes.root} id="customDialog_title">
			<Typography variant="title">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	)
})

const DialogContent = withStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing.unit * 2
	}
}))(MuiDialogContent)

const DialogActions = withStyles((theme) => ({
	root: {
		borderTop: `1px solid ${theme.palette.divider}`,
		margin: 0,
		padding: theme.spacing.unit
	}
}))(MuiDialogActions)

const styles = (theme) => ({
	button: {
		margin: theme.spacing.unit,
		whiteSpace: 'noWrap'
	},
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	iconSmall: {
		fontSize: 16
	}
})

class CustomDialog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false
		}
	}

	handleClickOpen = (e) => {
		this.setState({
			open: true
		})

		if (this.props.callbackFunction) {
			this.props.callbackFunction()
		}
	}

	handleClose = () => {
		this.setState({ open: false })
	}

	componentDidMount() {
		this.setState({ open: this.props.onOpen })
	}

	render() {
		const { width, height, title, dialogActions, dialogButton, classes, onOpen } = this.props

		const wrapperWidth = {
			width: width
		}
		const wrapperHeight = {
			height: height
		}

		return (
			<div>
				{dialogButton && (
					<div id={'customDialog_btn'} onClick={this.handleClickOpen}>
						{dialogButton}
					</div>
				)}
				<Dialog
					onClose={this.handleClose}
					aria-labelledby="customized-dialog-title"
					open={this.state.open || onOpen}
					maxWidth={false}
					className="customDialog"
				>
					<div style={wrapperWidth}>
						{title && <DialogTitle id="customized-dialog-title">{title}</DialogTitle>}
						<DialogContent>
							<div style={wrapperHeight}>
								{this.props.children}
								{/*{React.cloneElement(this.props.children, {...this.props})}*/}
							</div>
						</DialogContent>
						{dialogActions && <DialogActions>{dialogActions}</DialogActions>}
					</div>
				</Dialog>
			</div>
		)
	}
}

CustomDialog.defaultProps = {
	onOpen: false,
	width: '100%',
	height: '100%'
}

export default withStyles(styles, { withTheme: true })(CustomDialog)
