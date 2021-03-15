import { ThemeProvider, withStyles, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import React, { useState, useEffect } from 'react';
import {
  useSubscription, useApolloClient, useMutation,
} from 'react-apollo';

import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Modal, Paper } from '@material-ui/core';
import Navigator from './Navigator';
import Content from './Content';
import Header from './Header';
import { bookapptheme as theme, drawerWidth, styles } from './Theme';
import {
  LOGIN, CREATE_USER, ME, BOOK_ADDED,
} from './gql_defs';
import CreateUser from './components/CreateUser';
import Login from './components/Login';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
  };
}


function App({ classes }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const client = useApolloClient();

  const [user, setUser] = useState({ favoriteGenre: null });
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('Books');
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [tab, setTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarTransition, setSnackbarTransition] = React.useState(undefined);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState(null);
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpFavGenre, setSignUpFavGenre] = useState('');
  const [signUpError, setSignUpError] = useState(null);
  const [signUpFlow, setSignUpFlow] = useState(false);

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
    let errorMsg = error.graphQLErrors && error.graphQLErrors[0]
      ? error.graphQLErrors[0].message
      : error.toString();
    errorMsg = errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1);
    setErrorMessage(errorMsg);
    if (!signInModalOpen && !signUpModalOpen) {
      setSnackbarMessage(errorMsg);
      snackbarHandleClick(Trans({ color: '#d9534f' }));
    } else if (signInModalOpen) {
      setSignInError(errorMsg);
      setSignUpFlow(false);
    } else if (signUpModalOpen) {
      setSignUpError(errorMsg);
    }
    setTimeout(() => {
      snackbarHandleClose();
      setErrorMessage(null);
      setSignInError(null);
      setSignUpError(null);
    }, 5000);
  };

  console.log('sign in error: ', signInError);

  useEffect(() => {
    setToken(localStorage.getItem('book-app-user-token'));
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    if (page !== 'LoremIpsum') {
      setTab(0);
    }
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

  const [login] = useMutation(LOGIN, {
    onError: handleError,
  });
  const [createUser] = useMutation(CREATE_USER, {
    onError: handleError,
  });

  const ref = React.createRef();

  const handleSignInModalClose = () => {
    setUsername('');
    setPassword('');
    setSignInModalOpen(false);
    setSignUpFlow(false);
  };

  const handleSignUpModalClose = () => {
    setSignUpUsername('');
    setSignUpFavGenre('');
    setSignUpModalOpen(false);
  };

  const handleSuccessfulSignUp = () => {
    setSignUpUsername('');
    setSignUpFavGenre('');
    setSignUpModalOpen(false);
    setSignInModalOpen(true);
    handleNotification('New user registered');
    setSignUpFlow(true);
  };

  const [modalStyle] = React.useState(getModalStyle);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Modal
          open={signInModalOpen}
          onClose={handleSignInModalClose}
          aria-labelledby="sign-in modal"
        >
          <div style={modalStyle} className={classes.loginPaper}>
            <Login
              setPage={setPage}
              setToken={setToken}
              login={login}
              setUsername={setUsername}
              setPassword={setPassword}
              username={username}
              password={password}
              ref={ref}
              show
              handleSignInModalClose={handleSignInModalClose}
              signInError={signInError}
              signUpFlow={signUpFlow}
            />
          </div>
        </Modal>
        <Modal
          open={signUpModalOpen}
          onClose={() => setSignUpModalOpen(false)}
          aria-labelledby="sign-up modal"
        >
          <div style={modalStyle} className={classes.loginPaper}>
            <CreateUser
              setPage={setPage}
              setToken={setToken}
              login={login}
              setUsername={setUsername}
              setPassword={setPassword}
              username={username}
              password={password}
              ref={ref}
              handleSignUpModalClose={handleSignUpModalClose}
              signInError={signInError}
              signUpUsername={signUpUsername}
              setSignUpUsername={setSignUpUsername}
              signUpFavGenre={signUpFavGenre}
              setSignUpFavGenre={setSignUpFavGenre}
              createUser={createUser}
              handleNotification={handleNotification}
              signUpError={signUpError}
              handleSuccessfulSignUp={handleSuccessfulSignUp}
            />
          </div>
        </Modal>
        <Modal
          open={helpModalOpen}
          onClose={() => setHelpModalOpen(false)}
          aria-labelledby="help modal"
        >
          <div>help</div>
        </Modal>
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
          <Header
            handleLogout={handleLogout}
            user={user}
            tab={tab}
            setTab={setTab}
            page={page}
            onDrawerToggle={handleDrawerToggle}
            setSignInModalOpen={setSignInModalOpen}
            setSignUpModalOpen={setSignUpModalOpen}
            setHelpModalOpen={setHelpModalOpen}
          />
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

<CreateUser
            handleNotification={handleNotification}
            createUser={createUser}
          />


        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          onClose={snackbarHandleClose}
          TransitionComponent={snackbarTransition}
          message={snackbarMessage.message}
          key={snackbarTransition ? snackbarTransition.name : ''}
        >

*/
