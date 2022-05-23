import { configureStore } from '@reduxjs/toolkit'
import portalApp from './reducers'
import jwt_decode from 'jwt-decode'
import themeReducer from './reducers/theme.reducer'
import layoutReducer from './reducers/layout.reducer'
import roomReducer from './reducers/room.reducer'

const isDev = false && process.env.NODE_ENV === 'development' // 비활성화
const preloadedState = window.PRELOADED_STATE

const middleware = (store) => (next) => (action) => {
	const token = localStorage.getItem('access_token')

	if (token) {
		const payload = jwt_decode(token)
		const { id, seq, permission } = payload

		const dataset = isDev
			? {
					manager_id: btoa(id),
					manager_seq: btoa(seq),
					manager_permission: btoa(permission)
			  }
			: {
					manager_id: id,
					manager_seq: seq,
					manager_permission: permission
			  }

		sessionStorage.setItem('manager_id', dataset.manager_id)
		sessionStorage.setItem('manager_seq', dataset.manager_seq)
		sessionStorage.setItem('manager_permission', dataset.manager_permission)
	}

	//로그인 여부 체크
	if (sessionStorage.getItem('manager_seq') === '' || sessionStorage.getItem('manager_seq') === null) {
		window.location.href = '/login'
		return
	}

	const result = next(action) // 다음 미들웨어 (또는 리듀서) 에게 액션을
	return result // 여기서 반환하는 값은 dispatch(action)의 결과물이 됩니다.
}

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		layout: layoutReducer,
		rooms: roomReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
	devTools: isDev,
	preloadedState
})
