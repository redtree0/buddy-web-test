import React from 'react'
const { useNavigate, useLocation } = require('react-router-dom')

export const MemberRoute = (Component) => {
	const Wrapper = (props) => {
		const navigate = useNavigate()
		const location = useLocation()
		return <Component navigate={navigate} location={location} />
	}
	return Wrapper
}

// function MemberRoute(Component) {
// 	const navigate = useNavigate()
// 	const location = useLocation()
// 	return class extends React.Component {
// 		render() {
// 			return <Component />
// 		}
// 	}
// }

// export default MemberRoute
