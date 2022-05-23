const styles = theme => ({
	root: {
		width: '100%',
		height: '100%',
		overflow: 'hidden'
	},
	// Fab button icon
	'portal-calendar-event-fab__icon': {
		color: theme.palette.secondary.contrastText
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
	'portal-maps-contact-item--active': {
		color: theme.palette.secondary.light
	},
	'portal-maps-contact-detail-card': {
		background: theme.palette.secondary.light,
		color: theme.palette.secondary.contrastText
	},
	'portal-maps-contact-detail-card__pin': {
		background: theme.palette.secondary.contrastText,
		'&:after': {
			background: theme.palette.secondary.main
		}
	},
	'portal-maps-contact-detail-card__pulse': {
		background: theme.palette.secondary.main,
		'&:after': {
			boxShadow: `0 0 1px 2px ${theme.palette.secondary.main}`
		}
	},
	prodset_textarea: {
		textAlign: 'center',
		marginTop: '4px',
		marginBottom: '2px',
		display: 'table-cell',
		resize: 'none',
		width: '80%'
	},
	prod_textfield: {
		margin: '0px 8px !important'
	},
	bg_td: {
		textAlign: 'center',
		border: '1px solid #ddd',
		height: 40
	},
	prodBtn_add: {
		minHeight: '0px !important',
		height: '31px !important',
		minWidth: '0px !important',
		width: 60,
		padding: '4px 8px !important',
		margin: '0px 6px !important'
	},
	prodBtn_edit: {
		minHeight: '0px !important',
		height: '31px !important',
		minWidth: '0px !important',
		width: 60,
		padding: '4px 8px !important',
		margin: '0px 6px !important'
	},
	cancel_box: {
		zIndex: 1,
		display: 'none',
		position: 'fixed',
		left: '50%',
		bottom: '50%',
		padding: '8px',
		textAlign: 'center',
		border: 'solid 2px #000000',
		borderRadius: '4px',
		boxShadow: '0px 6px 8px 0px rgba(0, 0, 0, 0.37)',
		background: '#FFFFFF'
	},
	cancel_box_span: {
		width: '152px',
		marginBottom: '8px',
		padding: '6px 12px',
		fontSize: '24px'
	},
	cancel_box_button_cancel: {
		display: 'inline-block',
		width: '48%',
		marginRight: '4px',
		padding: '4px',
		color: '#FFFFFF',
		fontSize: '16px',
		fontWeight: 600,
		border: 'solid 1px #c5275d',
		borderRadius: '2px',
		background: '#f83f7e'
	},
	cancel_box_button_confirm: {
		display: 'inline-block',
		width: '48%',
		marginLeft: '4px',
		padding: '4px',
		color: '#FFFFFF',
		fontSize: '16px',
		fontWeight: 600,
		border: 'solid 1px #3498DB',
		borderRadius: '2px',
		background: '#3498DB'
	}
})

export default styles
