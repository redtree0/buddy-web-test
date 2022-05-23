import { CircularProgress } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`

const CircleLoader = () => {
	return (
		<Wrapper>
			<CircularProgress size={50} />
			Loading ...
		</Wrapper>
	)
}

export default CircleLoader
