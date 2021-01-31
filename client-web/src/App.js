
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import SignIn from './components/auth/SignIn';
import AppRouter from './components/routers/AppRouter';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRouter></AppRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
