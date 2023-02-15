import logo from './logo.jpg';
import { Box, Container, AppBar, Toolbar } from "@mui/material"
import Main from "./components/Main"

function App() {
  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      height: '100vh',
      backgroundColor: theme => theme.palette.background.default,
      padding: 0,
      margin: 0,
      overflow: 'auto',
    }}>
      <Container maxWidth="lg">
        <AppBar position="static">
          <Toolbar>
            <img src={logo} width="32px" alt="logo"></img>
          </Toolbar>
        </AppBar>
        <Main />
      </Container>
    </Box>
  );
}

export default App;
