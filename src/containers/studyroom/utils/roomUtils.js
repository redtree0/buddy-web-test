import { Store } from 'react-notifications-component'
import { useDispatch } from 'react-redux'
import axios from '../../../wrapper/axios'

export const alertMessage = (title, message, type, duration) => {
	Store.addNotification({
		title: title,
		message: message,
		type: type,
		insert: 'top',
		container: 'top-center',
		animationIn: ['animated', 'fadeIn'],
		animationOut: ['animated', 'fadeOut'],
		dismiss: { duration: duration },
		dismissable: { click: true }
	})
}

export const onSaveData = async ({ errors, rooms, placeKey }, navigate) => {
	const keys = Object.keys(errors || {})
	if (keys.length) {
		alertMessage('알림', errors[keys[0]].message, 'danger', 3000)
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
		for (let i = 1; i <= 5; i++) {
			if (room.images[i]) {
				room[`imgUrl${i}`] = room.images[i]
			} else {
				room[`imgUrl${i}`] = null
			}
		}
		return room
	})

	// await axios
	// 	.post('/room/' + placeKey, [...newRooms])
	// 	.then(function (res) {
	// 		if (res.data.result === 'success') {
	// 			// hasChangess = false
	// 			alertMessage('알림', '저장되었습니다.', 'success')
	// 			setTimeout(() => navigate('../room'), 500)
	// 		}
	// 	})
	// 	.catch(function (error) {
	// 		alertMessage('에러', error.message, 'danger')
	// 		console.error(error)
	// 	})
}

export const convertURLtoFile = async (image) => {
	const { url, type, name } = image
	const response = await fetch(url)
	const data = await response.blob()
	return new File([data], name, { type })
}

export const roomImageParse = async (room, placeKey) => {
	const newImages = room.images.filter((item) => {
		const { url = '' } = item
		return url.startsWith('blob')
	})
	const fetchImages = newImages.map(async (image) => {
		const file = await convertURLtoFile(image)

		const formData = new FormData()
		formData.append('file', file)
		formData.append('placeKey', placeKey)
		return axios.post('/image/upload', formData)
	})
	return await Promise.all(fetchImages).then((res) => {
		const result = res.map(({ data }) => data.url)
		const oldImages = room.images
			.filter((item) => {
				const { url = '' } = item
				return !url.startsWith('blob')
			})
			.map((m) => m.url)
		return [...oldImages, ...result]
	})
}
