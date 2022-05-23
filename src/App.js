import { createGenerateClassName, createMuiTheme, jssPreset, MuiThemeProvider } from '@material-ui/core'
import { create } from 'jss'
import jssRTL from 'jss-rtl'
import React, { useEffect } from 'react'
import { JssProvider } from 'react-jss'
import { connect, useSelector } from 'react-redux'
import Routes from './routes'

const jss = create({ plugins: [...jssPreset().plugins, jssRTL()] })
const generateClassName = createGenerateClassName()

const App = (props) => {
	// useEffect(() => {
	// 	if (document.body) {
	// 		document.body.dir = props.themeConfig.contentTheme.direction
	// 	}
	// }, [props.themeConfig])
	const themes = useSelector((state) => state)
	const { themeConfig, layoutConfig } = props
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
				<Routes childProps={{}} layout={layoutConfig} />
			</MuiThemeProvider>
		</JssProvider>
	)
}

function mapStateToProps(state) {
	return {
		themeConfig: state.theme,
		layoutConfig: state.layout
	}
}

export default connect(mapStateToProps)(App)
// export default App
