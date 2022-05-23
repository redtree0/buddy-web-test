import React, { useEffect, useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import lottie from 'lottie-web'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import styled, { keyframes } from 'styled-components'
import styles from './studyroom.theme.style'
import './roomsetting.css'
import { useNavigate } from 'react-router-dom'
import Slider from 'react-slick'
import './slider.scss'
import CheckBtn from './components/CheckBtn'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { addRooms, fetchRooms, insertImage, postNewRooms } from 'reducers/room.reducer'
import Roomform from './components/Roomform'
import DeleteBtn from './components/DeleteBtn'

const settings = {
	customPaging: (i) => <button className="dot"></button>,
	dots: true,
	dotsClass: 'slider-dots slider-thumbs',
	dotClass: 'test',
	infinite: true,
	swipeToSlide: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1
}

const AnimationWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	transition: all 0.2s linear;
	transform: ${(props) => (props.loading ? 'none' : 'scale(0.1)')};
	& div {
		font-size: 2rem;
	}
`

function Loading({ visible }) {
	// if (!visible) return null

	const loader = useRef()
	useEffect(() => {
		lottie.loadAnimation({
			container: loader.current,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			animationData: require('./lotties/progress-bar.json')
		})
	}, [])
	return (
		<div
			style={{
				position: 'fixed',
				display: 'flex',
				width: '100vw',
				height: '100vh',
				zIndex: '100000',
				top: 0,
				left: 0,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#eeeeee4a',
				transition: 'all 0.5s linear',
				opacity: visible ? 1 : 0,
				visibility: visible ? 'visible' : 'hidden'
			}}
		>
			<AnimationWrapper loading={visible} ref={loader}>
				{/* <Wave text="업로드중.." effect="fadeOut" speed={2} effectChange={5} /> */}
			</AnimationWrapper>
		</div>
	)
}

const RoomSetting = ({ classes }) => {
	const navigate = useNavigate()
	// const [rooms, setRooms] = useState(JSON.parse(localStorage.getItem('rooms')))
	const [placeKey, setPlaceKey] = useState(JSON.parse(localStorage.getItem('manager_place')).key)
	const [placeSeq, setPlaceSeq] = useState(JSON.parse(localStorage.getItem('manager_place')).seq)
	const rooms = useSelector((state) => state.rooms.rooms, shallowEqual)
	const { year, month } = useSelector((state) => state.rooms)
	const errors = useSelector((state) => state.rooms.errors)
	const hasChanges = useSelector((state) => state.rooms.hasChanges)
	const isLoading = useSelector((state) => state.rooms.isLoading)

	const dispatch = useDispatch()

	const addRoom = () => {
		const newRoom = {
			canReserve: true,
			imgUrl1: null,
			imgUrl2: null,
			imgUrl3: null,
			imgUrl4: null,
			imgUrl5: null,
			isLive: true,
			images: [],
			lockPassword: '4인 스터디룸 A',
			managerSeq: sessionStorage.getItem('manager_seq'),
			name: '4인 스터디룸 A',
			chargeType: 'room',
			placeSeq,
			priceBasic: 0,
			pricePerTime: '요금을 입력하세요',
			cancellableHour: 24
		}

		// setRooms((prev) => [...prev, newRoom])
		dispatch(addRooms(newRoom))
		//  이미지 핸들링에 따라 이미지 배열 추가해줘야함.
	}

	const testSave = () => {
		dispatch(postNewRooms({ errors, rooms, placeKey, navigate }))
	}

	const onChangeFiles = (event, room) => {
		const payload = {
			key: room.key,
			files: event.target.files
		}
		dispatch(insertImage(payload))
	}
	useEffect(() => {
		if (!rooms) {
			dispatch(fetchRooms({ placeSeq, year, month }))
		}
		window.onbeforeunload = () => {
			if (hasChanges) return '저장 버튼을 누르지 않으면 반영되지 않습니다.'
		}
	}, [hasChanges])

	useEffect(() => {
		return () => {
			window.onbeforeunload = () => undefined
			localStorage.removeItem('rooms')
		}
	}, [])

	return (
		<MainContainer className={classes.portalDashboardPageWrapper}>
			<ReactNotifications />
			{rooms &&
				rooms.map((room, idx) => {
					return (
						room.isLive && (
							<GridWrapper key={room.key}>
								<CarouselContainer>
									<Carousel {...settings}>
										{room.images?.length ? (
											room.images.map(
												(image, i) =>
													image && (
														<ImageContainer key={i}>
															<SlideImage src={image.url} alt="" />
															<DeleteBtn idx={idx} image={image} />
														</ImageContainer>
													)
											)
										) : (
											<ImageContainer>
												<DefaultImage
													onClick={(event) => {
														const ip = document.querySelector('.file_input')
														if (ip) {
															ip.click()
														}
													}}
												>
													<svg
														className="w-6 h-6"
														fill="currentColor"
														viewBox="0 0 20 20"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
														<path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
													</svg>
													<input
														onChange={(event) => onChangeFiles(event, room)}
														multiple
														className="file_input"
														type="file"
														accept="image/*"
														style={{ visibility: 'hidden', display: 'none' }}
													/>
												</DefaultImage>
											</ImageContainer>
										)}
									</Carousel>
									<ButtonWrapper>
										<CheckBtn room={room} />
									</ButtonWrapper>
								</CarouselContainer>

								<Roomform room={room} idx={idx} />
							</GridWrapper>
						)
					)
				})}
			<SubmitWrapper>
				<Button onClick={() => addRoom()} variant="outlined" size="large" className={classes.button} style={{ maxHeight: '40px' }}>
					스터디룸 추가
				</Button>
				<div>
					<Button
						onClick={() => navigate('../room')}
						variant="outlined"
						size="large"
						color="secondary"
						className={classes.button}
						style={{ maxHeight: '40px' }}
					>
						취소
					</Button>
					<Button
						onClick={() => testSave()}
						variant="outlined"
						size="large"
						color="primary"
						className={classes.button}
						style={{ maxHeight: '40px' }}
					>
						저장
					</Button>
				</div>
			</SubmitWrapper>
			<Seperator />
			<Loading visible={isLoading} />
		</MainContainer>
	)
}

export default withStyles(styles, { withTheme: true })(RoomSetting)

const GridWrapper = styled(Grid)`
	height: fit-content;
	width: 100%;
	min-width: fit-content;
	padding: 1.5rem;
	border: 1px solid rgb(197, 197, 197);
	border-radius: 10px;
	display: flex;
	position: relative;
	box-shadow: 3px 3px 6px -3px rgba(0, 0, 0, 0.45);
`
const CarouselContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	flex: 1;
	margin-left: 2rem;
	margin-right: 3rem;
`

const Carousel = styled(Slider)`
	width: 400px;
	height: 300px;
	&:focus {
		outline: none;
	}
`

const ImageContainer = styled.div`
	width: 300px;
	height: 300px;
	outline: none;
	position: relative;
	&:hover {
		& button {
			opacity: 1;
		}
	}
`

const SlideImage = styled.img`
	height: 100%;
	margin: 0 auto;
	max-width: 100%;
	border-radius: 6px;
`

const ButtonWrapper = styled.div`
	display: flex;
	width: 30%;
	justify-content: space-around;
	margin-top: 2rem;
`

const MainContainer = styled.div`
	padding: 3%;
	height: 100%;
	background-color: #fafafa;
	display: grid;
	gap: 2rem;
	& > div:last-child {
		margin-bottom: 3rem;
	}
`

const SubmitWrapper = styled.div`
	display: grid;
	gap: 10px;
	margin: 0 auto;
	height: fit-content;
	& * {
		margin: 0 auto;
		width: fit-content;
	}
	& div {
		display: grid;
		grid-template-columns: 1fr 1fr;
		height: fit-content;
		gap: 10px;
	}
`

const Seperator = styled.div`
	height: 3%;
	width: 100%;
`

const Moveit = keyframes`
0% { transform:  scale3d(0.96,0.96,1); }
30% { transform:  scale3d(1.08,1.08,1);  }
100% { transform:  scale3d(1,1,1);  }


`

const Moveitback = keyframes`
100% { transform:  scale3d(0.96,0.96,1); }

`

const DefaultImage = styled.div`
	border-radius: 2rem;
	width: fit-content;
	height: 100%;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	& svg {
		width: 80%;
		height: 80%;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 71;
		stroke: rgba(0, 0, 0, 0.3);
		fill: none;
		animation: ${Moveitback} 400ms ease forwards;
		transition: stroke 0.2s ease-out;
		stroke-dasharray: 71;
	}
	&:hover {
		& svg {
			stroke: rgba(0, 0, 0, 1);
			animation: ${Moveit} 300ms ease forwards;
		}
	}
`
