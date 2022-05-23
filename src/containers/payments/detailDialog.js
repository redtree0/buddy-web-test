import React from 'react'
import CustomDialog from '../../wrapper/CustomDialog'
import { withStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { InsertButton } from 'react-bootstrap-table'
import classNames from 'classnames'
import CloseIcon from '../sales/images/closeIcon.png'
import MobileDetect from 'mobile-detect'

const styles = theme => ({
	sapnStyle: {
		borderBottom: 'solid 1px #d8d8d8',
		marginBottom: '14px'
	}
})

const md = new MobileDetect(window.navigator.userAgent)

class DetailDialog extends React.Component {
	constructor(props) {
		super(props)
		this.customDialog = React.createRef()
		this.state = {
			stateDialogReweighing: false
		}
	}

	openDialogReweighing = () => {
		this.setState({ stateDialogReweighing: true })
	}

	closeDialogReweighing = () => {
		this.customDialog.handleClose()
	}

	render() {
		const { classes, detailData: data = {} } = this.props
		return (
			<div>
				<CustomDialog
					className={'detailDialog'}
					callbackFunction={this.openDialogReweighing}
					dialogButton={<InsertButton id="detailDialog_btn" btnText="상세보기" btnContextual="btn-warning" className="hidden_" />}
					innerRef={ref => (this.customDialog = ref)}
					maxWidth={'md'}
					aria-labelledby="event-dialog"
				>
					<DialogContent style={{ paddingTop: '0px', paddingBottom: '0px', padding: md.mobile() ? '0px' : '0 24px 24px' }}>
						<img src={CloseIcon} className="dialogCancle" onClick={this.closeDialogReweighing} alt="" />

						<div className={'row'} style={{ width: md.mobile() ? '100%' : '800px', margin: md.mobile() ? '0' : null }}>
							<span className={classNames('col-md-2', classes.sapnStyle)} style={{ fontWeight: '800' }}>
								merchant_uid
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ wordBreak: 'break-word' }}>
								{data && (data.merchant_uid || ' ')}
							</span>
						</div>
						<div className={'row'} style={{ width: md.mobile() ? '100%' : '800px', margin: md.mobile() ? '0' : null }}>
							<span className={classNames('col-md-2', classes.sapnStyle)} style={{ fontWeight: '800' }}>
								pg_id
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ wordBreak: 'break-word' }}>
								{data && (data.pg_id || data.pg_tid || ' ')}
							</span>
							<span className={classNames('col-md-2', classes.sapnStyle)} style={{ fontWeight: '800' }}>
								imp_uid
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ wordBreak: 'break-word' }}>
								{data && (data.imp_uid || ' ')}
							</span>
						</div>
						<div className={'row'} style={{ width: md.mobile() ? '100%' : '800px', margin: md.mobile() ? '0' : null }}>
							<span className={classNames('col-md-2', classes.sapnStyle)} style={{ fontWeight: '800' }}>
								카드승인
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ wordBreak: 'break-word' }}>
								{data && (data.card_apply_num || ' ')}
							</span>
							<span className={classNames('col-md-2', classes.sapnStyle)} style={{ fontWeight: '800' }}>
								가상계좌
							</span>
							<span className={classNames('col-md-4', classes.sapnStyle)} style={{ wordBreak: 'break-word' }}>
								{data && `${data.vbank_name || ''} ${data.vbank_num || ' '}`}
							</span>
						</div>
						<div className={'row'} style={{ width: md.mobile() ? '100%' : '800px', margin: md.mobile() ? '0' : '20px' }}>
							<pre>{data && JSON.parse(data.raw)}</pre>
						</div>
					</DialogContent>
				</CustomDialog>
			</div>
		)
	}
}

export default withStyles(styles)(DetailDialog)
