import styled from 'styled-components'
const PortalDashboardPageWrapper = styled.div`
	padding: 30px;
	min-height: 100%;
	box-sizing: border-box;
`

const InputWrapper = styled.div`
	width: 100%;
	display: inline-block;
`
const InputTitle = styled.span`
	display: inline-block;
	width: ${(props) => (props.admin ? '130px' : '100px')};
	text-align: left;
	margin-top: 20px;
`
const InputValue = styled.span`
	display: inline-block;
`

export { PortalDashboardPageWrapper, InputWrapper, InputTitle, InputValue }

// {
//   "seq": 5,
//   "key": "PLV0vIiRKD",
//   "name": "테스트 스터디카페",
//   "placeType": "office",
//   "operatingTime": "06시~24시 연중무휴",
//   "phone": "01032533919",
//   "kakaoId": "_glxhxcT",
//   "postcode": "07222",
//   "state": "영등포구",
//   "city": "서울",
//   "addr1": "양평로12가길 14",
//   "addr2": "5층",
//   "longitude": "126.899642805917",
//   "latitude": "37.5367472734419",
//   "ceoName": "박치원",
//   "bizRegNum": null,
//   "bizEmail": null,
//   "bankCode": "032",
//   "bankName": "부산은행",
//   "depositor": "aaa",
//   "accountNum": "1111",
//   "feeType": "rate",
//   "feeRate": "0.00",
//   "feeFixedAmount": 0,
//   "service1": true,
//   "service2": false,
//   "service3": true,
//   "service4": false,
//   "useCoupon": false,
//   "option1": true,
//   "option2": true,
//   "option3": false,
//   "option4": false,
//   "option5": true,
//   "option6": false,
//   "option7": true,
//   "option8": false,
//   "option9": true,
//   "option10": false,
//   "option11": true,
//   "option12": true,
//   "rating": 0,
//   "isPublic": false,
//   "isOpen": true,
//   "isLive": true,
//   "guides": "",
//   "buyerInfo": "",
//   "pwGate": "1234",
//   "pwToilet": "333322211",
//   "pwWifi": "qwer12341234",
//   "imgUrl1": "https://studymoa-place.s3.ap-northeast-2.amazonaws.com/PLV0vIiRKD_20200807105451",
//   "imgUrl2": null,
//   "imgUrl3": null,
//   "imgUrl4": null,
//   "imgUrl5": null,
//   "imgUrl6": null,
//   "imgUrl7": null,
//   "imgUrl8": null,
//   "imgUrl9": null,
//   "imgUrl10": null,
//   "bizType": "도소매업",
//   "bizClass": "중개업",
//   "companyName": "studymoa",
//   "taxPayer": "2",
//   "incomePeriodDays": "31",
//   "managerSeq": 29,
//   "managerId": "teststudy",
//   "managerPW": "bb8383aa057d760281ad2fc6c12d3da1355a9403d843a6da00668dfb0b102053",
//   "managerNm": "박치원",
//   "managerNum": "01032533919",
//   "managerEmail": "lordweasel@naver.com",
//   "contactId": "studymoa",
//   "notice": null,
//   "imageUrls": [
//       "https://studymoa-place.s3.ap-northeast-2.amazonaws.com/PLV0vIiRKD_20200807105451"
//   ]
// }
