import React from 'react'
import PropTypes from 'prop-types'

// Material components
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import FontAwesome from 'react-fontawesome'

import themeStyles from './content-footer.theme.style'

const ContentFooter = props => {
  const { classes, ...other } = props

  return (
    <AppBar color="default" position="static" {...other} style={{display: 'none'}}>
      <Toolbar>
        <Typography
          variant="title"
          color="inherit"
          noWrap
        >
          <small>Copyright&copy; 2019 Mongddang Company all rights reserved.</small>
        </Typography>
        <span className="portal-flex" />
        <FontAwesome name="facebook" className={classes.coloredIcon} />
        <FontAwesome name="twitter" className={classes.coloredIcon} />
      </Toolbar>
    </AppBar>
  )
}

ContentFooter.propTypes = {
  classes: PropTypes.shape({}).isRequired
}

export default withStyles(themeStyles)(ContentFooter)
