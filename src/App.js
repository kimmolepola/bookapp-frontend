import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import React, { useState, useEffect } from 'react';
import {
  useQuery, useMutation, useSubscription, useApolloClient,
} from 'react-apollo';

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
  const [page, setPage] = useState('books');
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleNotification = (notific) => {
    setNotification(notific);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleError = (error) => {
    if (error.graphQLErrors && error.graphQLErrors[0]) {
      setErrorMessage(error.graphQLErrors[0].message);
    } else {
      setErrorMessage(error.toString());
    }
    setTimeout(() => {
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
        handleNotification(`logged in as ${usr ? usr.username : null}`);
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
      handleNotification(`book added: ${content}`);
      setPage('books');
    },
  });

  const handleClick = () => {
    console.log('clickc');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <nav className={classes.drawer}>
          <Hidden smUp implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          </Hidden>
          <Hidden xsDown implementation="css">
            <Navigator setPage={setPage} PaperProps={{ style: { width: drawerWidth } }} />
          </Hidden>
        </nav>
        <div className={classes.app}>
          <Header onDrawerToggle={handleDrawerToggle} />
          <main className={classes.main}>
            <Content
              page={page}
              user={user}
              setPage={setPage}
              client={client}
              setToken={setToken}
              handleNotification={handleNotification}
              handleError={handleError}
              notification={notification}
              errorMessage={errorMessage}
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
