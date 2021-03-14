import { ThemeProvider, withStyles, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import React, { useState, useEffect } from 'react';
import {
  useSubscription, useApolloClient,
} from 'react-apollo';

import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Navigator from './Navigator';
import Content from './Content';
import Header from './Header';
import { bookapptheme as theme, drawerWidth, styles } from './Theme';
import { ME, BOOK_ADDED } from './gql_defs';

function App({ classes }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const client = useApolloClient();

  const [user, setUser] = useState({ favoriteGenre: null });
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('Authors');
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [tab, setTab] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarTransition, setSnackbarTransition] = React.useState(undefined);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const Trans = ({ color }) => (
    function TransitionLeft(props) {
      return <Slide {...props} style={{ backgroundColor: color }} direction="left" />;
    }
  );

  const snackbarHandleClick = (Transition) => {
    setSnackbarTransition(() => Transition);
    setSnackbarOpen(true);
  };

  const snackbarHandleClose = () => {
    setSnackbarOpen(false);
  };

  const handleNotification = (notific) => {
    setSnackbarMessage(notific);
    snackbarHandleClick(Trans({ color: '#5cb85c' }));
    setNotification(notific);
    setTimeout(() => {
      snackbarHandleClose();
      setNotification(null);
    }, 5000);
  };

  const handleError = (error) => {
    if (error.graphQLErrors && error.graphQLErrors[0]) {
      setSnackbarMessage(error.graphQLErrors[0].message);
      snackbarHandleClick(Trans({ color: '#d9534f' }));
      setErrorMessage(error.graphQLErrors[0].message);
    } else {
      setSnackbarMessage(error.toString());
      snackbarHandleClick(Trans({ color: '#d9534f' }));
      setErrorMessage(error.toString());
    }
    setTimeout(() => {
      snackbarHandleClose();
      setErrorMessage(null);
    }, 5000);
  };


  useEffect(() => {
    setToken(localStorage.getItem('book-app-user-token'));
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('login');
  };


  useEffect(() => {
    if (token) {
      const setupUser = async () => {
        const usr = (await client.query({ query: ME, fetchPolicy: 'no-cache' })).data.me;
        setUser(usr);
        handleNotification(`Logged in as ${usr ? usr.username : null}`);
      };
      setupUser();
    } else {
      setUser({ favoriteGenre: null });
    }
  }, [token, ME, client]);

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded;
      const content = `title: ${book.title}, author: ${book.author.name}, published: ${book.published}, genres: ${book.genres.join(', ')}`;
      handleNotification(`Book added: ${content}`);
      setPage('Books');
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          autoHideDuration={10000}
          onClose={snackbarHandleClose}
          TransitionComponent={snackbarTransition}
          key={snackbarTransition ? snackbarTransition.name : ''}
          message={snackbarMessage}
        />
        <nav className={classes.drawer}>
          <Hidden smUp implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              setTab={setTab}
              page={page}
              setPage={setPage}
            />
          </Hidden>
          <Hidden xsDown implementation="css">
            <Navigator setTab={setTab} page={page} setPage={setPage} PaperProps={{ style: { width: drawerWidth } }} />
          </Hidden>
        </nav>
        <div className={classes.app}>
          <Header user={user} tab={tab} setTab={setTab} page={page} onDrawerToggle={handleDrawerToggle} />
          <main className={classes.main}>
            <Content
              page={page}
              user={user}
              setPage={setPage}
              client={client}
              setToken={setToken}
              handleNotification={handleNotification}
              handleError={handleError}
              tab={tab}
              setTab={setTab}
            />
          </main>
          <footer className={classes.footer}>
            footer
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default withStyles(styles)(App);

/*
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          onClose={snackbarHandleClose}
          TransitionComponent={snackbarTransition}
          message={snackbarMessage.message}
          key={snackbarTransition ? snackbarTransition.name : ''}
        >

*/
