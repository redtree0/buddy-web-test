import scrollImage from '../../assets/images/scroll_top.png'

const styles = theme => ({
	portalDashboardPageWrapper: {
		padding: 6,
		minHeight: '100%',
		boxSizing: 'border-box'
	},
	portalWidget: {
		flex: '1 1 100%',
		display: 'flex',
		flexDirection: 'column'
	},
	portalWidgetHeading: {
		textTransform: 'uppercase',
		paddingLeft: 12,
		borderLeftWidth: 2,
		borderLeftStyle: 'solid',
		marginTop: 16,
		marginBottom: 16,
		'&:after': {
			content: '""',
			width: 2,
			height: '0%',
			position: 'absolute',
			bottom: 0,
			left: -2,
			transition: 'height .5s'
		}
	},
	portalWidgetContent: {
		flex: '1 1 100%'
	},
	card: {
		textAlign: 'center',
		minHeight: '0px',
		maxHeight: '60px',
		maxWidth: '800px',
		marginLeft: 'auto',
		marginRight: 'auto',
		'@media (max-width: 1024px)': {
			minHeight: '110px'
		}
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	title: {
		marginBottom: 16,
		fontSize: 14,
		color: theme.palette.text.secondary
	},
	pos: {
		marginBottom: 12,
		color: theme.palette.text.secondary
	},
	scrollTop: {
		width: '30px',
		height: '30px',
		position: 'absolute',
		bottom: '10px',
		right: '10px',
		borderRadius: '2em',
		background: 'white',
		backgroundImage: `url(${scrollImage})`,
		backgroundSize: '20px',
		backgroundPosition: 'center center',
		backgroundRepeat: 'no-repeat'
	}
})

export default styles
