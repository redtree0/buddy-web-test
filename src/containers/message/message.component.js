import React from 'react'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from './images/closeIcon.png'
import MenuItem from '@material-ui/core/MenuItem'
import axios from '../../wrapper/axios'
import moment from 'moment'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { BootstrapTable, TableHeaderColumn, SearchField } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table.css'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pagination from 'react-js-pagination'
import DetailDialog from './detailDialog'
import MobileDetect from 'mobile-detect'
import { debounce } from '../../utils'

const md = new MobileDetect(window.navigator.userAgent)

const styles = (theme) => ({
	suggestionsContainerOpen: {
		// position: 'absolute',
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit * 3,
		left: 0,
		right: 0
	},
	suggestion: {
		display: 'block'
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none'
	},
	resetIcon: {
		width: '20px',
		height: '20px',
		position: 'relative',
		marginTop: '-26px',
		float: 'right',
		opacity: 0.5,
		background: 'white',
		border: '1px solid white',
		borderRadius: '70px',
		'&:hover': { cursor: 'pointer', opacity: 1 }
	},
	titleLayout: {
		height: '100px',
		verticalAlign: 'middle',
		padding: '0px 20px'
	},
	titleDiv: {
		verticalAlign: 'middle',
		height: '70px',
		padding: '15px',
		margin: '10px 0px',
		background: '#d5d5d5',
		border: 'solid 1px #d5d5d5',
		borderRadius: '12px'
	},
	titleInput: {
		width: '20px',
		height: '20px',
		verticalAlign: 'middle',
		margin: '0px 10px'
	},
	titleP1: {
		display: 'inline-block',
		verticalAlign: 'middle',
		margin: '0px',
		fontSize: '20px',
		fontWeight: '600'
	},
	titleP2: {
		display: 'inline-block',
		verticalAlign: 'middle',
		margin: '0px 20px',
		fontSize: '20px',
		fontWeight: '500'
	},
	tableLayout: {
		background: 'white',
		border: 'solid 2px #dddddd',
		padding: '20px',
		margin: '10px',
		borderRadius: '12px'
	},
	messageLayout: {
		background: 'white',
		border: 'solid 2px #dddddd',
		padding: '20px',
		margin: '10px',
		borderRadius: '12px',
		width: '320px'
	},
	messageTitle: {
		display: 'block',
		textAlign: 'left',
		marginBottom: '10px',
		fontSize: '20px',
		fontWeight: '600'
	},
	messageTxt: {
		resize: 'none',
		marginTop: '20px',
		width: '100%'
	},
	messageBtn: {
		width: '100%',
		marginTop: '20px'
	}
})

function renderSuggestionsContainer(options) {
	const { containerProps, children } = options

	return (
		<Paper {...containerProps} square>
			{children}
		</Paper>
	)
}

class Message extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			msgTemplates: [],
			messageData: [],
			messageValue: '',

			//회원 검색용
			value: '',
			suggestions: [],
			selectedMember: null,
			disabled: false,
			activePage: 1,
			listTotal: 0,
			sizePerPage: 10,
			searchValue: '',
			searchData: '',
			defaultOrder: 'seq',
			order: 'desc'
		}
	}

	componentDidMount() {
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	loadData = async (searchValue) => {
		// if(this.state.firstDate === '' || this.state.firstDate === null || this.state.lastDate === '' || this.state.lastDate === null) {
		//     this.alertMessage("날짜가 비어있습니다.", "날짜를 선택해주세요.", "danger");
		//     return;
		// }
		searchValue ? await this.setState({ activePage: 1 }) : null

		axios
			.get('/msg', {
				params: {
					page: this.state.activePage,
					perPage: this.state.sizePerPage,
					search: this.state.searchData ? this.state.searchData : null,
					orderBy: this.state.defaultOrder,
					align: this.state.order
				}
			})
			.then((res) => {
				let data = res.data.list
				// data.sort((a, b) => a.seq - b.seq)
				let _messageData = []
				for (let i = 0; i < data.length; i++) {
					let push_data = {
						seq: data[i].seq,
						no: data[i].no,
						messengerType: data[i].messengerType || '',
						name: data[i].user ? data[i].user.name || '' : '',
						phone: data[i].user ? data[i].user.phone || '' : '',
						contents: data[i].contents || '',
						wdate: moment(data[i].wdate).format('M/D HH:mm')
					}
					_messageData.push(push_data)
				}
				this.setState({ messageData: _messageData, listTotal: res.data.total })
			})
			.catch((error) => console.error(error))

		axios
			.get('/msg/types')
			.then((res) => {
				if (res && res.data && res.data.list) {
					this.setState({ msgTemplates: res.data.list.map((el, i) => ({ ...el, no: i + 1 })) })
				}
			})
			.catch((error) => console.error(error))
	}

	messageSend = async () => {
		if (this.state.selectedMember === null) {
			this.alertMessage('회원을 선택해주세요.', '회원을 선택해주세요.', 'danger')
			return
		}
		if (this.state.messageValue === null || this.state.messageValue === '') {
			this.alertMessage('내용을 입력해주세요.', '내용을 입력해주세요.', 'danger')
			return
		}

		await axios
			.post('/msg/send', {
				placeSeq: sessionStorage.getItem('manager_seq'),
				userSeq: this.state.selectedMember.userSeq,
				memberSeq: this.state.selectedMember.seq,
				contents: this.state.messageValue
			})
			.then((res) => {
				if (res.data.result === 'success') {
					this.alertMessage('알림', '전송 되었습니다', 'success')
					this.loadData()
					this.reset()
				} else {
					this.alertMessage('알림', res.data.message, 'danger')
				}
			})
			.catch((error) => console.error(error))
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber })
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	handleChange = (prop) => (event) => {
		this.setState({ [prop]: event.target.value })
	}

	//Message 출력
	alertMessage = (title, message, type) => {
		Store.addNotification({
			title: title,
			message: message,
			type: type,
			insert: 'top',
			container: 'top-center',
			animationIn: ['animated', 'fadeIn'],
			animationOut: ['animated', 'fadeOut'],
			dismiss: { duration: 3000 },
			dismissable: { click: true }
		})
	}

	autoNoti = () => {
		window.location.href = '/autonoti'
	}

	//페이지당 Row 갯수 설정
	renderSizePerPageDropDown = (props) => {
		return (
			<div className="btn-group">
				{[10, 25, 50].map((n, idx) => {
					const isActive = n === props.currSizePerPage ? 'active' : null
					return (
						<button
							key={idx}
							type="button"
							className={`btn btn-default ${isActive}`}
							onClick={() => props.changeSizePerPage(n)}
						>
							{n}
						</button>
					)
				})}
			</div>
		)
	}
	changeSizePerPage = (n) => {
		// props.changeSizePerPage(n);
		this.setState({ activePage: 1, sizePerPage: n })
		setTimeout(() => {
			this.loadData()
		}, 200)
	}

	//Search 오른쪽 버튼 Custom
	createCustomClearButton = (onClick) => {
		return (
			<button className="btn btn-default" onClick={onClick}>
				초기화
			</button>
		)
	}

	//Search Custom
	createCustomSearchField = (props) => {
		return <SearchField placeholder="이름 또는 전화번호" />
	}

	/**
	 * 날짜 0 추가용
	 */
	addZero = (n) => {
		let zero = ''
		n = n.toString()
		if (n.length < 2) {
			for (let i = 0; i < 2 - n.length; i++) zero += '0'
		}
		return zero + n
	}

	/**
	 * Autosuggest 용
	 */
	renderInput = (inputProps) => {
		const { disabled, classes, ref, ...other } = inputProps

		return (
			<div>
				<TextField
					fullWidth
					disabled={disabled}
					style={{ marginTop: '20px' }}
					inputRef={ref}
					InputProps={{
						classes: {
							input: classes.input
						},
						...other
					}}
				/>
				<img src={CloseIcon} className={classes.resetIcon} onClick={this.reset} alt="" />
			</div>
		)
	}

	getSuggestionValue = (suggestion) => {
		this.setState({ selectedMember: suggestion, disabled: true })
		return suggestion.name ? suggestion.name + ' ( ' + suggestion.phone + ' )' : '이름없음 ( ' + suggestion.phone + ' )'
	}
	renderSuggestion = (suggestion, { query, isHighlighted }) => {
		const matches = match(suggestion.name, query)
		const parts = parse(suggestion.name, matches)

		return (
			<MenuItem selected={isHighlighted} component="div">
				<div>
					{parts.map((part, index) =>
						part.highlight ? (
							<span key={String(index)} style={{ fontWeight: 300 }}>
								{part.text}
							</span>
						) : (
							<strong key={String(index)} style={{ fontWeight: 500 }}>
								{part.text}
							</strong>
						)
					)}
					{' ( ' + suggestion.phone + ' )'}
				</div>
			</MenuItem>
		)
	}
	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue
		})
	}
	onSuggestionsFetchRequested = ({ value }) => {
		debounce(() => {
			const inputValue = value.trim().toLowerCase()
			axios
				.get('/member/find/' + inputValue, { params: { placeSeq: JSON.parse(localStorage.getItem('manager_place')).seq } })
				.then((res) => {
					this.setState({
						suggestions: res.data
					})
				})
				.catch((error) => console.error(error))
		})
	}

	shouldRenderSuggestions = (value) => {
		return isNaN(value) ? value.trim().length > 1 : value.trim().length > 3
	}

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		})
	}
	reset = () => {
		this.setState({
			value: '',
			selectedMember: null,
			disabled: false,
			messageValue: ''
		})
	}
	onRowClick = (row) => {
		this.openDialog(row.contents)
	}

	onKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopPropagation()
			this.onSearch()
		}
	}

	onSearch = async () => {
		await this.setState({ searchData: this.state.searchValue })
		await this.loadData(this.state.searchValue ? this.state.searchValue : 'clear')
	}

	dataSort = async (dataField) => {
		if (this.state.defaultOrder !== dataField) {
			await this.setState({ defaultOrder: dataField, order: 'desc' })
		} else {
			this.setState({ defaultOrder: dataField })
			if (this.state.order === 'desc') {
				await this.setState({ order: 'asc' })
			} else {
				await this.setState({ order: 'desc' })
			}
		}

		this.loadData()
	}

	orderCheck = (value) => {
		if (value === this.state.defaultOrder) {
			return (
				<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
					{value === 'seq'
						? 'Seq'
						: value === 'user.name'
						? '이름'
						: value === 'user.phone'
						? '전화번호'
						: value === 'wdate'
						? '전송시간'
						: value}
					<span className={classNames('order', this.state.order === 'asc' ? 'dropup' : '')}>
						<span className="caret" style={{ margin: '10px 5px' }}></span>
					</span>
				</div>
			)
		} else {
			return (
				<div onClick={() => this.dataSort(value)} style={{ cursor: 'pointer' }}>
					{value === 'seq'
						? 'Seq'
						: value === 'user.name'
						? '이름'
						: value === 'user.phone'
						? '전화번호'
						: value === 'wdate'
						? '전송시간'
						: value}
					<span className="order">
						<span className="dropdown">
							<span className="caret" style={{ margin: '10px 0px 10px 5px', color: 'rgb(204, 204, 204)' }}></span>
						</span>
						<span className="dropup">
							<span className="caret" style={{ margin: '10px 0px', color: 'rgb(204, 204, 204)' }}></span>
						</span>
					</span>
				</div>
			)
		}
	}

	render() {
		const { classes } = this.props
		const { suggestions } = this.state
		const { messageData, msgTemplates } = this.state
		const options = {
			defaultSortName: 'seq', // default sort column name
			// defaultSortOrder: 'desc', // default sort order
			// clearSearch: true,
			// clearSearchBtn: this.createCustomClearButton,
			// sizePerPageDropDown: this.renderSizePerPageDropDown,
			// searchField: this.createCustomSearchField,
			noDataText: '데이터 없음',
			onRowClick: this.onRowClick
		}
		return (
			<div style={{ padding: '5%', width: '100%' }}>
				<ReactNotifications />

				{/* <div className={classNames('row', classes.titleLayout)}>
                <div style={{width: '506px'}}>
                    <div className={classes.titleDiv}>
                        <Button variant="outlined" color="secondary" onClick={() => this.autoNoti()} >자동알림 설정</Button>
                    </div>
                </div>
            </div> */}
				<div className={classNames('col-lg-8', 'col-md-12', 'col-sm-12', classes.tableLayout)}>
					<div className="row">
						<div className="col-xs-4 col-sm-4 col-md-4 col-lg-8">
							<div className="btn-group btn-group-sm" role="group">
								<div>
									<div></div>
								</div>
							</div>
						</div>
						<div className="col-xs-8 col-sm-8 col-md-8 col-lg-4">
							<div className="form-group form-group-sm react-bs-table-search-form input-group input-group-sm">
								<input
									className="form-control "
									type="text"
									placeholder={md.mobile() ? '이름 & 전화번호' : '회원이름, 없을시 전화번호'}
									value={this.state.searchValue}
									onChange={this.handleChange('searchValue')}
									onKeyDown={(event) => this.onKeyDown(event)}
									style={{ zIndex: '0' }}
								></input>
								<span className="input-group-btn">
									<button className="btn btn-default" onClick={this.onSearch.bind(this)}>
										검색
									</button>
								</span>
							</div>
						</div>
					</div>
					<BootstrapTable
						data={messageData}
						options={options}
						// search
						// keyBoardNav
						// pagination
						hover
					>
						<TableHeaderColumn dataField="seq" isKey={true} hidden={true} dataAlign="center">
							Seq
						</TableHeaderColumn>
						<TableHeaderColumn dataField="no" width="50px" dataAlign="center">
							{/* No */}
							{this.orderCheck('seq')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="name" width="76px" dataAlign="center" dataFormat={this.memberFormat}>
							{/* 이름 */}
							{this.orderCheck('user.name')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="phone" width="120px" dataFormat={this.typeFormat} dataAlign="center">
							{/* 전화번호 */}
							{this.orderCheck('user.phone')}
						</TableHeaderColumn>
						<TableHeaderColumn dataField="contents" width="300px" dataAlign="center">
							내용
						</TableHeaderColumn>
						<TableHeaderColumn dataField="wdate" width="100px" dataAlign="center">
							{/* 전송시간 */}
							{this.orderCheck('wdate')}
						</TableHeaderColumn>
					</BootstrapTable>
					<div className="btn-group" style={{ width: '100%' }}>
						{[10, 25, 50].map((n, idx) => {
							const isActive = n === this.state.sizePerPage ? 'active' : null
							return (
								<button
									key={idx}
									type="button"
									style={{ margin: '20px 0' }}
									className={`btn ${isActive}`}
									onClick={() => this.changeSizePerPage(n)}
								>
									{n}
								</button>
							)
						})}
						<div style={{ float: 'right', marginLeft: '-10px', marginRight: ' -10px' }}>
							<Pagination
								activePage={this.state.activePage}
								itemsCountPerPage={this.state.sizePerPage}
								totalItemsCount={this.state.listTotal}
								pageRangeDisplayed={5}
								onChange={(event) => this.handlePageChange(event)}
							/>
						</div>
					</div>
				</div>
				<div className={classNames('col-lg-4', 'col-sm-12', classes.messageLayout)}>
					<span className={classes.messageTitle}></span>

					<BootstrapTable data={msgTemplates} hover>
						<TableHeaderColumn dataField="no" isKey={true} width="20px" dataAlign="center">
							#
						</TableHeaderColumn>
						<TableHeaderColumn dataField="title" width="140px" dataAlign="left">
							알림톡 종류
						</TableHeaderColumn>
					</BootstrapTable>

					{/*
					<Autosuggest
						theme={{
							suggestionsContainerOpen: classes.suggestionsContainerOpen,
							suggestionsList: classes.suggestionsList,
							suggestion: classes.suggestion
						}}
						renderInputComponent={this.renderInput}
						suggestions={suggestions}
						shouldRenderSuggestions={this.shouldRenderSuggestions}
						onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.onSuggestionsClearRequested}
						renderSuggestionsContainer={renderSuggestionsContainer}
						getSuggestionValue={this.getSuggestionValue}
						renderSuggestion={this.renderSuggestion}
						inputProps={{
							classes,
							placeholder: '회원검색(이름 또는 전화번호)',
							value: this.state.value,
							onChange: this.onChange,
							disabled: this.state.disabled
						}}
					/>
					<textarea
						className={classNames('form-control', classes.messageTxt)}
						rows="8"
						placeholder="내용을 입력해주세요."
						value={this.state.messageValue}
						onChange={this.handleChange('messageValue')}
					></textarea>

					<Button variant="outlined" onClick={this.messageSend} color="primary" className={classes.messageBtn}>
						전송
					</Button>
				*/}
				</div>

				<div className="hidden_"></div>
				<DetailDialog setOpenDialog={(open) => (this.openDialog = open)} />
			</div>
		)
	}
}

export default withStyles(styles)(Message)
