import styled from 'styled-components'

const Wrapper = styled.div`
	color: rgba(0, 0, 0, 0.87);
	font-size: 0.8125rem;
	font-weight: 400;
`

const Tables = styled.div`
	min-width: ${(props) => (props.isMobile ? '100%' : props.isDesk ? '650px' : '400px')};
	margin: ${(props) => (props.isMobile ? null : '10px')};
`

export { Wrapper, Tables }
