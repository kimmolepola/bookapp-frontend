import React, { useState } from 'react';
import clsx from 'clsx'; // eslint-disable-line import/no-extraneous-dependencies
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { IconButton, Button } from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useFormStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 300,
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
          Edit author
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
    width: '100%',
    marginBottom: theme.spacing(2),
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
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));


export default function EditAuthor({
  show, result, setTab, handleNotification, handleError, editAuthor,
}) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


  const classes = useStyles();
  const formClasses = useFormStyles();

  if (!show) {
    return null;
  }

  const onReset = () => {
    setName('');
    setYear('');
    setOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const bornInt = parseInt(year, 10);
    if (bornInt) {
      editAuthor({
        variables: {
          name,
          born: bornInt,
        },
      });
      handleNotification(`Updated year of birth of ${name} to ${year}`);
      onReset();
    }
  };


  const xonSubmit = () => {
    console.log('submit');
  };

  const authors = result && result.data ? result.data.allAuthors : null;

  if (!result.data) {
    return (<div>loading...</div>);
  }

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


        <FormControl className={classes.formControl}>
          <InputLabel id="controlled-open-select-label">Name</InputLabel>
          <Select
            labelId="controlled-open-select-label"
            id="controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={name}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {authors.map((x, y) => <MenuItem key={x.name.concat(y)} value={x.name}>{x.name}</MenuItem>)}
          </Select>
        </FormControl>


        <ValidatorForm
          className={classes.formControl}
          onSubmit={onSubmit}
          onError={(errors) => console.log(errors)}
        >
          <div>
            <TextValidator
              style={{ width: 120 }}
              error={false}
              id="year"
              label="Year of birth"
              value={year}
              validators={['required', 'minNumber:-1000', `maxNumber:${new Date().getFullYear()}`]}
              errorMessages={['This field is required', 'Not valid birth year', 'Can not be set to future']}
              onChange={({ target }) => setYear(target.value)}
            />
          </div>

          <div style={{ marginTop: 80, paddingBottom: 10 }}>
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

/*
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
          onError={(errors) => console.log(errors)}
        >
          <div style={{ padding: 10 }}>

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
*/
