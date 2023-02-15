import logo from './logo.jpg';
import {Container, AppBar, Toolbar} from "@mui/material"
import Main from "./Main"

function App() {
  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <img src={logo} width="32px"></img>
        </Toolbar>
      </AppBar>
      <Main />
    </Container>
  );
}

export default App;
