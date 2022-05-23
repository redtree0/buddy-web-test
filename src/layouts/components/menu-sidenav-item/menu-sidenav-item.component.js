import React from 'react'
// import { connect } from 'react-redux';
import PropTypes from 'prop-types'
// import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from '@material-ui/core/Button'
import { NavLink } from 'react-router-dom/'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'

import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import styles from './menu-sidenav-item.style'
// Actions
//import { toggleSidenav } from '../../../actions/layout.actions';
//import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

class MenuSidenavItem extends React.Component {
	state = { open: this.props.open }

	handleClick = (event) => {
		//if (!isWidthUp('md', this.props.width)) this.props.toggleSidenav();
		this.setState({ open: !this.state.open })
		if (!this.state.open) {
			const $target = event.target
			setTimeout(() => {
				$target.scrollIntoView(true)
			}, 500)
		}
	}

	render() {
		const { children, classes, href, title, icon, type } = this.props

		if (type && type === 'header') {
			return (
				<ListSubheader disableSticky className={classes.root}>
					{title}
				</ListSubheader>
			)
		}

		const iconStyle = {
			fontSize: 16
		}

		const currentPath = window.location.pathname === href
		return href && !children ? (
			<ListItem
				to={href}
				component={NavLink}
				className={`${classes.root} ${currentPath ? classes.listItemActive : ''}`}
				disableGutters
			>
				<Button
					onClick={this.handleClick}
					classes={{
						root: classes.listItem,
						label: classes.listItemButtonLabel
					}}
				>
					{icon && <span className={classes.listIcon}>{icon}</span>}
					<Typography variant="button" color="inherit" className={classes.listItemText}>
						{title}
					</Typography>
					{!href && (this.state.open ? <ExpandLessIcon style={iconStyle} /> : <ExpandMoreIcon style={iconStyle} />)}
				</Button>
				{children && (
					<Collapse in={this.state.open} timeout="auto" unmountOnExit className={classes.nested}>
						{children}
					</Collapse>
				)}
			</ListItem>
		) : (
			<ListItem className={classes.root} disableGutters>
				<Button
					onClick={this.handleClick}
					classes={{
						root: classes.listItem,
						label: classes.listItemButtonLabel
					}}
				>
					{icon && <span className={classes.listIcon}>{icon}</span>}
					<Typography variant="button" color="inherit" className={classes.listItemText}>
						{title}
					</Typography>
					{!href && (this.state.open ? <ExpandLessIcon style={iconStyle} /> : <ExpandMoreIcon style={iconStyle} />)}
				</Button>
				{children && (
					<Collapse in={this.state.open} timeout="auto" unmountOnExit className={classes.nested}>
						{children}
					</Collapse>
				)}
			</ListItem>
		)
	}
}

MenuSidenavItem.defaultProps = {
	children: null,
	href: null,
	icon: null,
	type: null,
	open: false
}

MenuSidenavItem.propTypes = {
	classes: PropTypes.shape({}).isRequired,
	children: PropTypes.shape({}),
	href: PropTypes.string,
	title: PropTypes.string.isRequired,
	icon: PropTypes.shape({}),
	type: PropTypes.string,
	open: PropTypes.bool
}

// function mapStateToProps(state) {
//   return {
//     theme: state.theme,
//     layout: {
//       currentLayout: state.layout.currentLayout,
//       sidenavOpen: state.layout.sidenavOpen,
//       sidenavVariant: state.layout.sidenavVariant
//     }
//   };
// }

export default withStyles(styles)(MenuSidenavItem)
