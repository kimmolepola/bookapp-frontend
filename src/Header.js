import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { TramRounded } from '@material-ui/icons';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

function Header(props) {
  const {
    setTab,
    page,
    classes,
    onDrawerToggle,
    tab,
    user,
    handleLogout,
    setSignInModalOpen,
    setSignUpModalOpen,
    setHelpModalOpen,
  } = props;

  const onTabChange = (event, value) => {
    setTab(value);
  };

  const onSignUp = () => {
    setSignInModalOpen(false);
    setSignUpModalOpen(true);
    setHelpModalOpen(false);
  };

  const onSignIn = () => {
    setSignInModalOpen(true);
    setSignUpModalOpen(false);
    setHelpModalOpen(false);
  };

  const onHelp = () => {
    setSignInModalOpen(false);
    setSignUpModalOpen(false);
    setHelpModalOpen(true);
  };

  const onSignOut = () => {
    handleLogout();
  };

  return (
    <>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
            {(!user || !user.username) && (
            <Grid item>
              <Button onClick={onSignUp} className={classes.button} color="inherit" size="small" variant="outlined">Sign up</Button>
            </Grid>
            )}
            {(!user || !user.username) && (
            <Grid item>

              <Button onClick={onSignIn} className={classes.button} color="inherit" size="small" variant="text">Sign in</Button>
            </Grid>
            )}
            {(user && user.username) && (
            <Grid item>
              <Button onClick={onSignOut} className={classes.button} color="inherit" size="small" variant="text">Sign out</Button>
            </Grid>
            )}
            {false && (
            <div>
              <Grid item xs />
              <Grid item>
                <Link className={classes.link} href="#" variant="body2">
                                Go to docs
                </Link>
              </Grid>
              <Grid item>
                <Tooltip title="Alerts • No alerts">
                  <IconButton color="inherit">
                    <NotificationsIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <IconButton color="inherit" className={classes.iconButtonAvatar}>
                  <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
                </IconButton>
              </Grid>
            </div>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {page}
              </Typography>
            </Grid>
            {false && (
            <div>
              <Grid item>
                <Button className={classes.button} variant="outlined" color="inherit" size="small">
                                      Web setup
                </Button>
              </Grid>
            </div>
            )}
            <Grid item>
              <Tooltip title="Help">
                <IconButton onClick={onHelp} color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        {page === 'Books' && (!user || (user && !user.username))
        && (
        <Tabs value={tab} textColor="inherit" onChange={onTabChange}>
          <Tab textColor="inherit" label="Library" />
        </Tabs>
        )}
        {page === 'Books' && user && user.username
        && (
        <Tabs value={tab} textColor="inherit" onChange={onTabChange}>
          <Tab textColor="inherit" label="Library" />
          <Tab textColor="inherit" label="Recommended" />
          <Tab textColor="inherit" label="Add book" />
        </Tabs>
        )}
        {page === 'Authors' && (!user || (user && !user.username))
        && (
        <Tabs value={tab} textColor="inherit" onChange={onTabChange}>
          <Tab textColor="inherit" label="All authors" />
        </Tabs>
        )}
        {page === 'Authors' && user && user.username
        && (
        <Tabs value={tab} textColor="inherit" onChange={onTabChange}>
          <Tab textColor="inherit" label="All authors" />
          <Tab textColor="inherit" label="Edit" />
        </Tabs>
        )}
        {page === 'LoremIpsum'
        && (
        <Tabs value={tab} textColor="inherit" onChange={onTabChange}>
          <Tab textColor="inherit" label="Lorem" />
          <Tab textColor="inherit" label="Ipsum" />
          <Tab textColor="inherit" label="Dolor" />
          <Tab textColor="inherit" label="Sit" />
        </Tabs>
        )}


      </AppBar>
    </>
  );
}

export default withStyles(styles)(Header);

/*
            <AppBar
                component="div"
                className={classes.secondaryBar}
                color="primary"
                position="static"
                elevation={0}
            >
                <Tabs value={0} textColor="inherit">
                    <Tab textColor="inherit" label="Books" />
                    <Tab textColor="inherit" label="Authors" />
                    <Tab textColor="inherit" label="Add book" />
                    <Tab textColor="inherit" label="Recommended" />
                </Tabs>
            </AppBar>

*/
