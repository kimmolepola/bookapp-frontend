import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button, Grid, Typography, Box,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { styles, bookapptheme } from '../Theme';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
/*
const useStyles = makeStyles((theme) => ({
  loginPaper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
*/

const CreateUser = React.forwardRef(({
  handleSignUpModalClose,
  createUser,
  signUpUsername,
  setSignUpUsername,
  signUpFavGenre,
  setSignUpFavGenre,
  signUpError,
  handleSuccessfulSignUp,
}, ref) => {
  // Material-ui comment: getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const onCancel = () => {
    handleSignUpModalClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    const response = await createUser({
      variables: {
        username: signUpUsername, favGenre: signUpFavGenre,
      },
    });
    if (response && response.data && response.data.createUser && response.data.createUser.username) {
      handleSuccessfulSignUp();
    }
  };
  return (
    <div ref={ref}>
      <Typography style={{ marginTop: bookapptheme.spacing(2) }} color="primary" variant="h3" gutterBottom>
        Sign up
      </Typography>
      <ValidatorForm onSubmit={submit}>
        <Grid style={{ marginTop: 60 }} container alignItems="center" direction="column">
          {signUpError && (
          <>
            <Grid item>
              <Typography style={{ margin: 20 }} color="error" variant="h6" display="block" gutterBottom>
              Something went wrong
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="center" style={{ marginBottom: 20 }} color="error" variant="caption" display="block" gutterBottom>
                {signUpError}
              </Typography>
            </Grid>
          </>
          )}
          <Box>
            <Grid container spacing={2} alignItems="flex-start" direction="column">
              <Grid item>
                <TextValidator
                  autocapitalize="off"
                  validators={['required']}
                  errorMessages={['Username is required']}
                  variant="outlined"
                  id="username"
                  label="Username"
                  value={signUpUsername}
                  onChange={(x) => setSignUpUsername(x.target.value)}
                />
              </Grid>
              <Grid item>
                <TextValidator
                  autocapitalize="off"
                  validators={['required']}
                  errorMessages={['Genre is required']}
                  variant="outlined"
                  id="genre"
                  label="Favourite genre"
                  value={signUpFavGenre}
                  onChange={(x) => setSignUpFavGenre(x.target.value)}
                />
              </Grid>
              <Grid item>
                <Button onClick={onCancel} style={{ marginRight: 5 }} variant="contained" color="default">Cancel</Button>
                <Button variant="contained" color="primary" type="submit">Submit</Button>
              </Grid>
            </Grid>
          </Box>
          <Grid item style={{ marginTop: 40 }}>
            <Typography align="center" color="textSecondary" variant="caption" display="block" gutterBottom>
              Setting passwords is omitted in this worksample. Password is always &quot;qwer&quot;.
            </Typography>
          </Grid>
        </Grid>
      </ValidatorForm>
    </div>
  );
});

CreateUser.displayName = 'CreateUser';

export default withStyles(styles)(CreateUser);
//
