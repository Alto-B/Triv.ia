import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import SignIn from './components/auth/SignIn';
import AppRouter from './components/routers/AppRouter';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6100EB"
    }
  }
})

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
      <div className="App">
        <AppRouter></AppRouter>
      </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
