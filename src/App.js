import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { useSubscription, useApolloClient, useMutation } from 'react-apollo';
import {
  Modal, Paper, Typography, Snackbar, CssBaseline, Hidden, Slide,
} from '@material-ui/core';
import {
  bookapptheme, bookapptheme as theme, drawerWidth, styles,
} from './Theme';
import {
  LOGIN, CREATE_USER, ME, BOOK_ADDED,
} from './gql_defs';
import CreateUser from './components/CreateUser';
import Login from './components/Login';
import Navigator from './Navigator';
import Content from './Content';
import Header from './Header';


function getModalStyle() {
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

  const Trans = ({ color }) => (
    function TransitionLeft(props) {
      return (
        <Slide
          {...props}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          direction="left"
        >
          <Paper
            style={{
              backgroundColor: color,
              paddingLeft: bookapptheme.spacing(2),
              paddingRight: bookapptheme.spacing(2),
              paddingTop: bookapptheme.spacing(1),
              paddingBottom: bookapptheme.spacing(1),
            }}
          >
            <Typography variant="body2">
              <div style={{ color: 'white' }}>{props.children.props.message /* eslint-disable-line react/destructuring-assignment */}</div>
            </Typography>

          </Paper>
        </Slide>
      );
    }
  );

  // {props.children.props.message /* eslint-disable-line react/destructuring-assignment */}

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
    setTimeout(() => {
      snackbarHandleClose();
    }, 5000);
  };

  const handleError = (error) => {
    let errorMsg = error.graphQLErrors && error.graphQLErrors[0]
      ? error.graphQLErrors[0].message
      : error.toString();
    errorMsg = errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1);
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
      setSignInError(null);
      setSignUpError(null);
    }, 5000);
  };

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
          <div style={modalStyle} className={classes.loginPaper}>
            This app is a worksample based on the Fullstackopen course <a href="https://fullstackopen.com/en/part8">assignment</a>.
            The UI uses Material-UI Paperbase theme. {!(user && user.username) && 'Sign in to see more content.'}
          </div>
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
            Book app source code at <a href="https://github.com/kimmolepola/bookapp-frontend">GitHub</a>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default withStyles(styles)(App);
