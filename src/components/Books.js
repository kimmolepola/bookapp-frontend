import React, { useState, useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const Books = ({
  show, genresResult, genre, setGenre, booksResult,
}) => {
  const resetGenre = () => {
    setGenre('');
  };

  if (!show) {
    return null;
  }

  if (booksResult.loading || genresResult.loading) {
    return <div>loading...</div>;
  }

  const books = booksResult && booksResult.data ? booksResult.data.allBooks : null;
  const genres = genresResult && genresResult.data ? genresResult.data.allGenres : null;

  const Genres = () => (
    <div>
      {genres ? genres.map((x) => <button key={x} type="button" onClick={async () => { setGenre(x); }}>{x}</button>) : null}
      <button type="button" onClick={() => resetGenre()}>all genres</button>
    </div>
  );

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>

  );
};

export default Books;


/*
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Author</TableCell>
            <TableCell align="right">Published</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books ? books.map((book, i) => (
            <TableRow key={book.title.concat(i)}>
              <TableCell component="th" scope="row">
                {book.title}
              </TableCell>
              <TableCell align="right">{book.author.name}</TableCell>
              <TableCell align="right">{book.published}</TableCell>
            </TableRow>
          )) : null}
        </TableBody>
      </Table>
    </TableContainer>

*/
