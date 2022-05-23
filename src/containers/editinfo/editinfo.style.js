const styles = theme => ({
  portalDashboardPageWrapper: {
    padding: 16,
    minHeight: '100%',
    boxSizing: 'border-box'
  },
  portalWidget: {
    flex: '1 1 100%',
    display: 'flex',
    flexDirection: 'column'
  },
  portalWidgetHeading: {
    textTransform: 'uppercase',
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftStyle: 'solid',
    marginTop: 16,
    marginBottom: 16,
    '&:after': {
      content: '""',
      width: 2,
      height: '0%',
      position: 'absolute',
      bottom: 0,
      left: -2,
      transition: 'height .5s'
    }
  },
  portalWidgetContent: {
    flex: '1 1 100%'
  },
  card: {
    minWidth: 100,
    minHeight: 200
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary
  }
});

export default styles;
