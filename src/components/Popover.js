import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  typography: {
    // padding: theme.spacing(2),
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
    console.log(selectedGenres);
    console.log(event.target);
    if (event.target.checked) {
      setSelectedGenres([...selectedGenres, event.target.id]);
    } else {
      const newArray = selectedGenres.reduce((total, current) => {
        if (event.target.id !== current) {
          console.log('push: ', current);
          total.push(current);
        }
        return total;
      }, []);
      setSelectedGenres(newArray);
    }
  };

  const classes = useStyles();

  console.log('anchorEl', anchorEl);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  genres.sort(
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
        <div style={{ backgroundColor: 'lightGrey', padding: 10, marginBottom: 5 }}><b>Filter genres</b></div>
        <div>
          {genres.map((x, y) => (
            <div style={{ paddingRight: 30 }} key={x.concat(y)}>
              <Checkbox
                id={x}
                checked={selectedGenres.includes(x)}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              {x}
            </div>
          ))}
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
