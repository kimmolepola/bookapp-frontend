import React from 'react';
import { useQuery } from 'react-apollo';
import Container from '@material-ui/core/container';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  title: {
    flex: '1 1 100%',
  },
}));


const Recommended = ({ show, user, ALL_BOOKS }) => {
  const classes = useStyles();

  const genre = user ? user.favoriteGenre : null;

  const result = useQuery(ALL_BOOKS, { variables: { genre: user ? user.favoriteGenre : null } });

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  if (!books || books.length === 0) {
    return <div><p />no books in your favorite genre <b>{genre}</b></div>;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography className={classes.title} variant="h6" id="title" component="div">
          Recommendations
        </Typography>
        <Typography style={{ marginTop: 5 }} variant="subtitle2" id="subtitle" component="div">
        Books in your favorite genre {genre}
        </Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <table>
          <tbody>
            <tr>
              <th style={{ textAlign: 'left' }}>
                <b>name</b>
              </th>
              <th style={{ textAlign: 'left' }}>
                <b>author</b>
              </th>
              <th style={{ textAlign: 'left' }}>
                <b>published</b>
              </th>
            </tr>
            {books.map((x, y) => (
              <tr key={x.title.concat(y)}>
                <td>{x.title}</td>
                <td>{x.author.name}</td>
                <td>{x.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </div>
  );
};

export default Recommended;
