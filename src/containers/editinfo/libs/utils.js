import axios from '../../../wrapper/axios'

export const loadData = async (setState) => {
	try {
		const res = await axios.get(`/place/${JSON.parse(localStorage.getItem('manager_place')).seq}`, {})
		let data = res.data
		data.imageUrls = []
		data.imageUrls = [{ id: data.imageUrls.length, url: data.imgUrl1 }]
		if (data.imgUrl1) {
			let cnt = 1
			for (cnt; cnt++; ) {
				const idx = `imgUrl${cnt}`
				if (!data[idx]) {
					break
				}
				data.imageUrls.push({ id: data.imageUrls.length, url: data[idx] })
			}
		}
		if (data !== '' && data) {
			setState((prev) => ({
				...prev,
				...data,
				filesObj: []
			}))
		}
	} catch (error) {
		throw new Error(error)
	}
}

export const fileToObj = (files) => {
	const result = []
	for (let i = 0; i < files.length; i++) {
		result.push()
	}
}

export const postData = async (seq, data) => {
	try {
		const res = await axios.post(`/place/${seq}`, data)
		if (res.status === 200) {
			return true
		} else {
			return false
		}
	} catch (error) {
		throw new Error(error)
	}
}

export const blobToUrl = (image, filesObj, key) => {
	return new Promise((resolve, reject) => {
		if (image.url.includes('blob')) {
			const obj = filesObj.find((m) => m.id === image.id)
			const formData = new FormData()
			formData.append('file', obj.file)
			formData.append('placeKey', key)
			axios.post('/image/upload', formData).then((res) => resolve(res.data.url))
		} else {
			resolve(image.url)
		}
	})
}

export const makePreview = (imgs, idx) => {
	const result = []
	const files = []
	for (let i = 0; i < imgs.length; i++) {
		const url = URL.createObjectURL(imgs[i])
		result.push({ id: idx + i, url })
		files.push({ id: idx + i, file: imgs[i] })
	}
	return [result, files]
}
