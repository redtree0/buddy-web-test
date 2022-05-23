import { Button, MenuItem, TextField } from '@material-ui/core'
import CircleLoader from 'components/CircleLoader'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'
import { getList } from './libs/utils'
import {
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
} from './Settlement.styled'

function Settlement() {
	const [loading, setLoading] = useState(true)
	const [startDate, setStartDate] = useState(moment().subtract(1, 'months').set('date', 1).format('YYYY-MM-DD'))
	const [data, setDate] = useState()
	const fetch = async () => {
		setLoading(true)
		const result = await getList(startDate)
		setDate(result)
		setLoading(false)
	}

	// const alertMessage = (title, message, type) => {
	// 	Store.addNotification({
	// 		title: title,
	// 		message: message,
	// 		type: type,
	// 		insert: 'top',
	// 		container: 'top-center',
	// 		animationIn: ['animated', 'fadeIn'],
	// 		animationOut: ['animated', 'fadeOut'],
	// 		dismiss: { duration: 3000 },
	// 		dismissable: { click: true }
	// 	})
	// }

	useEffect(() => {
		fetch()
	}, [])
	return loading ? (
		<CircleLoader />
	) : (
		<SettleWrapper>
			<ReactNotifications />
			<SettleSection className="row">
				<div className="col-md-9">
					<h4>정산 안내</h4>
					<span>
						<Notice>
							해당 기간의 수익은 계산서 발행분에 한해 정산일로부터 영업일 기준 5일 뒤에 설정하신 계좌로 지급드립니다.
						</Notice>
						<Notice>
							자동정산 후
							<a href="https://www.barobill.co.kr/" target="_blank">
								바로빌
							</a>
							을 통해 세금계산서를 역발행 드리며, 승인요청 메일이 전송됩니다.
						</Notice>
						<Notice>승인완료된 계산서 기준으로 지급되오니, 발행된 계산서를 확인하시고 꼭 승인처리 해주세요.</Notice>
						<Notice>※ 서비스, 현장결제 금액은 정산에 포함되지 않습니다.</Notice>
						<Notice>※ 정산내역은 합계금액일 뿐이므로 상세한 내용은 매출 메뉴를 참고 바랍니다.</Notice>
					</span>
				</div>
			</SettleSection>

			{!data.periodList || !data.periodList.length ? (
				<div style={{ marginTop: '40px' }}>아직 정산할 내역이 없습니다.</div>
			) : (
				<PeriodContainer className="row">
					<div className={'col-md-12'} style={{ padding: '0px' }}>
						<PeriodTitle>
							<p>{data.period || '' + ' 정산내역'}</p>
						</PeriodTitle>
						<div style={{ float: 'right', marginBottom: '8px' }}>
							<TextField select value={startDate} onChange={(e) => setStartDate(e.target.value)}>
								{data.periodList.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
							<Button variant="outlined" color="default" style={{ marginLeft: '8px' }} onClick={fetch}>
								조회
							</Button>
						</div>
					</div>
					<IncomeWrapper className="col-md-6">
						<div className={'col-md-12'} style={{ whith: '100%' }}>
							{data.incomeDetail.map((el, idx) => {
								return el.totalPrice ? (
									<IncomeList key={idx}>
										<IncomeListContent>
											{el.type == 'refund' ? '(환불) ' : el.type == 'cancel' ? '(취소) ' : ''}
											{el.productName}
											{'   :: ' + el.count + '건'}
											{el.productName == '실시간이용권' ? '' : ' X ' + el.unitPrice.toLocaleString() + '원'}
										</IncomeListContent>
										<TotalPrice isRight>{el.totalPrice.toLocaleString() + '원'}</TotalPrice>
									</IncomeList>
								) : (
									''
								)
							})}
							<SeperateLine />
							<IncomeList>
								<IncomeText>수익</IncomeText>
								<TotalPrice isRight>
									{data.incomeData?.incomeTotal ? data.incomeData.incomeTotal.toLocaleString() + '원' : '-'}
								</TotalPrice>
							</IncomeList>
							<hr />
							{data.incomeData.feePaymentRate && (
								<IncomeList>
									<IncomeText>{`PG사 결제수수료 ${data.incomeData.feePaymentRate}%`}</IncomeText>
									<TotalPrice isRight>
										{data.incomeData.feePayment ? data.incomeData.feePayment.toLocaleString() + '원' : '-'}
									</TotalPrice>
								</IncomeList>
							)}

							<IncomeList>
								<IncomeListContent>{`스터디모아 이용수수료 ${
									data.incomeData.feeSalesRate && data.incomeData.feeSalesRate > 0
										? data.incomeData.feeSalesRate + '%'
										: ''
								}`}</IncomeListContent>
								<TotalPrice isRight>
									{data.incomeData.feeSales ? data.incomeData.feeSales.toLocaleString() + '원' : '0원 (면제)'}
								</TotalPrice>
							</IncomeList>

							{data.incomeData.costMsgPerUnit && (
								<IncomeList>
									<IncomeText>{`알림톡 수수료 ${data.incomeData.countMsg}건 x ${data.incomeData.costMsgPerUnit}원/건`}</IncomeText>
									<TotalPrice isRight>
										{data.incomeData.costMsg ? data.incomeData.costMsg.toLocaleString() + '원' : '-'}
									</TotalPrice>
								</IncomeList>
							)}
							<SeperateLine />
							<IncomeList>
								<IncomeText>비용</IncomeText>
								<TotalPrice isRight>
									{data.incomeData.costAmount ? data.incomeData.costAmount.toLocaleString() + '원' : '-'}
								</TotalPrice>
							</IncomeList>
							<hr />
						</div>
					</IncomeWrapper>
					<div className={'col-md-6'}>
						<SummaryContainer className="col-md-12">
							<SummaryText>
								<InlineP>수익</InlineP>
								<TextSub> (VAT 포함)</TextSub>
								<TotalPrice isRight>
									+ {data.incomeData.incomeTotal ? data.incomeData.incomeTotal.toLocaleString() + '원' : '없음'}
								</TotalPrice>
							</SummaryText>
							{data.incomeData.place && data.incomeData.place.taxPayer == '2' && (
								<TextSub style={{ display: 'flex', justifyContent: 'space-between' }}>
									<InlineP>간이과세자 세액 공제</InlineP>
									<InlineP>
										- {data.incomeData.incomeVat ? <s>{data.incomeData.incomeVat.toLocaleString()}원</s> : '없음'}
									</InlineP>
								</TextSub>
							)}
							<SummaryText>
								<InlineP>비용</InlineP>
								<TotalPrice isRight>
									- {data.incomeData.costAmount ? data.incomeData.costAmount.toLocaleString() + '원' : '없음'}
								</TotalPrice>
							</SummaryText>
							<TextSub style={{ display: 'flex', justifyContent: 'space-between' }}>
								<InlineP>비용 VAT</InlineP>
								<InlineP>- {data.incomeData.costVat ? data.incomeData.costVat.toLocaleString() + '원' : '없음'}</InlineP>
							</TextSub>
							<SeperateLine />

							<SummaryText>
								<InlineP>정산이체금액</InlineP>
								<TotalPrice isRight>
									{data.incomeData.transferAmount ? data.incomeData.transferAmount.toLocaleString() + '원' : '-'}
								</TotalPrice>
							</SummaryText>
						</SummaryContainer>

						<BillContent>
							<InlineBlue>
								{data.incomeData.transferDate ? moment(data.incomeData.transferDate).format('YYYY년 M월 D일') : ''}
								{data.incomeData.transferStatus == 'paid'
									? '지급완료'
									: data.incomeData.transferStatus == 'ready'
									? '지급 대기중'
									: data.incomeData.transferStatus == 'billed'
									? '세금계산서 승인 전'
									: data.incomeData.transferStatus == 'wait'
									? data.incomeData.place.taxPayer == '2'
										? '현금영수증 발급 대기중'
										: '세금계산서 발급 대기중'
									: data.incomeData.transferStatus == 'deny'
									? '지급이 거절되었습니다. 관리자에게 문의주시기 바랍니다.'
									: '미정산'}
							</InlineBlue>
						</BillContent>

						{data.incomeData.transferStatus == 'wait' && data.incomeData.place.taxPayer == '2' && (
							<SummaryContainer
								className={'col-md-12'}
								style={{ display: 'inline-block', width: '100%', background: '#f6f6f6' }}
							>
								<SummaryText>
									<InlineP>현금영수증 발행금액</InlineP>
								</SummaryText>
								<SummaryText>
									<InlineP>{'총 거래금액'}</InlineP>
									<InlineP>{data.incomeTotal ? data.incomeTotal.toLocaleString() + '원' : '-'}</InlineP>
								</SummaryText>
							</SummaryContainer>
						)}
						{data.transferStatus == 'wait' && data.place.taxPayer != '2' && (
							<SummaryContainer className={'col-md-12'}>
								<SummaryTextSub>
									<InlineP>{'합계금액'}</InlineP>
									<InlineP>{data.incomeTotal ? data.incomeTotal.toLocaleString() + '원' : '-'}</InlineP>
								</SummaryTextSub>
								<SummaryTextSub>
									<InlineP>{'공급가액'}</InlineP>
									<InlineP>
										{data.incomeTotal && data.incomeVat
											? (data.incomeTotal - data.incomeVat).toLocaleString() + '원'
											: '-'}
									</InlineP>
								</SummaryTextSub>
								<SummaryTextSub>
									<InlineP>부가세</InlineP>
									<InlineP>{data.incomeVat ? data.incomeVat.toLocaleString() + '원' : '-'}</InlineP>
								</SummaryTextSub>
							</SummaryContainer>
						)}
					</div>
				</PeriodContainer>
			)}

			{/* <div className="hidden_">
				<BankSetDialog onClose={this.closeEvent} />
			</div> */}
		</SettleWrapper>
	)
}

export default Settlement
