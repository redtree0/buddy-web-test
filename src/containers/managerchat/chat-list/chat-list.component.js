import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import classNames from 'classnames'
import moment from 'moment'

import 'font-awesome/css/font-awesome.css'
import FontAwesome from 'react-fontawesome'

import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import Avatar from '@material-ui/core/Avatar'

import themeStyles from './chat-list.theme.style'
import scss from './chat-list.module.scss'

const ChatList = (props) => {
	const { classes, selected, list, width, onSelect } = props

	const createDesktopListItem = (chat) => {
		let activeItemClass = classes['comment-icon--regular']
		let icon = 'comment-o'

		if (chat && selected && chat.managerSeq === selected.managerSeq) {
			activeItemClass = classes['comment-icon--selected']
			icon = 'comment'
		}

		return (
			<ListItem title={chat.managerName} key={chat.managerSeq} onClick={onSelect(chat)} divider button>
				{chat.newMsgCnt > 0 ? <p className={classes.p}>{chat.newMsgCnt}</p> : null}
				<Avatar alt={chat.managerName} src={`${process.env.PUBLIC_URL}/${chat.image}`} />
				<ListItemText
					primary={chat.managerName}
					secondary={chat.placeName}
					// secondary={moment(chat.messages[0].date).fromNow()}
				/>
				<ListItemSecondaryAction className={classNames(scss['comment-icon'], activeItemClass)}>
					<FontAwesome name={icon} />
				</ListItemSecondaryAction>
			</ListItem>
		)
	}

	const createMobileListItem = (chat) => (
		<ListItem key={chat.seq} onClick={onSelect(chat)} divider button>
			{/* <Avatar alt={chat.managerName} src={`${process.env.PUBLIC_URL}/${chat.image}`} /> */}
			<ListItemText
				primary={chat.managerName}
				// secondary={chat.placeName}
				// secondary={moment(chat.messages[0].date).fromNow()}
			/>
		</ListItem>
	)

	return (
		<List component="nav" className={scss.list}>
			{list.map((chat) => (isWidthUp('sm', width) ? createDesktopListItem(chat) : createMobileListItem(chat)))}
		</List>
	)
}

ChatList.defaultProps = {
	selected: null
}

ChatList.propTypes = {
	classes: PropTypes.shape({}).isRequired,
	selected: PropTypes.shape({}),
	list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	onSelect: PropTypes.func.isRequired,
	width: PropTypes.string.isRequired
}

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(ChatList)
