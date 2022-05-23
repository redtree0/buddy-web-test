import React from 'react'
import PropTypes from 'prop-types'
import rtl from 'jss-rtl'
import { create } from 'jss'
import { JssProvider } from 'react-jss'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { MuiThemeProvider, createMuiTheme, createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import Routes from './routes'
import jwt_decode from 'jwt-decode'

const jss = create({ plugins: [...jssPreset().plugins, rtl()] })
const generateClassName = createGenerateClassName()

class App extends React.Component {
	constructor(props) {
		super(props)

		this.props.history.listen((location, action) => {
			const token = localStorage.getItem('access_token')

			if (token) {
				const payload = jwt_decode(token)
				const { id, seq, permission } = payload

				const dataset = {
					manager_id: id,
					manager_seq: seq,
					manager_permission: permission
				}

				sessionStorage.setItem('manager_id', dataset.manager_id)
				sessionStorage.setItem('manager_seq', dataset.manager_seq)
				sessionStorage.setItem('manager_permission', dataset.manager_permission)
			}
		})
	}

	componentWillReceiveProps(nextProps) {
		if (document.body) {
			document.body.dir = nextProps.themeConfig.contentTheme.direction
		}
	}

	render() {
		const childProps = {}
		const { themeConfig, layoutConfig } = this.props

		sessionStorage.setItem(
			'portalData',
			JSON.stringify({
				theme: {
					...themeConfig
				},
				layout: {
					...layoutConfig
				}
			})
		)

		const materialTheme = createMuiTheme(themeConfig.contentTheme)

		return (
			<JssProvider jss={jss} generateClassName={generateClassName}>
				<MuiThemeProvider theme={materialTheme}>
					<Routes childProps={childProps} layout={layoutConfig} />
				</MuiThemeProvider>
			</JssProvider>
		)
	}
}

function mapStateToProps(state) {
	return {
		themeConfig: state.theme,
		layoutConfig: state.layout
	}
}

App.propTypes = {
	themeConfig: PropTypes.shape({
		contentTheme: PropTypes.shape({
			direction: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	layoutConfig: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(App)
