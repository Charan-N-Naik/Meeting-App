import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Collapse from '@mui/material/Collapse';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthComnntext';
import Snackbar from '@mui/material/Snackbar';

const theme = createTheme();


export default function Authontication() {

  const { handleRegister, handleLogin } = React.useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [formState, setformState] = React.useState(0);
  const [password, setpassword] = React.useState("");
  const [name, setname] = React.useState("");
  const [messages, setMessages] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showForm, setShowForm] = React.useState(true);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const switchForm = (newState) => {
    if (newState === formState) return;
    setShowForm(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setformState(newState);
      setShowForm(true);
      timerRef.current = null;
    }, 350);
  };
  let handleAuth = async () => {
    try {
      if (formState === 0) {
        let res = await handleLogin(username, password);
        console.log(res);


        // signin
      }
      if (formState === 1) {
        // register
        let res = await handleRegister(name, username, password);
        console.log(res);
        setUsername("");
        setMessages(res);
        setOpen(true);
        setError("");
        setformState(0);
        setpassword("");
      }


    } catch (e) {

      const msg = e?.response?.data?.message || "Something went wrong";
      setError(msg);

    }
  }




  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }} justifyContent="center" alignItems="center">

        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <Grow in={showForm} timeout={{ enter: 500, exit: 350 }}>
            <Box
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: 6,
                borderRadius: 2,

              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>

              <div>
                <Button variant={formState === 0 ? "contained" : ""} onClick={() => { switchForm(0); }}>
                  Sign in
                </Button>
                <Button variant={formState == 1 ? "contained" : ""} onClick={() => { switchForm(1); }}>
                  Sign up
                </Button>
              </div>

              <Box component="form" noValidate sx={{ mt: 1 }}>


                <Collapse in={formState == 1} timeout={500} unmountOnExit>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="fullname"
                    label="Fullname"
                    name="Fullname"
                    value={name}
                    onChange={e => setname(e.target.value)}
                  />
                </Collapse>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => { setpassword(e.target.value) }}

                />

                <p style={{ color: "red" }}>{error}</p>


                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleAuth}
                >
                  {formState == 0 ? "Sign In" : "Sign Up"}
                </Button>
              </Box>
            </Box>
          </Grow>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message={messages}
      />

    </ThemeProvider>
  );
}
