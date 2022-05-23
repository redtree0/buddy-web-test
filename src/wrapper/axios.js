/**
 * Axios Request Wrapper
 * ---------------------
 *
 * @author  Wonjun Hwang
 *
 */

import axios from 'axios'

/**
 * Create an Axios Client with defaults
 */
const client = axios.create({
	baseURL: process.env.REACT_APP_STUDY_MOA_API_URL,
	headers: {
		'Access-Control-Allow-Origin': 'http://studymoa.me',
		access_token: localStorage.getItem('access_token')
	}
})

export default client
