import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import { bookapptheme } from '../Theme';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(2),
  },
}));

export default function SimplePopover({
  popoverAnchorEl: anchorEl,
  handlePopoverClose: handleClose,
  genres,
  setSelectedGenres,
  selectedGenres,
}) {
  const handleChange = (event) => {
    if (event.target.checked) {
      setSelectedGenres([...selectedGenres, event.target.id]);
    } else {
      const newArray = selectedGenres.reduce((total, current) => {
        if (event.target.id !== current) {
          total.push(current);
        }
        return total;
      }, []);
      setSelectedGenres(newArray);
    }
  };

  const classes = useStyles();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const genresNew = [...genres, 'No genre'];

  genresNew.sort(
    (a, b) => {
      const _a = a[0].toLowerCase(); // eslint-disable-line
      const _b = b[0].toLowerCase(); // eslint-disable-line
      if (_a < _b) return -1;
      if (_a > _b) return 1;
      return 0;
    },
  );


  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className={classes.root}>
          <FormControl className={classes.formControl}>
            <FormLabel>Filter genres</FormLabel>
            {genresNew.map((x, y) => (
              <FormControlLabel
                key={x.concat(y)}
                control={(
                  <Checkbox
                    id={x}
                    checked={selectedGenres.includes(x)}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    color="primary"
                  />
              )}
                label={x}
                labelPlacement="end"
              />
            ))}
          </FormControl>
        </div>
      </Popover>
    </div>
  );
}
/*
<Typography className={classes.typography}>{x}</Typography>

      <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
        Open Popover
      </Button>
*/
