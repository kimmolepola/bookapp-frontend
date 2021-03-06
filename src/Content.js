
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  useQuery, useMutation,
} from 'react-apollo';

import Recommended from './components/Recommended';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoremIpsum from './components/LoremIpsum';
import {
  LOGIN, CREATE_USER, EDIT_AUTHOR, ALL_AUTHORS, CREATE_BOOK, ALL_BOOKS, ALL_GENRES,
} from './gql_defs';

import EditAuthors from './components/EditAuthors';

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});


function Content({
  page,
  setPage,
  client,
  user,
  setToken,
  handleNotification,
  handleError,
  tab,
  setTab,
}) {
  const displayIfUser = { display: user && user.username ? '' : 'none' };
  const displayIfNoUser = { display: user && user.username ? 'none' : '' };

  const [genre, setGenre] = useState('');

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    refetchQueries: [
      { query: ALL_AUTHORS },
      { query: ALL_BOOKS, variables: { genre: '' } },
      { query: ALL_BOOKS, variables: { genre: user ? user.favoriteGenre : null } },
      { query: ALL_GENRES }],
  });

  const authors = useQuery(ALL_AUTHORS);
  const genresResult = useQuery(ALL_GENRES);


  const booksResult = useQuery(ALL_BOOKS, { variables: { genre } });

  return (
    <div>
      <Authors
        result={authors}
        show={page === 'Authors' && tab === 0}
      />

      <EditAuthors
        handleNotification={handleNotification}
        handleError={handleError}
        editAuthor={editAuthor}
        result={authors}
        show={page === 'Authors' && tab === 1}
      />

      <Books
        booksResult={booksResult}
        genresResult={genresResult}
        show={page === 'Books' && tab === 0}
        genre={genre}
        setGenre={setGenre}

      />

      <Recommended
        client={client}
        ALL_BOOKS={ALL_BOOKS}
        user={user}
        show={page === 'Books' && tab === 1}
      />

      <NewBook
        setTab={setTab}
        addBook={addBook}
        show={page === 'Books' && tab === 2}
        setGenre={setGenre}
        handleNotification={handleNotification}
      />


      <LoremIpsum
        setPage={setPage}
        setToken={setToken}
        show={page === 'LoremIpsum'}
        tab={tab}
      />

    </div>
  );
}

export default withStyles(styles)(Content);

/*

 <Recommended
        client={client}
        ALL_BOOKS={ALL_BOOKS}
        user={user}
        show={page === 'Books' && tab === 1}
      />


      {notification && (
      <div style={{ color: 'green' }}>
        {notification}

      </div>
      )}
      {errorMessage
                    && (
                    <div style={{ color: 'red' }}>
                      {errorMessage}
                    </div>
                    )}


    return (
        <Paper className={classes.paper}>
            <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
                <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <SearchIcon className={classes.block} color="inherit" />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder="Search by email address, phone number, or user UID"
                                InputProps={{
                                    disableUnderline: true,
                                    className: classes.searchInput,
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" className={classes.addUser}>
                                Add user
              </Button>
                            <Tooltip title="Reload">
                                <IconButton>
                                    <RefreshIcon className={classes.block} color="inherit" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <div className={classes.contentWrapper}>
                <Typography color="textSecondary" align="center">
                    No users for this project yet
        </Typography>
            </div>
        </Paper>
    );

*/
