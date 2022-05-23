import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	login: false,
	text: ''
}

const commonSlice = createSlice({
	name: 'common',
	initialState,
	reducers: {
		setLoginState: (state, { payload }) => {
			state.login = payload
		},
		setText: (state, { payload }) => {
			state.text = payload
		}
	}
})

export const { setLoginState, setText } = commonSlice.actions
export default commonSlice.reducer
