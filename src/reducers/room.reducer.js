import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { alertMessage, roomImageParse } from 'containers/studyroom/utils/roomUtils'
import axios from '../wrapper/axios'
const today = new Date(),
	month = today.getMonth() + 1,
	year = today.getFullYear(),
	date = today.getDate(),
	days = ['일', '월', '화', '수', '목', '금', '토'],
	getToday = year + '-' + (String(month).length < 2 ? '0' + month : month) + '-' + (String(date).length < 2 ? '0' + date : date)

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async ({ placeSeq, year, month }) => {
	const res = await axios.get(`/room/${placeSeq}/usage/${year}/${month}`)
	return res.data.rooms
})

export const postNewRooms = createAsyncThunk('rooms/postNewRooms', async ({ errors, rooms, placeKey, navigate }) => {
	const keys = Object.keys(errors || {})
	if (keys.length) {
		alertMessage('알림', errors[keys[0]].message, 'danger', 4000)
		errors[keys[0]].ref.focus()
		return
	}
	const urlToBlobImages = await Promise.all(
		rooms.map(async (room) => {
			return await roomImageParse(room, placeKey).then((images) => {
				return { ...room, images: [...images] }
			})
		})
	).then((res) => {
		return res
	})
	const newRooms = urlToBlobImages.map((room) => {
		for (let i = 0; i < 5; i++) {
			if (room.images[i]) {
				room[`imgUrl${i + 1}`] = room.images[i]
			} else {
				room[`imgUrl${i + 1}`] = null
			}
		}
		return room
	})

	await axios
		.post('/room/' + placeKey, [...newRooms])
		.then(function (res) {
			if (res.data.result === 'success') {
				alertMessage('알림', '저장되었습니다.', 'success')
				setTimeout(() => navigate('../room'), 1000)
			}
		})
		.catch(function (error) {
			alertMessage('에러', error.message, 'danger')
			console.error(error)
		})
})

const setImage = (rooms) =>
	rooms.map((room, idx) => {
		for (let i = 1; i <= 5; i++) {
			room.images = room.images ?? []
			const img = {
				url: room[`imgUrl${i}`]
			}
			if (img.url === null) {
				break
			}
			room.images = [...room.images, img]
		}
		return room
	})

const initialState = {
	rooms: null,
	roomsChange: null,
	hasChanges: false,
	isLoading: false,
	errors: {},
	today,
	month,
	year,
	date,
	days,
	getToday
}

const roomSlice = createSlice({
	name: 'rooms',
	initialState,
	reducers: {
		getRooms(state) {
			return state.rooms
		},
		insertImage: (state, { payload }) => {
			const files = payload.files
			const filesArray = []
			const targetRoom = state.rooms.find((room) => room.key === payload.key)
			for (let i = 0; i < files.length; i++) {
				if (!files[i].name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
					alertMessage('알림', '이미지 파일만 등록 가능합니다.', 'danger', 3000)
					// state.errors = { ...state.errors, fileError: { type: 'filesType', message: '이미지 파일만 등록 가능합니다.' } }
					return
				}
			}
			if (targetRoom.images.length + files.length > 5) {
				alertMessage('이미지가 너무 많습니다.', '최대 5개 까지 등록 가능합니다.', 'danger', 3000)
				// state.errors = { ...state.errors, fileError: { type: 'filesLength', message: '최대 5개 까지 등록 가능합니다.' } }
				return
			}
			for (let i = 0; i < files.length; i++) {
				const url = URL.createObjectURL(files[i])
				const blobObj = {
					url,
					name: payload.files[i].name,
					type: payload.files[i].type
				}

				filesArray.push(blobObj)
			}
			state.rooms.map((room) => {
				if (room.key === payload.key) {
					room.images.push(...filesArray)
				}
				return room
			})
		},
		setRooms: (state, { payload }) => {
			const roomsData = setImage(payload)
			state.rooms = roomsData
		},
		addRooms: (state, { payload }) => {
			state.rooms.push(payload)
			state.hasChanges = true
		},
		deleteRooms: (state, { payload }) => {
			const result = state.rooms.map((room, idx) => {
				if (idx === payload) {
					room.isLive = false
				}
				return room
			})
			state.rooms = result
			state.hasChanges = true
			// state.rooms = state.rooms.filter((room) => room.key !== payload)
		},
		deleteImage: (state, { payload }) => {
			state.rooms[payload.idx].images = state.rooms[payload.idx].images.filter((image) => image.url !== payload.url)
			state.hasChanges = true
		},
		roomInputChange: (state, { payload }) => {
			state.roomsChange[payload.key] = { key: payload.key, room: payload }
		},
		prevDate: (state, action) => {
			const { today } = state
			state.today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
			state.month = today.getMonth() + 1
			state.year = today.getFullYear()
		},
		handleRoomInputClick: (state, { payload: { type, value, idx } }) => {
			state.rooms[idx][type] = value
			state.hasChanges = true
		},
		setErrors: (state, { payload }) => {
			state.errors = { ...payload }
		}
	},

	extraReducers: {
		[fetchRooms.pending]: (state, action) => {
			state.isLoading = true
		},
		[fetchRooms.fulfilled]: (state, action) => {
			const roomsData = setImage(action.payload)
			state.rooms = roomsData
			state.isLoading = false
		},
		[fetchRooms.rejected]: (state, action) => {
			state.isLoading = false
		},
		[postNewRooms.pending]: (state, action) => {
			state.isLoading = true
		},
		[postNewRooms.fulfilled]: (state, action) => {
			state.isLoading = false
		},
		[postNewRooms.rejected]: (state, action) => {
			state.isLoading = false
		}
	}
})

export const { getRooms, setRooms, addRooms, deleteRooms, roomInputChange, insertImage, deleteImage, handleRoomInputClick, setErrors } =
	roomSlice.actions
export default roomSlice.reducer
