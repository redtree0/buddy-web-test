import styled from 'styled-components'
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent).mobile()

const InlineP = styled.span`
	display: inline-block;
	margin: 4px 0;
`

const marginMdDiv = styled.div`
	margin: ${md ? '0' : null};
`

const SettleWrapper = styled.div`
	padding: ${md ? '2%' : '5%'};
	min-width: ${md ? '10%' : '400px'};
	max-width: 1280px;
`

const SettleSection = styled(marginMdDiv)`
	width: 100%;
	min-height: 160px;
	vertical-align: middle;
	background-color: white;
	border: 2px solid #dddddd;
	border-radius: 12px;
	padding: 20px 20px;
`

const Notice = styled.span`
	margin: 0 0 4px;
	font-size: 12px;
`

const PeriodContainer = styled(marginMdDiv)`
	background: white;
	border: 2px solid #dddddd;
	width: 100%;
	padding: 20px;
	margin-top: 20px;
	border-radius: 12px;
`

const PeriodTitle = styled.span`
	display: block;
	text-align: left;
	margin: 10px;
	font-size: 18px;
	font-weight: 500;
`

const IncomeWrapper = styled.div`
	display: inline-block;
	width: ${md ? '100%' : null};
	padding: ${md ? '0' : null};
`

const IncomeList = styled.span`
	display: block;
	margin-top: 6px;
	margin-bottom: 6px;
`

const IncomeListContent = styled(InlineP)`
	word-break: keep-all;
	width: ${md ? '190px' : null};
`

const TotalPrice = styled(InlineP)`
	width: ${md ? '100px' : null};
	position: ${md ? 'absolute' : null};
	text-align: ${md ? 'right' : null};
	${(props) => (props.isRight ? 'float : right;' : null)}
`

const SeperateLine = styled.div`
	height: 1px;
	background: black;
	margin-bottom: 10px;
`

const IncomeText = styled(InlineP)`
	width: ${md ? '190px' : null};
`

const SummaryContainer = styled.div`
	display: inline-block;
	width: 100%;
	background: #f6f6f6;
`

const SummaryText = styled.span`
	display: block;
	text-align: left;
	margin-top: 8px;
	font-size: 16px;
	font-weight: 500;
`

const TextSub = styled(InlineP)`
	text-align: left;
	margin-top: 4px;
	font-size: 12px;
	font-weight: 500;
`

const BillContent = styled.span`
	display: inline-block;
	width: 100%;
	text-align: center;
	margin-top: 6px;
	margin-bottom: 10px;
	font-size: 16px;
	font-weight: 600;
`

const InlineBlue = styled(InlineP)`
	color: #154ee9;
	text-decoration: underline;
`

export {
	SettleWrapper,
	SettleSection,
	Notice,
	PeriodContainer,
	PeriodTitle,
	IncomeWrapper,
	IncomeList,
	IncomeListContent,
	TotalPrice,
	SeperateLine,
	IncomeText,
	SummaryContainer,
	SummaryText,
	InlineP,
	TextSub,
	BillContent,
	InlineBlue
}
