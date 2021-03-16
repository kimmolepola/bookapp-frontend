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

const Login = React.forwardRef(({
  login,
  setToken,
  setUsername,
  setPassword,
  username,
  password,
  signInError,
  handleSignInModalClose,
  signUpFlow,
}, ref) => {
  // Material-ui comment: getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const onCancel = () => {
    handleSignInModalClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    const result = await login({
      variables: {
        username, password,
      },
    });

    if (result) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('book-app-user-token', token);
      setUsername('');
      setPassword('');
      handleSignInModalClose();
    }
  };
  return (
    <div ref={ref}>
      <Typography style={{ marginTop: bookapptheme.spacing(2) }} color="primary" variant="h3" gutterBottom>
        Sign in
      </Typography>
      <ValidatorForm onSubmit={submit}>
        <Grid style={{ marginTop: 60 }} container alignItems="center" direction="column">
          <Typography style={{ margin: 20 }} color="error" variant="h6" display="block" gutterBottom>
            {signInError}
          </Typography>
          {signUpFlow && (
          <>
            <Typography align="center" style={{ margin: 20 }} color="textSecondary" variant="h6" display="block" gutterBottom>
              Sign up successful.<br />Please sign in.
            </Typography>
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
                  value={username}
                  onChange={(x) => setUsername(x.target.value)}
                />
              </Grid>
              <Grid item>
                <TextValidator
                  autocapitalize="off"
                  validators={['required']}
                  errorMessages={['Password is required']}
                  variant="outlined"
                  id="password"
                  label="Password"
                  type="password"
                  helperText={signUpFlow && 'password is "qwer"'}
                  value={password}
                  onChange={(x) => setPassword(x.target.value)}
                />
              </Grid>
              <Grid item>
                <Button onClick={onCancel} style={{ marginRight: 5 }} variant="contained" color="default">Cancel</Button>
                <Button variant="contained" color="primary" type="submit">Login</Button>
              </Grid>
            </Grid>
          </Box>
          <Grid item style={{ marginTop: 40 }}>
            {!signUpFlow
            && (
            <>
              <Typography color="textSecondary" variant="caption" display="block" gutterBottom>
                Please use username: qwer password: qwer
              </Typography>
            </>
            )}
          </Grid>
        </Grid>
      </ValidatorForm>
    </div>
  );
});

Login.displayName = 'Login';

export default withStyles(styles)(Login);
