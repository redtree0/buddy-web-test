import { Card, Grid, Typography } from '@material-ui/core'
import styled from 'styled-components'

const PortalDashboardPageWrapper = styled.div`
	padding: 30px;
	min-height: 100%;
	box-sizing: border-box;
`

const PortalWidget = styled(Grid)`
	flex: 1 1 100%;
	display: flex;
	flex-direction: column;
`

const PortalWidgetHeading = styled(Typography)`
	text-transform: uppercase;
	padding-left: 12px;
	border-left-width: 2px;
	border-left-style: solid;
	margin-top: 16px;
	margin-bottom: 16px;
	&::after {
		content: '';
		width: 2px;
		height: 0%;
		position: absolute;
		bottom: 0;
		left: -2;
		transition: height 0.5s;
	}
`

const DashboardDiv = styled.div`
	height: 32px;
	display: flex;
	vertical-align: middle;

	span:nth-child(1) {
		width: 20%;
		display: inline-block;
		@media (max-width: 800px) {
			p {
				font-size: 0.75rem;
			}
		}
	}

	span:nth-child(2) {
		width: 50%;
		display: inline-block;
		text-align: left;
		@media (max-width: 800px) {
			p {
				font-size: 0.75rem;
			}
		}
	}

	span:nth-child(3) {
		width: 30%;
		display: inline-block;
		@media (max-width: 800px) {
			p {
				font-size: 0.75rem;
			}
		}
	}

	p {
		padding-right: 0px;
	}
`

const SeatCard = styled(Card)`
	text-align: center;
	height: 190px;
	cursor: pointer;
	@media (max-width: 600px) {
		height: auto;
	}
`

export { PortalDashboardPageWrapper, PortalWidget, PortalWidgetHeading, SeatCard, DashboardDiv }
