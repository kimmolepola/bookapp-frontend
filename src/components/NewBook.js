import React, { useState } from 'react';
import clsx from 'clsx'; // eslint-disable-line import/no-extraneous-dependencies
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import {
  IconButton, Button,
} from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';


const useFormStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      paddingRight: theme.spacing(2),
      width: '100%',
    },
    button: {
      margin: theme.spacing(1),
    },
  },
}));


function EnhancedTableHead(props) {
  const {
    classes,
  } = props;

  return (
    <TableHead>
      <TableRow />
    </TableHead>
  );
}


const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));


const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();

  return (
    <div>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: false,
        })}
      >

        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Add a book
        </Typography>


      </Toolbar>
    </div>
  );
};


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    maxWidth: 500,
    marginBottom: theme.spacing(2),
  },
  table: {

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
}));

export default function NewBook({
  show, addBook, setTab, setGenre: setFilterGenre, handleNotification,
}) {
  const [title, setTitle] = useState('');
  const [author, setAuhtor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const classes = useStyles();
  const formClasses = useFormStyles();

  if (!show) {
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    addBook({
      variables: {
        title, published: parseInt(published, 10), author, genres,
      },
    });

    handleNotification(`${title} by ${author} added to library`);

    setTitle('');
    setPublished('');
    setAuhtor('');
    setGenres([]);
    setGenre('');

    setFilterGenre('');
    setTab(0);
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };


  const onReset = () => {
    setTitle('');
    setPublished('');
    setAuhtor('');
    setGenres([]);
    setGenre('');
  };

  const AddButton = () => (
    <IconButton onClick={addGenre}>
      <LibraryAdd />
    </IconButton>
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
            />
          </Table>
        </TableContainer>

        <ValidatorForm
          onSubmit={onSubmit}
        >
          <div className={formClasses.root} style={{ padding: 10 }}>

            <div>
              <TextValidator
                error={false}
                id="title"
                label="Title"
                value={title}
                validators={['required']}
                errorMessages={['This field is required']}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              <TextValidator
                error={false}
                id="author"
                label="Author"
                value={author}
                validators={['required']}
                errorMessages={['This field is required']}
                onChange={({ target }) => setAuhtor(target.value)}
              />
            </div>
            <div>
              <TextValidator
                error={false}
                id="published"
                label="Published"
                value={published}
                validators={['required', 'minNumber:-1000', 'maxNumber:3000']}
                errorMessages={['This field is required', 'Enter publication year', 'Enter publication year']}
                onChange={({ target }) => setPublished(target.value)}
              />
            </div>
            <div>
              <TextField
                error={false}
                id="genre"
                label="Genre"
                value={genre}
                onChange={({ target }) => setGenre(target.value)}
                InputProps={{ endAdornment: <AddButton /> }}
              />
            </div>
            <div style={{ padding: 10 }}>
              {genres.length > 0 ? `Selected genres: ${genres.join(', ')}` : null}
            </div>
            <Button
              variant="outlined"
              color="default"
              className={formClasses.button}
              style={{ marginRight: 5 }}
              onClick={onReset}
            > Reset
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={formClasses.button}
            > Submit
            </Button>

          </div>
        </ValidatorForm>


      </Paper>
    </div>
  );
}
