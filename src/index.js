import React from 'react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
// import App from './app.component'
import App from 'App'

import { Provider } from 'react-redux'
import portalApp from './reducers'
import registerServiceWorker from './registerServiceWorker'
import WebFont from 'webfontloader'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import jwt_decode from 'jwt-decode'
import { QueryClient, QueryClientProvider } from 'react-query'
import { configureStore } from '@reduxjs/toolkit'

WebFont.load({
	google: {
		families: ['Barlow:300,400,400i,500,600,700']
	}
})

// Extract initial redux state received from the server
const preloadedState = window.PRELOADED_STATE
delete window.PRELOADED_STATE

const encodedLists = ['manager_id', 'manager_seq', 'manager_permission']
const _getItem = window.sessionStorage.getItem
const isDev = false && process.env.NODE_ENV === 'development' // 비활성화

window.sessionStorage.getItem = function (key) {
	if (encodedLists.includes(key) && isDev) {
		try {
			const encoded = _getItem.call(this, key)
			const decoded = atob(encoded)
			return decoded
		} catch (err) {
			console.error(err)
			return _getItem.call(this, key)
		}
	}
	return _getItem.call(this, key)
}

// https://medium.com/@cute_mustard_sardine_17/리덕스-미들웨어-redux-middleware-만들어보기-4fe4ddf5d5d4

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
	if (localStorage.getItem('manager_place') === '' || localStorage.getItem('manager_place') === null) {
		window.location.href = '/login'
		return
	}

	const result = next(action) // 다음 미들웨어 (또는 리듀서) 에게 액션을
	return result // 여기서 반환하는 값은 dispatch(action)의 결과물이 됩니다.
}

// const store = createStore(portalApp, preloadedState, applyMiddleware(middleware))
const store = configureStore({
	reducer: portalApp,
	preloadedState,
	middleware: (getDefaultMiddleware) => [middleware, ...getDefaultMiddleware({ serializableCheck: false })],
	devTools: isDev
})

const queryClient = new QueryClient()

const root = createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		<QueryClientProvider client={queryClient}>
			<Router>
				<App />
			</Router>
		</QueryClientProvider>
	</Provider>
)
registerServiceWorker()
