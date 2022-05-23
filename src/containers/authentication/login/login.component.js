import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import classNames from 'classnames';

import withWidth from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

import themeStyles from './login.theme.style';
import scss from './login.module.scss';

import logoImage from '../../../assets/images/portal-logo.png';

const Login = (props) => {
  const {
    classes,
    width
  } = props;

    // Flip container to column on mobile screens.
  const panelDirection = width === 'xs' ? 'column' : 'row';

  return (
    <Grid
      container
      direction="row"
      spacing={0}
      justify="center"
      alignItems="center"
      className={classes.background}
    >
      <Grid item sm={10} xs={12} className={scss.panel}>
        <Grid direction={panelDirection} className={scss.content_center} container spacing={0}>
          {/* 왼쪽 Box */}
          <Grid item sm={6} xs={12} className={scss.MuiGrid_grid} >
            <Card className={classNames(scss.card, classes['primary-card'])}>
              <CardContent className={scss['signup-content']}>
                <img src={logoImage} className={scss['signup-logo']} alt="logo" />
                <Typography variant="headline" component="h2" gutterBottom>
                                        찬미를 듣는다 그것은 웅대한 관현악이며
                </Typography>
                <Typography component="p" gutterBottom>
                                        것이다 이것은 현저하게 일월과 같은 예가 되려니와 그와 같지 못하다 할지라도 창공에 반짝이는 뭇 별과 같이 산야에 피어나는 군영과 같이 이상은 실로 인간의 부패를 방지
                </Typography>
              </CardContent>
              {/* <CardActions>
                                <Button fullWidth href="/register" color="secondary" variant="raised">Create an account</Button>
                            </CardActions> */}
            </Card>
          </Grid>

          {/* 오른쪽 Box */}
          <Grid item sm={6} xs={12} className={classNames(scss.cardMargin, scss.MuiGrid_grid)}>
            <Card className={scss.card}>
              <CardContent>
                <Typography variant="headline" component="h2" gutterBottom>
                                    스터디모아 관리자 로그인
                </Typography>
                <TextField
                  label="ID"
                  fullWidth
                />
                <TextField
                  label="Password"
                  fullWidth
                  margin="normal"
                  type="password"
                />
              </CardContent>
              <CardActions className={scss['login-actions']}>
                <Button href="/login" color="primary" variant="raised">Login</Button>
                {/* <Button href="/forgot-password">Forgot Password</Button> */}
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
            
      <Grid item sm={6} xs={12} className={classNames(scss.panel, scss.Bottom_grid)}>
        <Card className={scss.card}>
          <div className={scss.div}>
            <img src={logoImage} className={scss['signup-logo']} alt="logo" />
            <CardContent>
              <Typography variant="headline" component="h2" gutterBottom>
                                (주)몽땅컴퍼니 All rights reserved.
              </Typography>                        
              <Typography component="p" gutterBottom>
                                끝에 스며들어 가는 열락의 소리다이것은 피어나기 전인 유소년에게서 구하지 못할
              </Typography>
            </CardContent>
          </div>
        </Card>
        {/* <Card className={classes.card}>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography variant="headline">Live From Space</Typography>
                            <Typography variant="subheading" color="textSecondary">
                            Mac Miller
                            </Typography>
                        </CardContent>
                    </div>
                    <CardMedia
                        className={classes.cover}
                        image={SpaceImage}
                        title="Live from space album cover"
                    />
                </Card> */}
      </Grid>
    </Grid>
  );
};

Login.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  width: PropTypes.string.isRequired
};

export default compose(withWidth(), withStyles(themeStyles, { withTheme: true }))(Login);
