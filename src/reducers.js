import { combineReducers } from 'redux'

import themeReducer from './reducers/theme.reducer'
import layoutReducer from './reducers/layout.reducer'
import roomReducer from 'reducers/room.reducer'
import commonReducer from 'reducers/common.reducer'

// Combine with other reducers we may add in the future
const todoApp = combineReducers({
	theme: themeReducer,
	layout: layoutReducer,
	rooms: roomReducer,
	common: commonReducer
})

export default todoApp
