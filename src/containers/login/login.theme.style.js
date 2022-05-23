import Image from './images/sm_bg.png'
import logoImage from './images/sm_logo.png'

const styles = theme => ({
	background: {
		background: '#d2d2d2',
		backgroundImage: `url(${Image})`,
		width: '100%',
		height: '100%',
		backgroundSize: 'cover'
	},
	'primary-card': {
		background: 'none',
		backgroundImage: `url(${logoImage})`,
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		minHeight: '200px',
		marginBottom: '20px',
		boxShadow: 'none'
	}
})

export default styles
