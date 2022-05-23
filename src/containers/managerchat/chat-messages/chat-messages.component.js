import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import moment from 'moment'
import axios from '../../../wrapper/axios'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import AutorenewIcon from '@material-ui/icons/Refresh'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send'

import scss from './chat-messages.module.scss'

class ChatMessages extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			chat: [],
			messageList: [],
			message: [],
			managerSeq: ''
		}
	}

	componentDidUpdate = () => {
		if (this.state.managerSeq !== this.props.chat.managerSeq) {
			this.setState({ managerSeq: this.props.chat.managerSeq })
			this.loadMessage()
		}
	}

	componentDidMount = () => {
		setTimeout(() => {
			this.setState({ managerSeq: this.props.chat.managerSeq })
			this.loadMessage()
		}, 0)
	}

	loadMessage = async () => {
		await axios
			.get(
				parseInt(sessionStorage.getItem('manager_seq')) === 1
					? '/chat/super/1/manager/' + this.props.chat.managerSeq
					: '/chat/manager/' + sessionStorage.getItem('manager_seq') + '/super/1',
				{
					params: {
						placeSeq: this.props.chat.placeSeq
					}
				}
			)
			.then(res => {
				if (res.status === 200) {
					this.setState({ messageList: res.data.sort((a, b) => a.seq - b.seq) })
				}
			})
			.catch(error => console.error(error))

		setTimeout(() => {
			this.scrollToBottom()
		}, 200)
	}

	updateMessage = event => {
		this.setState({
			message: event.target.value
		})
	}

	sendMessage = async () => {
		await axios
			.post(
				parseInt(sessionStorage.getItem('manager_seq')) === 1 ? '/chat/super/manager' : '/chat/manager/super',
				parseInt(sessionStorage.getItem('manager_seq')) === 1
					? {
							placeSeq: this.props.chat.placeSeq,
							managerSeq: this.props.chat.managerSeq,
							contents: this.state.message,
							actionFlag: true
					  }
					: {
							placeSeq: this.props.chat.placeSeq,
							managerSeq: parseInt(sessionStorage.getItem('manager_seq')),
							contents: this.state.message
					  }
			)
			.then(res => {
				if (res.data.result === 'success') {
					this.loadMessage()
					this.props.onSend(this.state.message)
				}
			})
			.catch(error => console.error(error))

		this.setState({ message: '' })
	}

	scrollToBottom = () => {
		const scrollHeight = this.messageList.scrollHeight
		const height = this.messageList.clientHeight
		const maxScrollTop = scrollHeight - height
		this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
	}

	render() {
		const { messageList } = this.state
		const { chat } = this.props

		return (
			<div className={scss['chat-wrapper']}>
				<div
					className={scss['messages-wrapper']}
					ref={div => {
						this.messageList = div
					}}
				>
					{messageList ? (
						messageList.length > 0 ? (
							messageList.map((messageList, index) => {
								const messageClass =
									parseInt(sessionStorage.getItem('manager_seq')) === messageList.sndManagerSeq
										? scss['message--flipped']
										: scss['message--regular'] //to : from

								return (
									<div key={index} className={classNames(scss.message, messageClass)}>
										<div className={scss['avatar-wrapper']}>
											<Avatar
												alt={messageList.sndManagerSeq === 1 ? '슈퍼관리자' : ''}
												src={`${process.env.PUBLIC_URL}/${
													messageList.sndManagerSeq === 1
														? 'assets/images/avatars/avatar-4.png'
														: 'assets/images/avatars/admin.png'
												}`}
											/>
											<Typography variant="caption" align="center">
												{messageList.sndManagerSeq === 1
													? '슈퍼관리자'
													: chat.managerName === 'super'
													? sessionStorage.getItem('manager_id')
													: chat.managerName}
											</Typography>
										</div>
										<div className={scss['card-wrapper']}>
											<Card className={scss.message__card}>
												<CardContent>
													<Typography
														component="div"
														dangerouslySetInnerHTML={{ __html: messageList.contents }}
													/>
												</CardContent>
											</Card>
											<div className={scss['message-footer']}>
												<Typography variant="caption">{moment(messageList.wdate).fromNow()}</Typography>
												<div className={scss['message-actions']}>
													{/* <Typography variant="caption" component="a" href="#">Edit Comment</Typography>
                          <Typography variant="caption" component="a" href="#">Delete Comment</Typography> */}
												</div>
											</div>
										</div>
									</div>
								)
							})
						) : (
							<div className={scss['nomessage-div']}>
								<p className={scss['nomessage-p']}>{'문의 내역이 없습니다.'}</p>
							</div>
						)
					) : null}
				</div>
				<div style={{ textAlign: 'right' }}>
					<button className={scss['refreshBtn']} onClick={this.loadMessage}>
						<AutorenewIcon />
					</button>
				</div>
				<Card className={scss['send-card']}>
					<CardContent className={scss['send-card-content']}>
						<TextField
							fullWidth
							// label="내용을 입력해주세요"
							placeholder="내용을 입력해주세요"
							onChange={this.updateMessage}
							value={this.state.message}
						/>
						<IconButton onClick={this.sendMessage} aria-label="Send">
							<SendIcon />
						</IconButton>
					</CardContent>
				</Card>
			</div>
		)
	}
}

ChatMessages.propTypes = {
	chat: PropTypes.shape({}).isRequired,
	onSend: PropTypes.func.isRequired
}

export default ChatMessages
