/* eslint-disable linebreak-style */
import React from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import axios from '../../wrapper/axios'

import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import update from 'react-addons-update'
import ChatList from './chat-list/chat-list.component'
import NoMessages from './no-messages/no-messages.component'
import ChatMessages from './chat-messages/chat-messages.component'
import scss from './chatting.module.scss'
import withNavigation from 'components/withNavigation'

class MemberChat extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			selectedChat: null,
			managerChat: null,
			snackbarOpen: false,
			snackbarMessage: '',
			chatList: []
		}
	}

	componentDidMount = () => {
		//로그인 여부 체크
		if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
			window.location.href = '/login'
			return
		}

		if (parseInt(sessionStorage.getItem('manager_seq')) === 1) {
			setTimeout(() => {
				this.loadList()
			}, 200)
		} else {
			this.props.navigate(-1)
		}
	}

	loadList = async () => {
		axios
			.get('/chat/super/user')
			.then((res) => {
				if (res.status === 200) {
					const _chatList = []
					for (let i = 0; i < res.data.length; i++) {
						const push_data = {
							userSeq: res.data[i].userSeq,
							userName: res.data[i].userName ? res.data[i].userName : '',
							userPhone: res.data[i].userPhone ? res.data[i].userPhone : '',
							newMsgCnt: res.data[i].newMsgCnt ? res.data[i].newMsgCnt : '',
							image: 'assets/images/avatars/admin.png'
						}
						_chatList.push(push_data)
					}
					this.setState({ chatList: _chatList })
				}
			})
			.catch((error) => console.error(error))
	}

	onSnackbarClose = () => {
		this.setState({ snackbarOpen: false })
	}

	selectChat = (chat) => () => {
		const i = this.state.chatList.indexOf(chat)
		this.setState({
			chatList: update(this.state.chatList, {
				[i]: {
					newMsgCnt: { $set: 0 }
				}
			})
		})
		this.setState({ selectedChat: chat })
	}

	sendMessage = (message) => {
		// const newMessage = {
		//   date: Date.now(),
		//   from: {
		//     email: 'morris@gmail.com',
		//     name: 'Morris Onions',
		//     image: 'assets/images/avatars/avatar-2.png'
		//   },
		//   content: message
		// };

		// this.state.selectedChat.messages.unshift(newMessage);

		this.setState({
			snackbarOpen: true,
			snackbarMessage: 'Message Sent'
		})
	}

	render() {
		return (
			<div className={scss['chat-wrapper']}>
				<ReactNotifications />

				<ChatList selected={this.state.selectedChat} list={this.state.chatList} onSelect={this.selectChat} />

				{this.state.selectedChat ? (
					<ChatMessages type="user" chat={this.state.selectedChat} onSend={this.sendMessage} />
				) : (
					<NoMessages />
				)}

				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right'
					}}
					open={this.state.snackbarOpen}
					autoHideDuration={3000}
					onClose={this.onSnackbarClose}
					ContentProps={{
						'aria-describedby': 'message-id'
					}}
					message={<span id="message-id">{this.state.snackbarMessage}</span>}
				/>
			</div>
		)
	}
}

export default withNavigation(MemberChat)
