import React from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import axios from '../../wrapper/axios'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import update from 'react-addons-update'
import ChatList from './chat-list/chat-list.component'
import NoMessages from './no-messages/no-messages.component'
import ChatMessages from './chat-messages/chat-messages.component'

import recentChats from '../../assets/data/apps/chat/recent.json'

import scss from './chatting.module.scss'

class ManagerChat extends React.Component {
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

		if (parseInt(sessionStorage.getItem('manager_seq')) !== 1) {
			//슈퍼관리자 X
			let manager_data = {
				managerSeq: 1,
				managerName: 'super',
				newMsgCnt: 0,
				placeName: '',
				placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq,
				image: 'assets/images/avatars/admin.png'
			}
			this.setState({ selectedChat: manager_data })
		} else {
			//슈퍼관리자 O => 관리자 목록 조회
			setTimeout(() => {
				this.loadList()
			}, 200)
		}
	}

	loadList = async () => {
		axios
			.get('/chat/super/manager')
			.then((res) => {
				if (res.status === 200) {
					let _chatList = []
					for (let i = 0; i < res.data.length; i++) {
						let push_data = {
							managerSeq: res.data[i].managerSeq,
							managerName: res.data[i].managerName ? res.data[i].managerName : '',
							newMsgCnt: res.data[i].newMsgCnt ? res.data[i].newMsgCnt : '',
							placeName: res.data[i].placeName ? res.data[i].placeName : '',
							placeSeq: res.data[i].placeSeq ? res.data[i].placeSeq : '',
							image: 'assets/images/avatars/admin.png'
						}
						_chatList.push(push_data)
					}
					// let push_data = {
					//   managerSeq: 8,
					//   managerName: 'tester3',
					//   newMsgCnt: 10,
					//   placeName: 'Test',
					//   placeSeq: 0,
					//   image: "assets\/images\/avatars\/admin.png"
					// };
					// _chatList.push(push_data);
					this.setState({ chatList: _chatList })
				}
			})
			.catch((error) => console.error(error))
	}

	onSnackbarClose = () => {
		this.setState({ snackbarOpen: false })
	}

	selectChat = (chat) => () => {
		let i = this.state.chatList.indexOf(chat)
		this.setState({
			chatList: update(this.state.chatList, {
				[i]: {
					['newMsgCnt']: { $set: 0 }
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
			snackbarMessage: '전송 완료'
		})
	}

	render() {
		return (
			<div className={scss['chat-wrapper']}>
				<ReactNotifications />

				{/* 슈퍼관리자만 관리자 목록 뿌려지게 */}
				{parseInt(sessionStorage.getItem('manager_seq')) === 1 ? (
					<ChatList selected={this.state.selectedChat} list={this.state.chatList} onSelect={this.selectChat} />
				) : null}

				{/* 슈퍼관리자 => 관리자 목록 선택 => 넘겨줌 */}
				{/* 일반관리자 => 슈퍼관리자 1:1 */}
				{parseInt(sessionStorage.getItem('manager_seq')) === 1 ? (
					this.state.selectedChat ? (
						<ChatMessages chat={this.state.selectedChat} onSend={this.sendMessage} />
					) : (
						<NoMessages />
					)
				) : (
					<ChatMessages chat={this.state.selectedChat} onSend={this.sendMessage} />
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

export default ManagerChat
